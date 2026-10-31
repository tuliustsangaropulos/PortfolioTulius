import { describe, expect, it } from "vitest"
import { iconCategories, allowedVisualIcons } from "./icon-catalog"
import { validateContentItems } from "./validation"

describe("Biblioteca visual de ícones", () => {
  it("contém 50 ícones únicos em cinco categorias", () => {
    expect(iconCategories).toHaveLength(5)
    expect(allowedVisualIcons).toHaveLength(50)
    expect(new Set(allowedVisualIcons).size).toBe(50)
    for (const name of ["chart", "trending", "users", "newspaper", "megaphone", "analytics", "search", "meta", "salesforce", "figma", "notion", "wordpress", "video"]) {
      expect(allowedVisualIcons).toContain(name)
    }
  })
  it("valida ícones conhecidos sem aceitar nomes inventados", () => {
    expect(validateContentItems([{title:"Meta",metricIcon:"smartphone"}])).toEqual([])
    expect(validateContentItems([{title:"Meta",metricIcon:"nao-existe" as never}]).length).toBeGreaterThan(0)
  })
})
