import { describe, expect, it } from "vitest"
import { splitExperienceBullet } from "./experience-text"

describe("Experience trajectory bullets", () => {
  it("emphasizes only the label preceding a colon, preserving the original copy", () => {
    expect(
      splitExperienceBullet("• Comunicação institucional e posicionamento: Planejamento de ações."),
    ).toEqual({
      heading: "• Comunicação institucional e posicionamento:",
      body: " Planejamento de ações.",
    })
  })
  it("preserves introductory paragraphs and bullets without a heading", () => {
    expect(splitExperienceBullet("Atuação em comunicação institucional.")).toBeNull()
    expect(splitExperienceBullet("• Apoio em projetos digitais")).toBeNull()
  })
})
