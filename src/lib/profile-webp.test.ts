import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
const site = readFileSync(new URL("../components/public/PublicSite.tsx", import.meta.url), "utf8")
const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8")
describe("Retrato aprovado em WebP", () => {
  it("usa variantes somente quando a imagem CMS é a original auditada", () => {
    expect(site).toContain("if (src !== APPROVED_PROFILE_PORTRAIT) return image")
    expect(site).toContain("/media/tulius-site-600.webp 600w")
    expect(site).toContain("/media/tulius-site-900.webp 900w")
    expect(site).toContain("style={imageFramingStyle(profile.mediaFraming)}")
  })
  it("mantém preload responsivo e não modifica a URL original do CMS", () => {
    expect(html).toContain('type="image/webp"')
    expect(html).toContain('imagesrcset="/media/tulius-site-600.webp 600w')
  })
})
