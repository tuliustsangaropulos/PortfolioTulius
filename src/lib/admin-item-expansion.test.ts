import { describe, expect, it } from "vitest"
import { expandedAfterMove, expandedAfterRemoval, nextExpandedItem } from "./admin-item-expansion"

describe("Accordion de itens no editor administrativo", () => {
  it("abre um item por vez e permite recolher todos", () => {
    expect(nextExpandedItem(null, 0)).toBe(0)
    expect(nextExpandedItem(0, 1)).toBe(1)
    expect(nextExpandedItem(1, 1)).toBeNull()
  })

  it("acompanha a posição do item expandido ao reordenar", () => {
    expect(expandedAfterMove(2, 2, 1)).toBe(1)
    expect(expandedAfterMove(1, 2, 1)).toBe(2)
    expect(expandedAfterMove(0, 2, 1)).toBe(0)
    expect(expandedAfterMove(null, 2, 1)).toBeNull()
  })

  it("fecha o item removido e corrige índices dos restantes", () => {
    expect(expandedAfterRemoval(2, 2)).toBeNull()
    expect(expandedAfterRemoval(3, 1)).toBe(2)
    expect(expandedAfterRemoval(0, 1)).toBe(0)
    expect(expandedAfterRemoval(null, 0)).toBeNull()
  })
})
