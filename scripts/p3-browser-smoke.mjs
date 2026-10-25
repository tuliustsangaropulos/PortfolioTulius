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
      const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 30000 })
      const robotsHeader = response?.headers()["x-robots-tag"] ?? ""
      const noindex = robotsHeader.includes("noindex")
      await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 })
      if (!noindex) throw new Error("X-Robots-Tag noindex ausente na rota " + route)
      console.log("P3_ANON_ROUTE " + JSON.stringify({ route, finalPath: new URL(page.url()).pathname, noindex, result: "PASS" }))
    } catch (error) {
      failures++
      console.log("P3_ANON_ROUTE " + JSON.stringify({ route, result: "FAIL", url: page.url(), error: String(error).slice(0, 260) }))
    } finally {
      await page.close()
    }
  }

  {
    const page = await browser.newPage()
    try {
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
      await page.click(".menu-button")
      await page.waitForSelector(".nav-backdrop.is-open", { timeout: 10000 })
      await page.keyboard.press("Escape")
      await page.waitForFunction(() => !document.querySelector(".nav-backdrop")?.classList.contains("is-open"), { timeout: 10000 })
      const focusRestored = await page.evaluate(() => document.activeElement?.classList.contains("menu-button"))
      if (!focusRestored) throw new Error("Foco não voltou ao botão de menu")
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
      const reducedMotion = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)
      if (!reducedMotion) throw new Error("Preferência de movimento reduzido não detectada")
      console.log("P3_INTERACTION " + JSON.stringify({ menuEscape: true, focusRestored, reducedMotion, result: "PASS" }))
    } catch (error) {
      failures++
      console.log("P3_INTERACTION " + JSON.stringify({ result: "FAIL", error: String(error).slice(0, 260) }))
    } finally {
      await page.close()
    }
  }

  const viewports = [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [768, 1024],
    [720, 450], // CSS viewport equivalent to a 1440px screen at ~200% zoom; not native zoom
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
          headerWidth: document.querySelector(".site-header")?.getBoundingClientRect().width ?? null,
          menuRight: document.querySelector(".menu-button")?.getBoundingClientRect().right ?? null,
          brandRight: document.querySelector(".brand-button")?.getBoundingClientRect().right ?? null,
          documentScrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          overflowCandidates: Array.from(document.querySelectorAll(".public-site main *"))
            .filter((el) => el.clientWidth > 0 && getComputedStyle(el).display !== "none")
            .map((el) => {
              const rect = el.getBoundingClientRect()
              return { el, right: Math.round(rect.left + el.scrollWidth), actualRight: Math.round(rect.right) }
            })
            .filter(({ right }) => right > requestedWidth + 2)
            .sort((a, b) => b.right - a.right)
            .slice(0, 12)
            .map(({ el, right, actualRight }) => ({
              tag: el.tagName,
              className: String(el.className).slice(0, 70),
              right, actualRight,
              width: el.clientWidth,
              scroll: el.scrollWidth,
            })),
          rootScrollWidth: document.getElementById("root")?.scrollWidth ?? null,
          publicSiteScrollWidth: document.querySelector(".public-site")?.scrollWidth ?? null,
          mobileName: Array.from(document.querySelectorAll(".mobile-name, .mobile-name span")).slice(0, 3).map((el) => ({ tag: el.tagName, text: el.textContent?.slice(0, 28), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, right: Math.round(el.getBoundingClientRect().right) })),
          headerControls: Array.from(document.querySelectorAll(".site-header > *")).map((el) => ({ tag: el.tagName, className: String(el.className), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, right: Math.round(el.getBoundingClientRect().right) })),
          overflownContainers: Array.from(document.querySelectorAll(".public-site *"))
            .filter((el) => el.scrollWidth > el.clientWidth + 3 && el.clientWidth > 0 && getComputedStyle(el).display !== "none")
            .slice(0, 20)
            .map((el) => ({ tag: el.tagName, className: String(el.className).slice(0, 45), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, cssOverflow: getComputedStyle(el).overflow, right: Math.round(el.getBoundingClientRect().right) })),
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
