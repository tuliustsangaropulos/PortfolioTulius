import { describe, expect, it } from "vitest"
import { shouldRenderEarlyProfile } from "./early-profile"

describe("Progressive first fold", () => {
  it("allows early profile for the public landing page", () => {
    for (const hash of ["", "#perfil", "#perfil-a", "#perfil-b"]) {
      expect(shouldRenderEarlyProfile(false, hash)).toBe(true)
    }
  })
  it("never renders incomplete data in preview or while deep-linking", () => {
    expect(shouldRenderEarlyProfile(true, "")).toBe(false)
    expect(shouldRenderEarlyProfile(true, "#perfil")).toBe(false)
    expect(shouldRenderEarlyProfile(false, "#contato")).toBe(false)
    expect(shouldRenderEarlyProfile(false, "#sobre")).toBe(false)
  })
})
