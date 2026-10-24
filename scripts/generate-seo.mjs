import { readFile, writeFile } from "node:fs/promises"

const outputPath = new URL("../dist/index.html", import.meta.url)
const fallbackCanonical = "https://tulius.work/"
const fallbackTitle = "Tulius Tsangaropulos — Comunicação e Estratégia"
const fallbackDescription =
  "Portfólio e trajetória profissional em comunicação corporativa, jornalismo, reputação e estratégia."

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function secureHttps(value) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.href : null
  } catch { return null }
}
function replaceMeta(html, name, content, attribute = "name") {
  const match = new RegExp(`<meta\\b[^>]*\\b${attribute}=["']${name}["'][^>]*>`, "i")
  const tag = `<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`
  return match.test(html) ? html.replace(match, tag) : html.replace("</head>", `  ${tag}\n  </head>`)
}
function replaceCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`
  const match = /<link\s+rel=["']canonical["'][^>]*>/i
  return match.test(html) ? html.replace(match, tag) : html.replace("</head>", `  ${tag}\n  </head>`)
}
async function getPublished(table, columns, filters) {
  const base = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!base || !key || !secureHttps(base)) return null
  const query = new URL(`${base}/rest/v1/${table}`)
  query.searchParams.set("select", columns)
  for (const [column, predicate] of Object.entries(filters))
    query.searchParams.set(column, predicate)
  query.searchParams.set("limit", "1")
  const response = await fetch(query, {
    headers: { apikey: key, Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error(`Supabase metadata HTTP ${response.status}`)
  const data = await response.json()
  return Array.isArray(data) ? data[0] ?? null : null
}
async function run() {
  let html = await readFile(outputPath, "utf8")
  let title = fallbackTitle
  let description = fallbackDescription
  let canonical = fallbackCanonical
  let robots = "index,follow"
  let image = null
  let locale = "pt_BR"
  try {
    const [page, settings] = await Promise.all([
      getPublished("pages", "seo_title,seo_description", { slug: "eq.home", status: "eq.published" }),
      getPublished("site_settings", "site_title,description,locale,seo_json", { status: "eq.published" }),
    ])
    if (page?.seo_title?.trim()) title = page.seo_title.trim()
    else if (settings?.site_title?.trim()) title = settings.site_title.trim()
    if (page?.seo_description?.trim()) description = page.seo_description.trim()
    else if (settings?.description?.trim()) description = settings.description.trim()
    canonical = secureHttps(settings?.seo_json?.canonical) ?? fallbackCanonical
    image = secureHttps(settings?.seo_json?.ogImage)
    robots = /^(index|noindex),(follow|nofollow)$/.test(settings?.seo_json?.robots ?? "")
      ? settings.seo_json.robots : robots
    if (settings?.locale && /^[a-z]{2}-[A-Z]{2}$/.test(settings.locale))
      locale = settings.locale.replace("-", "_")
  } catch (error) {
    console.warn("SEO: Supabase indisponível; usando metadados editoriais estáticos.", error?.message)
  }

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  html = replaceMeta(html, "description", description)
  html = replaceMeta(html, "og:title", title, "property")
  html = replaceMeta(html, "og:description", description, "property")
  html = replaceMeta(html, "og:locale", locale, "property")
  html = replaceMeta(html, "twitter:description", description)
  html = replaceMeta(html, "robots", robots)
  html = replaceCanonical(html, canonical)
  if (image) {
    html = replaceMeta(html, "og:image", image, "property")
    html = replaceMeta(html, "twitter:image", image)
    html = replaceMeta(html, "twitter:card", "summary_large_image")
  }
  await writeFile(outputPath, html)
  const siteRoot = new URL("../dist/", import.meta.url)
  const domain = new URL(canonical).origin
  await writeFile(new URL("robots.txt", siteRoot),
    `User-agent: *\nDisallow: /admin/\nSitemap: ${domain}/sitemap.xml\n`)
  await writeFile(new URL("sitemap.xml", siteRoot),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeHtml(domain + "/")}</loc></url></urlset>\n`)
  console.log("SEO: título, descrição, Open Graph, canonical, robots e sitemap gerados.")
}

await run()
