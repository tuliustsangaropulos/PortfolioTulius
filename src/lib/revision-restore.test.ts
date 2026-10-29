import { describe, expect, it } from "vitest"
import { prepareContentRestoration } from "./revision-restore"

const current = {
  id: "sample",
  updated_at: "2026-10-29T00:00:00Z",
  status: "published",
  is_visible: true,
  title: "Atual",
  intro: "Texto atual",
  eyebrow: "Atuação",
}

describe("restauração editorial segura", () => {
  it("recupera somente textos de seções e mantém publicação/visibilidade", () => {
    const plan = prepareContentRestoration(
      "sections",
      "sample",
      {
        ...current,
        title: "Original",
        intro: null,
        status: "archived",
        is_visible: false,
      },
      current,
    )
    expect(plan.patch).toEqual({ title: "Original", intro: null })
    expect(plan.changedFields).toEqual(["title", "intro"])
  })

  it("recupera apenas JSON do bloco, sem restaurar status nem outros campos", () => {
    const plan = prepareContentRestoration(
      "content_blocks",
      "sample",
      {
        id: "sample",
        content_json: { items: [{ title: "Antes" }] },
        status: "draft",
      },
      { id: "sample", updated_at: current.updated_at, content_json: { items: [] } },
    )
    expect(plan.patch).toEqual({ content_json: { items: [{ title: "Antes" }] } })
  })

  it("bloqueia revisão sem identidade correspondente", () => {
    expect(() =>
      prepareContentRestoration(
        "sections",
        "sample",
        {
          ...current,
          id: "outro",
        },
        current,
      ),
    ).toThrow("não pertence")
  })

  it("bloqueia restauração de metadados de mídia e arquivos", () => {
    expect(() =>
      prepareContentRestoration(
        "media_assets",
        "sample",
        {
          id: "sample",
        },
        current,
      ),
    ).toThrow("somente para consulta")
  })

  it("não executa alteração quando o conteúdo já coincide", () => {
    expect(prepareContentRestoration("sections", "sample", current, current).changedFields).toEqual(
      [],
    )
  })
})
