import puppeteer from "puppeteer-core"

const email = process.env.P5_ADMIN_EMAIL
const password = process.env.P5_ADMIN_PASSWORD
const base = process.env.P5_BASE_URL ?? "https://tulius.work"
if (!email || !password) {
  console.error("P5_ADMIN_NOT_RUN: configurar credenciais exclusivamente em secrets do GitHub Actions ou variáveis de ambiente locais.")
  process.exit(2)
}
const url = new URL(base)
if (url.protocol !== "https:" || url.username || url.password) {
  throw new Error("P5_BASE_URL precisa ser HTTPS e não conter credenciais.")
}

const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
let passed = 0
const mutations = []
try {
  const page = await browser.newPage()
  // Login/logout Auth POSTs are allowed. Writes to CMS data/Storage are never allowed.
  page.on("request", (request) => {
    const method = request.method()
    const address = request.url()
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
        (address.includes("/rest/v1/") || address.includes("/storage/v1/object/"))) {
      mutations.push({ method, resource: new URL(address).pathname })
    }
  })
  await page.goto(new URL("/admin/login", base).href, { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".login-card input[type=email]", { timeout: 12000 })
  await page.type(".login-card input[type=email]", email)
  await page.type(".login-card input[type=password]", password)
  await page.click(".login-card button[type=submit], .login-card .primary-button")
  await page.waitForFunction(
    () => location.pathname === "/admin" && !!document.querySelector(".admin-shell"),
    { timeout: 20000 },
  )
  passed++
  console.log("P5_ADMIN_LOGIN " + JSON.stringify({ result: "PASS", authenticated: true }))

  const expectedModules = ["Seções", "Blocos", "Coleções", "Identidade", "Mídia", "Navegação", "SEO", "Revisões"]
  for (const label of expectedModules) {
    const clicked = await page.$$eval(".admin-sidebar nav button", (nodes, target) => {
      const button = nodes.find(node => node.textContent?.trim() === target)
      if (!button) return false
      button.click()
      return true
    }, label)
    if (!clicked) throw new Error("Módulo administrativo indisponível: " + label)
    // Wait for the actual selected module; the old header may remain briefly.
    await page.waitForFunction((target) => {
      const active = document.querySelector(".admin-sidebar nav button.active")
      return active?.textContent?.trim() === target &&
        !!document.querySelector(".admin-header h1")
    }, { timeout: 10000 }, label)
  }
  passed++
  console.log("P5_ADMIN_MODULES " + JSON.stringify({ result: "PASS", modules: expectedModules.length }))

  await page.goto(new URL("/admin/preview", base).href, { waitUntil: "networkidle2", timeout: 30000 })
  await page.waitForSelector(".preview-banner", { timeout: 15000 })
  // The preview banner renders before Supabase finishes loading. Wait for the
  // 14 registered sections (including the intentionally hidden "competencias").
  // Do not treat an early DOM count of zero as an incomplete admin preview.
  let previewTimedOut = false
  try {
    await page.waitForFunction(
      () => {
        const count = document.querySelectorAll("section.portfolio-section").length
        const loading = !!document.querySelector(".public-site .data-status")
        const failed = !!document.querySelector(".public-site .data-error")
        return failed || (!loading && count === 14)
      },
      { timeout: 20000 },
    )
  } catch {
    previewTimedOut = true
  }
  const previewState = await page.evaluate(() => ({
    sectionCount: document.querySelectorAll("section.portfolio-section").length,
    loading: !!document.querySelector(".public-site .data-status"),
    failed: !!document.querySelector(".public-site .data-error"),
    hiddenSectionPresent: !!document.querySelector("section#competencias"),
  }))
  if (previewTimedOut || previewState.failed || previewState.sectionCount !== 14 ||
      !previewState.hiddenSectionPresent) {
    throw new Error("Prévia administrativa incompleta: " + JSON.stringify(previewState))
  }
  passed++
  console.log("P5_ADMIN_PREVIEW " + JSON.stringify({
    result: "PASS",
    sectionCount: previewState.sectionCount,
    hiddenSectionPresent: previewState.hiddenSectionPresent,
  }))

  await page.goto(new URL("/admin", base).href, { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".logout-button", { timeout: 15000 })
  await page.click(".logout-button")
  await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 })
  await page.goto(new URL("/admin/preview", base).href, { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 })
  if (mutations.length) {
    throw new Error("Unexpected content write from read-only suite: " + JSON.stringify(mutations))
  }
  passed++
  console.log("P5_ADMIN_LOGOUT " + JSON.stringify({ result: "PASS", reaccessBlocked: true }))
} finally {
  await browser.close()
}
console.log("P5_READONLY_RESULT " + JSON.stringify({ passed, expected: 4, contentMutations: 0 }))
if (passed !== 4) process.exitCode = 1
