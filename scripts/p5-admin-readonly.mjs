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
try {
  const page = await browser.newPage()
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
    await page.waitForSelector(".admin-header h1", { timeout: 10000 })
  }
  passed++
  console.log("P5_ADMIN_MODULES " + JSON.stringify({ result: "PASS", modules: expectedModules.length }))

  await page.goto(new URL("/admin/preview", base).href, { waitUntil: "networkidle2", timeout: 30000 })
  await page.waitForSelector(".preview-banner", { timeout: 15000 })
  const sectionCount = await page.$$eval("section.portfolio-section", nodes => nodes.length)
  if (sectionCount < 14) throw new Error("Prévia administrativa incompleta")
  passed++
  console.log("P5_ADMIN_PREVIEW " + JSON.stringify({ result: "PASS", sectionCount }))

  await page.goto(new URL("/admin", base).href, { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForSelector(".logout-button", { timeout: 15000 })
  await page.click(".logout-button")
  await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 })
  await page.goto(new URL("/admin/preview", base).href, { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 })
  passed++
  console.log("P5_ADMIN_LOGOUT " + JSON.stringify({ result: "PASS", reaccessBlocked: true }))
} finally {
  await browser.close()
}
console.log("P5_READONLY_RESULT " + JSON.stringify({ passed, expected: 4, contentMutations: 0 }))
if (passed !== 4) process.exitCode = 1
