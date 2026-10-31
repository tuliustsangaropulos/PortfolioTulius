import { describe, expect, it } from "vitest"
import { validateContentItems } from "./validation"

describe("Texto alternativo opcional no CMS", () => {
  it("aceita imagens publicadas sem descrição alternativa", () => {
    expect(validateContentItems([{ title: "Perfil", image: "/media/retrato.webp" }])).toEqual([])
    expect(validateContentItems([{
      title: "Sobre", aboutDesktopImage: "/media/retrato.webp",
    }])).toEqual([])
  })
  it("continua rejeitando imagens desktop inseguras", () => {
    expect(validateContentItems([{ title: "Sobre", aboutDesktopImage: "javascript:alert(1)" }]).length).toBeGreaterThan(0)
  })
})
