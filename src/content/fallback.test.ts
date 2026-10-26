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

describe("conteúdo da seção 02 e especialidades da seção 03", () => {
  const profile = sections.find((section) => section.slug === "perfil")
  const about = sections.find((section) => section.slug === "sobre")
  const results = sections.find((section) => section.slug === "resultados")

  it("mantém cinco textos gerenciáveis no painel B da seção 02", () => {
    expect(about?.panelA).toHaveLength(1)
    expect(about?.panelB.map((item) => item.title)).toEqual([
      "Estratégia também é escuta.",
      "Comunicação de ponta a ponta",
      "Visão editorial",
      "Resultados que orientam decisões",
      "A voz de quem lidera",
    ])
    expect(about?.panelA[0]?.image).toBe("/media/tulius-portrait.jpg")
  })

  it("reutiliza os cinco temas da abertura na lista da seção 03", () => {
    const opening = profile?.panelB.slice(0, 5).map((item) => item.title.toLowerCase())
    const specialties = results?.panelB.map((item) => item.title.toLowerCase())
    expect(specialties).toEqual(opening)
    expect(results?.panelB).toHaveLength(5)
    expect(results?.panelA).toHaveLength(4)
    expect(results?.panelB.some((item) => item.placeholder)).toBe(false)
  })
})
