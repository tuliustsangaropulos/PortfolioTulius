import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (name: string) =>
  readFileSync(new URL("../components/admin/" + name, import.meta.url), "utf8")

describe("Editor: competências e mapeamento das experiências", () => {
  it("edita badges no bloco A e mantém o contrato de rascunho", () => {
    const src = read("AdminModules.tsx")
    expect(src).toContain("Competências aplicadas — tags abaixo do período")
    expect(src).toContain('items.unshift({ title: "Competências aplicadas", tags })')
    expect(src).toContain("setDraft({ ...draft, content_json: { ...draft.content_json, items } })")
    expect(src).toContain('onEditCollection("career_experiences")')
  })
  it("explica a correspondência entre títulos de slides e itens do CMS", () => {
    const src = read("AdminModules.tsx")
    expect(src).toContain("Cada título de slide é um projeto clicável")
    expect(src).toContain("Indicadores permanecem independentes.")
  })
})
