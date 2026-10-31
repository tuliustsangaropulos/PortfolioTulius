import { createHash } from "node:crypto"
import { createClient } from "@supabase/supabase-js"

// Explicitly approved production correction of three existing CDI slide illustrations.
// Credentials are GitHub Actions secrets; no token is written to the repository or logs.
// The originals are preserved under portfolio-illustrative/2026-10-26/.
const PROJECT_URL = "https://zfnrhzplwpjpdljraypt.supabase.co"
const SITE_URL = "https://tulius.work/"
const VERSION = "portfolio-generated/2026-10-31-cdi-no-text"
const OLD = "portfolio-illustrative/2026-10-26"
const hash = (value) => createHash("sha256").update(value).digest("hex")
function requireValue(value, reason) {
  if (!value) throw Error(reason)
  return value
}
function checked(result, code) {
  if (result.error) throw Error(code + ": " + (result.error.code ?? "UNKNOWN"))
  return result.data
}
async function discoverPublicKey() {
  if (process.env.SUPABASE_PUBLISHABLE_KEY) return process.env.SUPABASE_PUBLISHABLE_KEY
  const page = await fetch(SITE_URL)
  requireValue(page.ok, "SITE_NOT_ACCESSIBLE")
  const html = await page.text()
  const urls = [...html.matchAll(/<script\\b[^>]*\\bsrc=["']([^"']+\\.js[^"']*)["']/gi)]
    .map((match) => new URL(match[1], SITE_URL))
  for (const url of urls) {
    requireValue(url.origin === new URL(SITE_URL).origin, "INVALID_SCRIPT_ORIGIN")
    const response = await fetch(url)
    if (!response.ok) continue
    const code = await response.text()
    const publishable = code.match(/sb_publishable_[A-Za-z0-9_-]+/)
    if (publishable) return publishable[0]
    for (const candidate of code.match(/eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+/g) ?? []) {
      try {
        const data = JSON.parse(Buffer.from(candidate.split(".")[1], "base64url").toString("utf8"))
        if (data.role === "anon") return candidate
      } catch { /* non-Supabase token */ }
    }
  }
  throw Error("SUPABASE_PUBLISHABLE_KEY_NOT_FOUND")
}
function stripSvgText(source) {
  requireValue(source.includes("<svg"), "SOURCE_NOT_SVG")
  requireValue(!/<script\\b|<foreignObject\\b|onload\\s*=|xlink:href=["']https?:/i.test(source), "UNSAFE_SVG_SOURCE")
  const before = (source.match(/<text\\b/gi) ?? []).length
  requireValue(before > 0, "NO_EDITABLE_SVG_TEXT: cannot verify embedded text removal")
  const result = source
    .replace(/<text\\b[^>]*>[\\s\\S]*?<\\/text\\s*>/gi, "")
    .replace(/<text\\b[^>]*\\/>/gi, "")
  requireValue(!/<text\\b|<tspan\\b|<foreignObject\\b/i.test(result), "VISIBLE_TEXT_REMAINING")
  return { svg: result, removed: before }
}
async function main() {
  const email = requireValue(process.env.P5_ADMIN_EMAIL, "P5_ADMIN_EMAIL_MISSING")
  const password = requireValue(process.env.P5_ADMIN_PASSWORD, "P5_ADMIN_PASSWORD_MISSING")
  const client = createClient(PROJECT_URL, await discoverPublicKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const session = checked(await client.auth.signInWithPassword({ email, password }), "ADMIN_LOGIN")
  checked(
    await client.from("admin_users").select("user_id").eq("user_id", session.user.id).single(),
    "ADMIN_MEMBERSHIP",
  )
  const section = checked(await client.from("sections").select("id").eq("slug", "cdi").single(), "CDI_LOOKUP")
  const block = checked(
    await client.from("content_blocks")
      .select("id,content_json,updated_at")
      .eq("section_id", section.id).eq("mobile_panel", "a").eq("sort_order", 1)
      .eq("status", "published").single(),
    "CDI_BLOCK",
  )
  requireValue(block.content_json.experienceMedia?.slides?.length === 3, "CDI_SLIDE_COUNT_CHANGED")
  let imagesChanged = 0
  for (let i = 1; i <= 3; i++) {
    const name = `cdi-0${i}.svg`
    const oldPath = `${OLD}/${name}`
    const newPath = `${VERSION}/${name}`
    const oldSlide = block.content_json.experienceMedia.slides[i - 1]
    requireValue(
      oldSlide.image?.includes(oldPath) || oldSlide.image?.includes(newPath),
      "CDI_SOURCE_CHANGED_" + i,
    )
    const original = checked(
      await client.storage.from("portfolio-public").download(oldPath),
      "CDI_ORIGINAL_DOWNLOAD_" + i,
    )
    const { svg, removed } = stripSvgText(await original.text())
    const bytes = Buffer.from(svg, "utf8")
    const matches = checked(
      await client.from("media_assets").select("id,storage_bucket,storage_path")
        .eq("storage_path", newPath).limit(2),
      "CDI_MEDIA_LOOKUP_" + i,
    )
    requireValue(matches.length < 2, "CDI_MEDIA_DUPLICATES_" + i)
    let entry = matches[0]
    if (!entry) {
      checked(await client.storage.from("portfolio-private").upload(newPath, bytes, {
        contentType: "image/svg+xml", upsert: false, cacheControl: "3600",
      }), "CDI_PRIVATE_STAGE_" + i)
      entry = checked(
        await client.from("media_assets").insert({
          storage_bucket: "portfolio-private",
          storage_path: newPath,
          mime_type: "image/svg+xml",
          file_size: bytes.length,
          width: 1200, height: 675,
          alt_text: oldSlide.alt || oldSlide.title,
          title: name,
          credit: "Ilustração conceitual existente com os elementos textuais removidos; não é fotografia documental.",
          status: "published",
        }).select("id,storage_bucket,storage_path").single(),
        "CDI_MEDIA_REGISTER_" + i,
      )
    }
    if (entry.storage_bucket === "portfolio-private") {
      const privateBlob = checked(await client.storage.from("portfolio-private").download(newPath), "CDI_PRIVATE_VERIFY")
      requireValue(hash(Buffer.from(await privateBlob.arrayBuffer())) === hash(bytes), "CDI_PRIVATE_HASH_MISMATCH")
      const upload = await client.storage.from("portfolio-public").upload(newPath, bytes, {
        contentType: "image/svg+xml", upsert: false, cacheControl: "3600",
      })
      if (upload.error && String(upload.error.statusCode) !== "409") throw Error("CDI_PUBLIC_UPLOAD_" + i)
      checked(
        await client.from("media_assets").update({ storage_bucket: "portfolio-public" })
          .eq("id", entry.id).eq("storage_bucket", "portfolio-private")
          .select("id").single(),
        "CDI_PROMOTION_" + i,
      )
    } else requireValue(entry.storage_bucket === "portfolio-public", "CDI_BUCKET_INVALID")
    const publicBlob = checked(await client.storage.from("portfolio-public").download(newPath), "CDI_PUBLIC_VERIFY")
    requireValue(hash(Buffer.from(await publicBlob.arrayBuffer())) === hash(bytes), "CDI_PUBLIC_HASH_MISMATCH")
    console.log(`CDI_MEDIA_PASS ${name}: ${removed} text nodes removed, verified SHA-256`)
    imagesChanged++
  }
  const fresh = checked(
    await client.from("content_blocks").select("id,content_json,updated_at").eq("id", block.id).single(),
    "CDI_FRESH_BLOCK",
  )
  const updated = structuredClone(fresh.content_json)
  requireValue(updated.experienceMedia?.slides?.length === 3, "CDI_SLIDE_RECHECK")
  for (let i = 1; i <= 3; i++) {
    const name = `cdi-0${i}.svg`
    const slide = updated.experienceMedia.slides[i - 1]
    requireValue(
      slide.image?.includes(`${OLD}/${name}`) || slide.image?.includes(`${VERSION}/${name}`),
      "CDI_IMAGE_CHANGED_BEFORE_LINK_" + i,
    )
    slide.image = client.storage.from("portfolio-public").getPublicUrl(`${VERSION}/${name}`).data.publicUrl
  }
  if (JSON.stringify(updated) !== JSON.stringify(fresh.content_json)) {
    const saved = checked(
      await client.from("content_blocks").update({ content_json: updated })
        .eq("id", block.id).eq("updated_at", fresh.updated_at).select("id,content_json").single(),
      "CDI_BLOCK_CONFLICT",
    )
    requireValue(saved.content_json.experienceMedia.slides.every((s) => s.image.includes(VERSION)), "CDI_SLIDE_LINK_FAILED")
  }
  checked(await client.auth.signOut(), "ADMIN_SIGN_OUT")
  console.log(`CDI_NO_TEXT_DONE: ${imagesChanged}/3 media verified and 3 slide paths updated`)
}
main().catch((error) => {
  console.error("CDI_NO_TEXT_FAILED " + (error.message ?? "Unknown"))
  process.exitCode = 1
})
