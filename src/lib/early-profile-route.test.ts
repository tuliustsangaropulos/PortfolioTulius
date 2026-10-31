import { describe, expect, it } from "vitest"
import { isEarlyProfileRoute } from "../hooks/usePortfolio"

describe("Consulta independente da abertura publicada", () => {
  it("restringe antecipação ao perfil público e não revela rascunhos", () => {
    for (const hash of ["", "#perfil", "#perfil-a", "#perfil-b"]) {
      expect(isEarlyProfileRoute(false, hash)).toBe(true)
    }
    expect(isEarlyProfileRoute(false, "#contato")).toBe(false)
    expect(isEarlyProfileRoute(false, "#sobre")).toBe(false)
    expect(isEarlyProfileRoute(true, "")).toBe(false)
  })
})
