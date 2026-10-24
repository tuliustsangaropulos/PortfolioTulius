import { describe, expect, it } from "vitest"
import { clampNumber, isSafePublicUrl, validateContentItems } from "./validation"

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
