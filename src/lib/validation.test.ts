import { describe, expect, it } from "vitest"
import {
  clampNumber,
  isSafeEditorialImage,
  isSafePublicUrl,
  resolveHeroCardDestination,
  validateContentItems,
} from "./validation"

describe("clampNumber", () => {
  it("limita valores configuráveis", () => {
    expect(clampNumber("2500", 960, 1920, 1680)).toBe(1920)
    expect(clampNumber("20", 32, 120, 64)).toBe(32)
    expect(clampNumber("inválido", 0, 1200, 520)).toBe(520)
  })
})

describe("isSafePublicUrl", () => {
  it("aceita somente HTTPS e mailto válido", () => {
    expect(isSafePublicUrl("https://linkedin.com/in/tuliust")).toBe(true)
    expect(isSafePublicUrl("mailto:tuliust@gmail.com")).toBe(true)
    expect(isSafePublicUrl("javascript:alert(1)")).toBe(false)
    expect(isSafePublicUrl("http://example.com")).toBe(false)
  })
})

describe("validateContentItems", () => {
  it("valida títulos, alt e links", () => {
    const errors = validateContentItems([
      { title: "", image: "/portrait.jpg" },
      { title: "Contato", meta: "javascript:alert(1)" },
    ])
    expect(errors).toHaveLength(3)
  })
})

describe("resolveHeroCardDestination", () => {
  const published = ["perfil", "sobre", "resultados", "contato"]

  it("usa a seção 03 por padrão e aceita destino configurado no admin", () => {
    expect(resolveHeroCardDestination(undefined, published)).toBe("resultados")
    expect(resolveHeroCardDestination("contato", published)).toBe("contato")
  })

  it("não navega para slug inexistente ou seção 03 despublicada", () => {
    expect(resolveHeroCardDestination("sem-secao", published)).toBe("resultados")
    expect(resolveHeroCardDestination("sem-secao", ["perfil", "sobre"])).toBeUndefined()
  })

  it("rejeita destinos inválidos antes de salvar", () => {
    expect(
      validateContentItems([{ title: "Card", targetSlug: "javascript:alert(1)" }]),
    ).toHaveLength(1)
  })
})

describe("section 02 desktop portrait", () => {
  it("allows local media or HTTPS images, rejecting unsafe image URLs", () => {
    expect(isSafeEditorialImage("/media/tulius-contact.jpg")).toBe(true)
    expect(isSafeEditorialImage("https://example.org/portrait.webp")).toBe(true)
    expect(isSafeEditorialImage("javascript:alert(1)")).toBe(false)
    expect(isSafeEditorialImage("/media/../private.jpg")).toBe(false)
  })

  it("requires alternative text for explicitly configured desktop media", () => {
    expect(
      validateContentItems([
        { title: "Estratégia", aboutDesktopImage: "/media/tulius-contact.jpg" },
      ]),
    ).toHaveLength(1)
    expect(
      validateContentItems([
        {
          title: "Estratégia",
          aboutDesktopAlt: "Tulius com tablet",
          aboutDesktopImage: "/media/tulius-contact.jpg",
        },
      ]),
    ).toHaveLength(0)
  })
})

describe("validação do conteúdo interativo de resultados", () => {
  it("aceita ícones e temas autorizados", () => {
    expect(
      validateContentItems([
        { title: "Indicador", metricIcon: "chart", relatedThemeKeys: ["marketing"] },
        { title: "Tema", themeKey: "corporativa", themeAxis: "Liderança" },
      ]),
    ).toHaveLength(0)
  })

  it("rejeita ícones inválidos e identificadores de temas repetidos", () => {
    expect(
      validateContentItems([
        { title: "Indicador", metricIcon: "invalid" as "chart" },
        { title: "Tema 1", themeKey: "corporativa" },
        { title: "Tema 2", themeKey: "corporativa" },
      ]),
    ).toHaveLength(2)
  })
})

describe("ícones de Ferramentas", () => {
  it("aceita até três pictogramas locais por item", () => {
    expect(
      validateContentItems([{ title: "Análise", toolIcons: ["analytics", "search"] }]),
    ).toHaveLength(0)
  })
  it("rejeita símbolos não autorizados, repetições ou mais de três", () => {
    expect(validateContentItems([{ title: "A", toolIcons: ["fake" as "analytics"] }])).toHaveLength(
      1,
    )
    expect(
      validateContentItems([{ title: "A", toolIcons: ["analytics", "analytics"] }]),
    ).toHaveLength(1)
    expect(
      validateContentItems([{ title: "A", toolIcons: ["analytics", "search", "meta", "growth"] }]),
    ).toHaveLength(1)
  })
})
