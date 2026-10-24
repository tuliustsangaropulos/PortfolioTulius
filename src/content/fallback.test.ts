import { describe, expect, it } from "vitest"
import { sections } from "./fallback"

const expectedSlugs = [
  "perfil",
  "sobre",
  "resultados",
  "competencias",
  "formacao",
  "invest-rs",
  "prefeitura-sp",
  "vale",
  "globo-sportv",
  "inpress",
  "cdi",
  "ferramentas",
  "depoimentos",
  "contato",
]

describe("estrutura editorial", () => {
  it("mantém 14 seções e 28 painéis", () => {
    expect(sections).toHaveLength(14)
    expect(sections.flatMap((section) => [section.panelA, section.panelB])).toHaveLength(28)
  })

  it("preserva slugs e ordem", () => {
    expect(sections.map((section) => section.slug)).toEqual(expectedSlugs)
    expect(sections.map((section) => section.number)).toEqual(
      Array.from({ length: 14 }, (_, index) => index + 1),
    )
  })

  it("mantém cinco áreas e seis experiências no perfil B", () => {
    expect(sections[0].panelB.slice(0, 5)).toHaveLength(5)
    expect(sections[0].panelB.slice(5)).toHaveLength(6)
  })
})
