import fs from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const base = "https://tulius.work"
const shots = path.join(process.env.RUNNER_TEMP ?? "/tmp", "p3-screenshots")
fs.mkdirSync(shots, { recursive: true })
const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
let failures = 0
try {
  for (const route of ["/admin", "/admin/preview"]) {
    const page = await browser.newPage()
    try {
      await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 30000 })
      await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 })
      console.log("P3_ANON_ROUTE " + JSON.stringify({ route, finalPath: new URL(page.url()).pathname, result: "PASS" }))
    } catch (error) {
      failures++
      console.log("P3_ANON_ROUTE " + JSON.stringify({ route, result: "FAIL", url: page.url(), error: String(error).slice(0, 260) }))
    } finally {
      await page.close()
    }
  }

  const viewports = [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [390, 844],
    [360, 800],
    [320, 700],
  ]
  for (const [width, height] of viewports) {
    const page = await browser.newPage()
    try {
      await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
      await page.waitForSelector("section.portfolio-section", { timeout: 15000 })
      const findings = await page.evaluate((requestedWidth) => {
        const portrait = document.querySelector(".profile-portrait img, .mobile-profile-hero img")
        const desktop = document.querySelector(".desktop-panel")
        const mobile = document.querySelector(".mobile-panels")
        return {
          sectionCount: document.querySelectorAll("section.portfolio-section").length,
          mobilePanelCount: document.querySelectorAll(".mobile-panel").length,
          viewportWidth: window.innerWidth,
          layoutViewportWidth: document.documentElement.clientWidth,
          visualViewportWidth: window.visualViewport?.width ?? null,
          requestedWidth,
          documentWidth: document.documentElement.scrollWidth,
          overflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          desktopDisplay: desktop ? getComputedStyle(desktop).display : null,
          mobileDisplay: mobile ? getComputedStyle(mobile).display : null,
          portraitComplete: portrait?.complete ?? null,
          portraitNaturalWidth: portrait?.naturalWidth ?? null,
          appError: document.querySelector(".data-error")?.textContent?.slice(0, 140) ?? null,
          widestElements: Array.from(document.querySelectorAll(".public-site main *"))
            .map((element) => ({ element, rect: element.getBoundingClientRect() }))
            .filter(({ rect }) => rect.width > 0 && rect.right > requestedWidth + 2)
            .sort((a, b) => b.rect.right - a.rect.right)
            .slice(0, 8)
            .map(({ element, rect }) => ({
              tag: element.tagName.toLowerCase(),
              className: String(element.className).slice(0, 100),
              text: element.textContent?.trim().slice(0, 45) ?? "",
              right: Math.round(rect.right),
              left: Math.round(rect.left),
            })),
        }
      }, width)
      await page.screenshot({ path: path.join(shots, `p3-${width}x${height}.png`), fullPage: false })
      console.log("P3_VIEWPORT " + JSON.stringify({ width, height, ...findings }))
      if (findings.sectionCount !== 14 || findings.mobilePanelCount !== 28 || findings.documentWidth > width + 2) failures++
    } catch (error) {
      failures++
      console.log("P3_VIEWPORT_ERROR " + JSON.stringify({ width, height, error: String(error).slice(0, 250) }))
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
console.log("P3_BROWSER_AUDIT " + JSON.stringify({ failures }))
if (failures > 0) process.exitCode = 1
