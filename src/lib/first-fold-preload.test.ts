import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8")

describe("Pré-carregamento do retrato LCP mobile publicado", () => {
  it("não desperdiça preload com o retrato local de fallback", () => {
    expect(html).not.toMatch(/rel="preload"[^>]*href="\/media\/tulius-portrait-dark\.jpg"/)
  })
  it("prioriza as variantes WebP estáticas com sizes responsivos", () => {
    expect(html).toContain('rel="preload" as="image" type="image/webp"')
    expect(html).toContain('imagesrcset="/media/tulius-site-600.webp 600w, /media/tulius-site-900.webp 900w"')
    expect(html).toContain('fetchpriority="high"')
  })
})
