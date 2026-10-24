// Public HTTP smoke test; no credentials and no write operations.
const base = new URL(process.argv[2] ?? "https://tulius.work/")
if (base.protocol !== "https:") {
  throw new Error("Informe uma URL HTTPS para o site publicado.")
}

async function request(path) {
  const url = new URL(path, base)
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
    headers: { accept: "text/html,application/xml,text/plain,*/*" },
  })
  if (!response.ok) {
    throw new Error(`${path}: HTTP ${response.status} (${url.href})`)
  }
  return { response, text: await response.text() }
}

const home = await request("/")
if (!/<title>[^<]+<\/title>/i.test(home.text)) {
  throw new Error("Página inicial sem título HTML.")
}
if (!/<link\s+rel=["']canonical["'][^>]+>/i.test(home.text)) {
  throw new Error("Página inicial sem canonical.")
}
if (!/assets\/[^"' ]+\.js/.test(home.text)) {
  throw new Error("Página inicial sem referência ao bundle JS.")
}
console.log("PASS: HTML, título, canonical e bundle.")

const robots = await request("/robots.txt")
if (!robots.text.includes("Disallow: /admin/")) {
  throw new Error("robots.txt não protege rotas administrativas.")
}
console.log("PASS: robots.txt.")

const sitemap = await request("/sitemap.xml")
if (!sitemap.text.includes("<urlset") || !sitemap.text.includes("<loc>")) {
  throw new Error("sitemap.xml inválido ou ausente.")
}
console.log("PASS: sitemap.xml.")

const admin = await request("/admin/login")
const robotsHeader = admin.response.headers.get("x-robots-tag") ?? ""
if (!robotsHeader.includes("noindex")) {
  throw new Error("Rota /admin/login sem cabeçalho X-Robots-Tag noindex.")
}
console.log("PASS: rota administrativa não indexável.")
console.log("Smoke HTTP concluído (sem testar login ou renderização JavaScript).")
