import { describe, expect, it } from "vitest"
import { sections } from "../content/fallback"
import { buildPublicNavigation, type NavigationRow } from "./navigation"

const row = (slug: string, order: number, extra: Partial<NavigationRow> = {}): NavigationRow => ({
  target_slug: slug,
  label: slug,
  group_name: "Principal",
  sort_order: order,
  status: "published",
  is_visible: true,
  ...extra,
})

describe("navegação editorial", () => {
  it("segue a ordem e os grupos editoriais sem reordenar as seções", () => {
    const entries = buildPublicNavigation(sections, [
      row("sobre", 2, { label: "Quem sou", group_name: "Sobre" }),
      row("contato", 1, { label: "Contato", group_name: "Ação" }),
    ])
    expect(entries.map((item) => item.slug)).toEqual(["contato", "sobre"])
    expect(entries.map((item) => item.group)).toEqual(["Ação", "Sobre"])
    expect(sections[0].slug).toBe("perfil")
  })

  it("exclui ocultos, drafts, duplicatas e âncoras inexistentes", () => {
    const entries = buildPublicNavigation(sections, [
      row("perfil", 1, { is_visible: false }),
      row("sobre", 2, { status: "draft" }),
      row("nao-existe", 3),
      row("contato", 4),
      row("contato", 5),
    ])
    expect(entries.map((item) => item.slug)).toEqual(["contato"])
  })

  it("aceita menu deliberadamente vazio", () => {
    expect(buildPublicNavigation(sections, [])).toEqual([])
  })
})
