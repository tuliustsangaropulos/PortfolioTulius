import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const css = readFileSync(new URL("../index.css", import.meta.url), "utf8")

describe("Responsividade administrativa sem alterar o site público", () => {
  it("converte a navegação fixa em faixa horizontal nos tablets e celulares", () => {
    expect(css).toMatch(
      /@media \(max-width: 1100px\) \{[\s\S]*?\.admin-shell \{ display: flex; flex-direction: column;/,
    )
    expect(css).toContain("overscroll-behavior-inline: contain")
    expect(css).toContain(".admin-sidebar nav button {")
  })

  it("adapta formulários, mídia, modais e toques para celular", () => {
    expect(css).toContain(".admin-stats, .field-grid, .responsive-style-grid")
    expect(css).toContain(".block-item-head .order-buttons button { min-width: 44px")
    expect(css).toContain(".admin-confirm-actions { flex-direction: column-reverse")
    expect(css).toContain(".site-editor-preview-frame.mobile { width: 100%")
    expect(css).toContain("@media (max-width: 380px)")
  })
})
