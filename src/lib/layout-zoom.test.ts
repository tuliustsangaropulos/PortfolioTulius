import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const css = readFileSync(new URL("../index.css", import.meta.url), "utf8")
const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "")

/**
 * Browser zoom belongs to the user. Global CSS zoom made 100% visually tiny
 * and dynamically changed itself again when browser zoom changed the vw size.
 */
describe("Contrato de escala do site público", () => {
  it("não aplica zoom global no CSS, nem ao público nem no body/html", () => {
    expect(withoutComments).not.toMatch(/(?:^|[{;])\s*zoom\s*:/m)
    expect(withoutComments).not.toContain("--desktop-visual-scale")
  })
  it("não introduz transform: scale no contêiner global público", () => {
    const publicRules = [...withoutComments.matchAll(/\.public-site\s*\{([^}]*)\}/g)]
    expect(publicRules.length).toBeGreaterThan(0)
    for (const [, declarations] of publicRules) {
      expect(declarations).not.toMatch(/\btransform\s*:\s*scale\s*\(/)
      expect(declarations).not.toMatch(/\bzoom\s*:/)
    }
  })
  it("mantém painéis com alturas próprias da viewport e CSS responsivo", () => {
    expect(withoutComments).toMatch(/\.portfolio-section\s*\{[^}]*min-height:\s*100svh/)
    expect(withoutComments).toContain("@media (max-width: 767px)")
  })
})
