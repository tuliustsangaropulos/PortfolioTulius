// Public HTTP smoke test; no credentials and no write operations.
const base = new URL(process.argv[2] ?? "https://tulius.work/")
if (base.protocol !== "https:") {
  throw new Error("Informe uma URL HTTPS para o site publicado.")
}

async function request(path) {
  const url = new URL(path, base)
  let response
  try {
    response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
      headers: { accept: "text/html,application/xml,text/plain,*/*" },
    })
  } catch (error) {
    const cause = error?.cause
    const code = cause?.code ?? error?.code ?? error?.name ?? "NETWORK_ERROR"
    throw new Error(
      `Conexão com ${url.origin} falhou (${code}). ` +
      "Isso não comprova indisponibilidade do site. Verifique DNS, porta 443, " +
      "VPN, firewall e proxy. Compare com: curl.exe -I --max-time 20 " +
      url.href + ". Caso curl funcione e Node não, execute o teste com " +
      "Node 24 e --use-env-proxy (requer HTTP_PROXY/HTTPS_PROXY configurados).",
      { cause: error },
    )
  }
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
if (!robots.text.includes("Disallow: /admin\n") || !robots.text.includes("Disallow: /admin/")) {
  throw new Error("robots.txt não protege rotas administrativas.")
}
console.log("PASS: robots.txt.")

const sitemap = await request("/sitemap.xml")
if (!sitemap.text.includes("<urlset") || !sitemap.text.includes("<loc>")) {
  throw new Error("sitemap.xml inválido ou ausente.")
}
console.log("PASS: sitemap.xml.")

for (const adminPath of ["/admin", "/admin/login", "/admin/preview"]) {
  const admin = await request(adminPath)
  const robotsHeader = admin.response.headers.get("x-robots-tag") ?? ""
  if (!robotsHeader.includes("noindex")) {
    throw new Error(`Rota ${adminPath} sem cabeçalho X-Robots-Tag noindex.`)
  }
}
console.log("PASS: rotas administrativas não indexáveis.")
console.log("Smoke HTTP concluído (sem testar login ou renderização JavaScript).")
