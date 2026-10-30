import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8")

describe("Pré-carregamento do retrato LCP mobile publicado", () => {
  it("não desperdiça preload com o retrato local de fallback", () => {
    expect(html).not.toMatch(/rel="preload"[^>]*href="\/media\/tulius-portrait-dark\.jpg"/)
  })
  it("pré-conecta ao Storage e prioriza a fotografia publicada", () => {
    expect(html).toContain('rel="preconnect" href="https://zfnrhzplwpjpdljraypt.supabase.co"')
    expect(html).toMatch(
      /rel="preload" as="image" href="https:\/\/zfnrhzplwpjpdljraypt\.supabase\.co\/storage\/v1\/object\/public\/portfolio-public\/[^"]+\.png" fetchpriority="high"/,
    )
  })
})
