import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (file: string) =>
  readFileSync(new URL("../components/admin/" + file, import.meta.url), "utf8")
const css = readFileSync(new URL("../index.css", import.meta.url), "utf8")

describe("UX do editor: avisos e enquadramento", () => {
  it("retira o aviso de origem sem retirar acesso a registros vinculados", () => {
    const editor = read("AdminModules.tsx")
    expect(editor).not.toContain("Origem do conteúdo:")
    expect(editor).not.toContain("As alterações dos itens deste bloco")
    expect(editor).toContain("site-editor-collection-action")
    expect(editor).toContain("Editar registros vinculados")
  })
  it("mostra a orientação da seção 02 somente no ícone de informações", () => {
    const editor = read("AdminModules.tsx")
    expect(editor).toContain("block-item-help")
    expect(editor).toContain('label="Textos da seção 02 — coluna direita"')
    expect(editor).toContain("O primeiro item também aparece junto à foto")
    expect(editor).not.toContain("<strong>Textos da seção 02 — coluna direita</strong>")
  })
  it("mantém a imagem do modal confinada à prévia, separada dos controles", () => {
    const frame = read("MediaFramingDialog.tsx")
    expect(frame).toContain("42dvh")
    expect(frame).toContain("media-frame-stage")
    expect(css).toContain(".media-frame-stage > img { position: absolute; inset: 0;")
    expect(css).toContain(".media-frame-controls { position: relative; z-index: 1;")
    expect(frame).toContain("onChange(current)")
  })
})
