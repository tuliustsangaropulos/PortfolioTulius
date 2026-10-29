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
    let stage = "init"
    try {
      stage = "page loaded"
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
      const firstFold = await page.evaluate(() => {
        const marks = Object.fromEntries(
          performance.getEntriesByType("mark")
            .filter((entry) => entry.name.startsWith("p3:portfolio-"))
            .map((entry) => [entry.name, Math.round(entry.startTime)]),
        )
        const resources = performance.getEntriesByType("resource")
          .filter((entry) => entry.name.includes(".supabase.co/rest/v1/"))
          .map((entry) => {
            const url = new URL(entry.name)
            return { table: url.pathname.split("/").at(-1), startMs: Math.round(entry.startTime), durationMs: Math.round(entry.duration) }
          })
        return { marks, resources,
          portraitComplete: document.querySelector(".mobile-profile-hero img")?.complete ?? false,
          publicSections: document.querySelectorAll("section.portfolio-section").length }
      })
      console.log("P3_FIRST_FOLD_TIMING " + JSON.stringify(firstFold))
      await page.click(".menu-button")
      await page.waitForSelector(".nav-backdrop.is-open", { timeout: 10000 })
      stage = "menu initial focus"
      await page.waitForFunction(() => document.activeElement?.classList.contains("icon-button"), { timeout: 10000 })
      const mainInert = await page.$eval(".public-site main", el => el.hasAttribute("inert"))
      if (!mainInert) throw new Error("Conteúdo de fundo não recebeu inert")
      stage = "focus trap"
      await page.keyboard.down("Shift")
      await page.keyboard.press("Tab")
      await page.keyboard.up("Shift")
      const wrappedToLast = await page.evaluate(() => document.activeElement === document.querySelector(".nav-drawer ol li:last-child button"))
      if (!wrappedToLast) throw new Error("Focus trap: Shift+Tab não voltou ao último botão")
      await page.keyboard.press("Tab")
      const wrappedToFirst = await page.evaluate(() => document.activeElement?.classList.contains("icon-button"))
      if (!wrappedToFirst) throw new Error("Focus trap: Tab não voltou ao botão de fechamento")
      await page.keyboard.press("Escape")
      await page.waitForFunction(() => !document.querySelector(".nav-backdrop")?.classList.contains("is-open"), { timeout: 10000 })
      const focusRestored = await page.evaluate(() => document.activeElement?.classList.contains("menu-button"))
      if (!focusRestored) throw new Error("Foco não voltou ao botão de menu")
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
      const reducedMotion = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)
      if (!reducedMotion) throw new Error("Preferência de movimento reduzido não detectada")
      stage = "menu reopened after Escape"
      await page.click(".menu-button")
      await page.waitForSelector(".nav-backdrop.is-open", { timeout: 10000 })
      stage = "navigate to sobre"
      await page.click(".nav-drawer ol li:nth-child(2) button")
      await page.waitForFunction(() => location.hash === "#sobre", { timeout: 10000 })
      await page.click(".menu-button")
      await page.waitForSelector(".nav-backdrop.is-open", { timeout: 10000 })
      stage = "navigate to resultados"
      // The backdrop class changes before the drawer transform animation settles.
      // Wait until the actual target is onscreen to avoid intermittent click failures.
      await page.waitForFunction(() => {
        const target = document.querySelector(".nav-drawer ol li:nth-child(3) button")
        if (!target) return false
        const rect = target.getBoundingClientRect()
        return rect.left >= 0 && rect.right <= innerWidth && rect.width > 0
      }, { timeout: 10000 })
      await page.click(".nav-drawer ol li:nth-child(3) button")
      await page.waitForFunction(() => location.hash === "#resultados", { timeout: 10000 })
      stage = "history back"
      await page.evaluate(() => history.back())
      await page.waitForFunction(() => location.hash === "#sobre", { timeout: 10000 })
      stage = "history back focus"
      await page.waitForFunction(() => document.activeElement?.id === "sobre", { timeout: 10000 })
      console.log("P3_INTERACTION " + JSON.stringify({ menuEscape: true, focusRestored, mainInert, focusTrap: true, hashBack: true, reducedMotion, result: "PASS" }))
    } catch (error) {
      failures++
      console.log("P3_INTERACTION " + JSON.stringify({ result: "FAIL", stage, error: String(error).slice(0, 260) }))
    } finally {
      await page.close()
    }
  }

  // Cross-section selection: a card in section 01 opens its corresponding theme in section 03.
  {
    const page = await browser.newPage()
    let stage = "load"
    try {
      await page.setViewport({ width: 1440, height: 900 })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
      stage = "click opening marketing card"
      await page.click("#perfil .area-grid .area-card-link:nth-child(4)")
      await page.waitForFunction(() => location.hash === "#resultados", { timeout: 10000 })
      stage = "assert selected topic"
      await page.waitForFunction(() => {
        const active = document.querySelector('#resultados .desktop-panel .results-theme-list button[aria-pressed="true"]')
        const text = document.querySelector("#resultados .desktop-panel .results-topic h3")
        return active?.textContent?.toLocaleLowerCase("pt-BR").includes("marketing") &&
          text?.textContent?.toLocaleLowerCase("pt-BR").includes("resultados que orientam decisões")
      }, { timeout: 10000 })
      stage = "switch topic"
      await page.click("#resultados .desktop-panel .results-theme-list button:nth-child(6)")
      await page.waitForFunction(() => {
        const title = document.querySelector("#resultados .desktop-panel .results-topic h3")
        const metrics = document.querySelectorAll("#resultados .desktop-panel .results-metrics-grid .content-item")
        return title?.textContent?.toLowerCase().includes("visão editorial") && metrics.length === 2
      }, { timeout: 10000 })
      stage = "restore overview"
      await page.click("#resultados .desktop-panel .results-theme-list button:first-child")
      await page.waitForFunction(() =>
        document.querySelectorAll("#resultados .desktop-panel .results-metrics-grid .result-metric-icon").length === 4,
        { timeout: 10000 },
      )
      console.log("P3_RESULTS_THEMES " + JSON.stringify({ fromHero: true, switchTheme: true, overviewIcons: 4, result: "PASS" }))
      await page.screenshot({ path: path.join(shots, "p3-results-overview-1440.png") })
    } catch (error) {
      failures++
      console.log("P3_RESULTS_THEMES " + JSON.stringify({ result: "FAIL", stage, error: String(error).slice(0, 350) }))
    } finally {
      await page.close()
    }
  }


  // Company experience stack: navigation stays pinned while the next employer covers the previous.
  {
    const page = await browser.newPage()
    let stage = "load"
    try {
      await page.setViewport({ width: 1440, height: 900 })
      await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 30000 })
      stage = "sections and themes"
      const initial = await page.evaluate(() => ({
        stack: !!document.querySelector(".experience-stack"),
        cards: document.querySelectorAll(".experience-stack .experience-card").length,
        tabs: document.querySelectorAll(".experience-index a").length,
        formationInk: getComputedStyle(document.querySelector("#formacao")).backgroundColor,
        gallery: document.querySelectorAll(".experience-gallery").length,
      }))
      if (!initial.stack || initial.cards !== 6 || initial.tabs !== 6 || initial.gallery < 6)
        throw new Error("Estrutura das seis empresas incompleta: " + JSON.stringify(initial))
      stage = "sticky navigation"
      await page.$eval("#prefeitura-sp", (node) => node.scrollIntoView({ behavior: "instant", block: "start" }))
      await page.waitForFunction(() => {
        const bar = document.querySelector(".experience-index")?.getBoundingClientRect()
        const panel = document.querySelector("#prefeitura-sp")?.getBoundingClientRect()
        const header = document.querySelector(".site-header")?.getBoundingClientRect()
        return !!bar && !!panel && !!header && Math.abs(bar.top - header.bottom) <= 3 && panel.top <= 3
      }, { timeout: 10000 })
      stage = "slide controls"
      const before = await page.evaluate(() => {
        const btn = document.querySelector("#prefeitura-sp .desktop-panel .experience-gallery-controls button:last-child")
        const counter = document.querySelector("#prefeitura-sp .desktop-panel .experience-gallery-controls > span")
        const rect = btn?.getBoundingClientRect()
        return { counter: counter?.textContent, rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
          covering: rect ? document.elementFromPoint(rect.x + rect.width/2, rect.y + rect.height/2)?.closest(".experience-card")?.id : null }
      })
      await page.click("#prefeitura-sp .desktop-panel .experience-gallery-controls button:last-child")
      const after = await page.$eval("#prefeitura-sp .desktop-panel .experience-gallery-controls > span", (node) => node.textContent)
      console.log("P3_EXPERIENCE_SLIDE_CLICK " + JSON.stringify({ before, after }))
      await page.waitForFunction(() =>
        document.querySelector("#prefeitura-sp .desktop-panel .experience-gallery-controls > span")?.textContent?.includes("2 / 3"),
        { timeout: 10000 },
      )
      console.log("P3_EXPERIENCE_STACK " + JSON.stringify({ companies: 6, fixedSelector: true, galleryNavigation: true, result: "PASS" }))
      await page.screenshot({ path: path.join(shots, "p3-experience-stack-1440.png") })
    } catch (error) {
      failures++
      console.log("P3_EXPERIENCE_STACK " + JSON.stringify({ result: "FAIL", stage, error: String(error).slice(0, 350) }))
    } finally {
      await page.close()
    }
  }

  const viewports = [
    [1920, 1080],
    [1757, 832], // Desktop reference at native 100%, matching the owner's screenshot width.
    [1440, 900],
    [1200, 800], // Wide-layout boundary; must not depend on CSS zoom.
    [1101, 800],
    [1100, 800],
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
          // Global CSS zoom changes size again after browser zoom; forbid it.
          siteZoom: getComputedStyle(document.querySelector(".public-site")).zoom,
          siteTransform: getComputedStyle(document.querySelector(".public-site")).transform,
          nameLockupWidth: Math.round(document.querySelector(".name-lockup")?.getBoundingClientRect().width ?? 0),
          nameLockupFontSize: parseFloat(getComputedStyle(document.querySelector(".name-lockup")).fontSize),
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
      const nativeScale = Math.abs(Number(findings.siteZoom || 1) - 1) < 0.001 &&
        findings.siteTransform === "none"
      if (!nativeScale) {
        console.log("P3_DESKTOP_ZOOM_REGRESSION " + JSON.stringify({
          width, siteZoom: findings.siteZoom, siteTransform: findings.siteTransform, result: "FAIL",
        }))
      }
      if (findings.sectionCount !== 13 || findings.mobilePanelCount !== 25 ||
          findings.documentWidth > width + 2 || !nativeScale) failures++
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
