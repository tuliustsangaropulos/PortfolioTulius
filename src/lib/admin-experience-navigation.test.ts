import { describe, expect, it } from "vitest"
import { buildAdminSectionNavigation, isExperienceSection } from "./admin-experience-navigation"

const sections = [
  { slug: "formacao", id: "s5" },
  { slug: "invest-rs", id: "s6" },
  { slug: "prefeitura-sp", id: "s7" },
  { slug: "vale", id: "s8" },
  { slug: "globo-sportv", id: "s9" },
  { slug: "inpress", id: "s10" },
  { slug: "cdi", id: "s11" },
  { slug: "depoimentos", id: "s12" },
]

describe("Navegação contextual de Experiências Profissionais", () => {
  it("agrupa somente as seis empresas existentes sem perder nenhuma", () => {
    const result = buildAdminSectionNavigation(sections)
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ kind: "section", section: sections[0] })
    expect(result[1]).toEqual({ kind: "experiences", sections: sections.slice(1, 7) })
    expect(result[2]).toEqual({ kind: "section", section: sections[7] })
  })

  it("não agrupa as demais seções", () => {
    expect(isExperienceSection("competencias")).toBe(false)
    expect(isExperienceSection("contato")).toBe(false)
    expect(isExperienceSection("cdi")).toBe(true)
    const standalone = [
      { slug: "perfil", id: "a" },
      { slug: "contato", id: "b" },
    ]
    expect(buildAdminSectionNavigation(standalone)).toEqual([
      { kind: "section", section: standalone[0] },
      { kind: "section", section: standalone[1] },
    ])
  })

  it("preserva a posição do primeiro trabalho e não reordena as demais", () => {
    const mixed = [sections[1], { slug: "outra", id: "other" }, sections[2]]
    expect(buildAdminSectionNavigation(mixed)).toEqual([
      { kind: "experiences", sections: [sections[1], sections[2]] },
      { kind: "section", section: mixed[1] },
    ])
  })
})
