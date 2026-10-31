import { readFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { createClient } from "@supabase/supabase-js"

// One-time, owner-requested production media publication. Never use this as a P2 test.
// Uses the pre-existing P5 admin account secrets; never prints access tokens or passwords.
const PROJECT_URL = "https://zfnrhzplwpjpdljraypt.supabase.co"
const SITE_URL = "https://tulius.work/"
const SOURCE = new URL("./illustrations-2026-10-31-no-text.json", import.meta.url)
const allowed = new Set(["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress"])
const expectedSlots = { "invest-rs": 4, "prefeitura-sp": 3, vale: 3, "globo-sportv": 3, inpress: 3 }

function assert(value, message) {
  if (!value) throw new Error(message)
  return value
}
function ok(result, code) {
  if (result.error) throw new Error(code + ": " + result.error.code)
  return result.data
}
const hash = (data) => createHash("sha256").update(data).digest("hex")

async function discoverPublicKey() {
  if (process.env.SUPABASE_PUBLISHABLE_KEY) return process.env.SUPABASE_PUBLISHABLE_KEY
  const site = await fetch(SITE_URL)
  assert(site.ok, "SITE_UNAVAILABLE")
  const html = await site.text()
  const urls = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+\.js[^"']*)["']/gi)]
    .map((match) => new URL(match[1], SITE_URL))
  assert(urls.length > 0, "NO_PUBLIC_SCRIPT")
  for (const url of urls) {
    assert(url.origin === new URL(SITE_URL).origin, "INVALID_SCRIPT_ORIGIN")
    const response = await fetch(url)
    if (!response.ok) continue
    const code = await response.text()
    const publishable = code.match(/sb_publishable_[A-Za-z0-9_-]+/)
    if (publishable) return publishable[0]
    for (const candidate of code.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g) ?? []) {
      try {
        const payload = JSON.parse(Buffer.from(candidate.split(".")[1], "base64url").toString("utf8"))
        if (payload.role === "anon") return candidate
      } catch { /* not a Supabase anon key */ }
    }
  }
  throw new Error("PUBLIC_KEY_NOT_DETECTABLE: provide SUPABASE_PUBLISHABLE_KEY as GitHub Actions secret")
}

async function main() {
  const email = assert(process.env.P5_ADMIN_EMAIL, "P5_EMAIL_SECRET_MISSING")
  const password = assert(process.env.P5_ADMIN_PASSWORD, "P5_PASSWORD_SECRET_MISSING")
  const manifest = JSON.parse(await readFile(SOURCE, "utf8"))
  assert(manifest.assets.length === 19, "INVALID_ASSET_COUNT")
  assert(manifest.assets.filter((a) => a.kind === "slide").length === 16, "INVALID_SLIDE_COUNT")
  const key = await discoverPublicKey()
  const client = createClient(PROJECT_URL, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const session = ok(await client.auth.signInWithPassword({ email, password }), "ADMIN_LOGIN")
  assert(session.user?.id, "ADMIN_USER_MISSING")
  ok(await client.from("admin_users").select("user_id").eq("user_id", session.user.id).single(), "ADMIN_MEMBERSHIP")
  // Explicitly abort instead of making production write if identities or paths are unexpected.
  for (const asset of manifest.assets) {
    assert(allowed.has(asset.slug), "UNKNOWN_COMPANY")
    assert(/^portfolio-generated\/2026-10-31-no-text\/[a-z0-9-]+-0[1-9]\.svg$/.test(asset.path), "INVALID_PATH")
    assert(asset.width === 1200 && asset.height === 1350 && asset.svg.includes('width="1200" height="1350"'), "INVALID_DIMENSIONS")
    assert(Buffer.byteLength(asset.svg) < 8_000_000, "TOO_LARGE")
    assert(!/<script|onload=|<foreignObject/i.test(asset.svg), "UNSAFE_SVG")
    assert(!/<text\b/i.test(asset.svg), "SVG_HAS_VISIBLE_TEXT")
  }
  let newlyUploaded = 0
  let alreadyPresent = 0
  for (const asset of manifest.assets) {
    const bytes = Buffer.from(asset.svg, "utf8")
    const found = ok(await client.from("media_assets")
      .select("id,storage_bucket,storage_path,status")
      .eq("storage_path", asset.path).limit(2), "MEDIA_LOOKUP")
    assert(found.length <= 1, "DUPLICATE_MEDIA_PATH")
    let entry = found[0]
    if (!entry) {
      // Stage in private Storage first; publication is a separate explicit operation below.
      ok(await client.storage.from("portfolio-private").upload(asset.path, bytes, {
        contentType: "image/svg+xml", upsert: false, cacheControl: "3600",
      }), "PRIVATE_UPLOAD")
      entry = ok(await client.from("media_assets").insert({
        storage_bucket: "portfolio-private", storage_path: asset.path,
        mime_type: "image/svg+xml", file_size: bytes.length,
        width: asset.width, height: asset.height,
        alt_text: asset.alt, title: asset.filename,
        credit: "Arte conceitual gerada para o PortfolioTulius; não é registro documental.",
        status: "published",
      }).select("id,storage_bucket,storage_path,status").single(), "MEDIA_REGISTER")
      newlyUploaded++
    } else {
      alreadyPresent++
    }
    if (entry.storage_bucket === "portfolio-private") {
      const blob = ok(await client.storage.from("portfolio-private").download(asset.path), "PRIVATE_DOWNLOAD")
      const downloaded = Buffer.from(await blob.arrayBuffer())
      assert(hash(downloaded) === hash(bytes), "PRIVATE_CHECKSUM_MISMATCH")
      const put = await client.storage.from("portfolio-public").upload(asset.path, downloaded, {
        contentType: "image/svg+xml", upsert: false, cacheControl: "3600",
      })
      if (put.error && put.error.statusCode !== "409") throw new Error("PUBLIC_UPLOAD: " + put.error.code)
      const promoted = ok(await client.from("media_assets").update({
        storage_bucket: "portfolio-public", status: "published",
      }).eq("id", entry.id).eq("storage_bucket", "portfolio-private")
        .select("id").single(), "MEDIA_PUBLICATION")
      assert(promoted.id === entry.id, "MEDIA_ID_CHANGED")
    } else assert(entry.storage_bucket === "portfolio-public", "UNKNOWN_BUCKET")
    const publicBlob = ok(await client.storage.from("portfolio-public").download(asset.path), "PUBLIC_DOWNLOAD")
    assert(hash(Buffer.from(await publicBlob.arrayBuffer())) === hash(bytes), "PUBLIC_CHECKSUM_MISMATCH")
    console.log("MEDIA_OK " + asset.path)
  }
  // Publish all 16 requested project images, preserving the exact slide titles, order,
  // images previously used in other CMS content, framing, and all unrelated JSON.
  let updatedSections = 0
  for (const slug of Object.keys(expectedSlots)) {
    const matching = manifest.assets.filter((a) => a.slug === slug && a.kind === "slide")
    assert(matching.length === expectedSlots[slug], "SLIDE_MAPPING_COUNT")
    const section = ok(await client.from("sections").select("id").eq("slug", slug).single(), "SECTION_LOOKUP")
    const blocks = ok(await client.from("content_blocks")
      .select("id,content_json,updated_at,mobile_panel,status,sort_order")
      .eq("section_id", section.id).eq("sort_order", 1).eq("status", "published"), "BLOCK_LOOKUP")
    const block = assert(blocks.find((b) => b.mobile_panel === "a"), "PUBLISHED_MEDIA_BLOCK_MISSING")
    const json = structuredClone(block.content_json)
    const slides = assert(json.experienceMedia?.slides, "SLIDES_MISSING")
    assert(slides.length === matching.length, "SLIDE_LENGTH_CHANGED")
    for (const image of matching) {
      const index = image.slot - 1
      assert(slides[index]?.title === image.title, "SLIDE_TITLE_CHANGED")
      slides[index].image = client.storage.from("portfolio-public").getPublicUrl(image.path).data.publicUrl
      slides[index].alt = image.alt
      slides[index].caption = image.caption
    }
    const changed = JSON.stringify(json) !== JSON.stringify(block.content_json)
    if (changed) {
      const saved = ok(await client.from("content_blocks").update({ content_json: json })
        .eq("id", block.id).eq("updated_at", block.updated_at)
        .select("id,content_json").single(), "BLOCK_UPDATE_CONFLICT_OR_DENIED")
      assert(saved.content_json.experienceMedia.slides.length === matching.length, "POST_UPDATE_VALIDATION")
      updatedSections++
    }
    console.log("SLIDES_OK " + slug + " " + matching.length)
  }
  await client.auth.signOut()
  console.log("EXPERIENCE_MEDIA_SYNC_SUCCESS " + JSON.stringify({
    assets: 19, mappedSlides: 16, supplemental: 3,
    newlyUploaded, alreadyPresent, updatedSections, dimensions: "1200x1350",
  }))
}
main().catch((error) => {
  console.error("EXPERIENCE_MEDIA_SYNC_FAILED " + (error?.message ?? "unknown"))
  process.exitCode = 1
})
