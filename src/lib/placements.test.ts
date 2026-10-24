import { describe, expect, it } from "vitest"
import {
  composeSectionPlacements,
  type BlockPlacementRow,
  type ContentBlockRow,
  type SectionPanelRow,
} from "./placements"

const panels: SectionPanelRow[] = [
  { id: "d", section_id: "s", panel_key: "desktop" },
  { id: "a", section_id: "s", panel_key: "mobile-a" },
  { id: "b", section_id: "s", panel_key: "mobile-b" },
]
const blocks: ContentBlockRow[] = [
  {
    id: "x",
    section_id: "s",
    sort_order: 1,
    mobile_panel: "a",
    status: "published",
    content_json: { items: [{ title: "Texto único" }] },
  },
  {
    id: "y",
    section_id: "s",
    sort_order: 2,
    mobile_panel: "b",
    status: "draft",
    content_json: { items: [{ title: "Rascunho" }] },
  },
]
function placement(
  block_id: string,
  panel_id: string,
  is_visible = true,
  sort_order = 1,
): BlockPlacementRow {
  return {
    block_id,
    panel_id,
    sort_order,
    layout_variant: "featured",
    style_config: { spacing: 12 },
    motion_config: { preset: "fade-in" },
    is_visible,
  }
}

describe("composição por placements", () => {
  it("reutiliza conteúdo sem misturar os painéis desktop e mobile", () => {
    const result = composeSectionPlacements("s", blocks, panels, [
      placement("x", "d"),
      placement("x", "b"),
    ])
    expect(result.desktopA.map((item) => item.title)).toEqual(["Texto único"])
    expect(result.desktopB).toEqual([])
    expect(result.mobileA).toEqual([])
    expect(result.mobileB.map((item) => item.title)).toEqual(["Texto único"])
    expect(result.desktopA[0].placement?.layoutVariant).toBe("featured")
  })

  it("respeita visibilidade, estado editorial e painel de outra seção", () => {
    const result = composeSectionPlacements(
      "s",
      blocks,
      [...panels, { id: "other", panel_key: "desktop", section_id: "other" }],
      [
        placement("x", "d", false),
        placement("x", "a"),
        placement("x", "other"),
        placement("y", "b"),
      ],
    )
    expect(result.desktopA).toEqual([])
    expect(result.mobileA).toHaveLength(1)
    expect(result.mobileB).toEqual([])
  })

  it("inclui drafts só na prévia e mantém ordenação por placement", () => {
    const result = composeSectionPlacements(
      "s",
      blocks,
      panels,
      [placement("y", "b", true, 1), placement("x", "b", true, 2)],
      true,
    )
    expect(result.mobileB.map((item) => item.title)).toEqual(["Rascunho", "Texto único"])
    expect(blocks[0].content_json?.items?.[0]).not.toHaveProperty("placement")
  })
})
