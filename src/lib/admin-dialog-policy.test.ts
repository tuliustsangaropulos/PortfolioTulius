import { readFileSync, readdirSync } from "node:fs"
import { describe, expect, it } from "vitest"

/** No native browser confirmations are allowed anywhere in the CMS. */
describe("Administração usa apenas diálogos próprios", () => {
  const adminDirectory = new URL("../components/admin/", import.meta.url)
  const files = readdirSync(adminDirectory).filter((filename) => filename.endsWith(".tsx"))
  it("não usa confirm, alert ou prompt do navegador", () => {
    expect(files.length).toBeGreaterThan(0)
    for (const filename of files) {
      const source = readFileSync(new URL(filename, adminDirectory), "utf8")
      expect(source, filename).not.toMatch(/\b(?:window\.)?(?:confirm|alert|prompt)\s*\(/)
      if (filename !== "AdminApp.tsx")
        expect(source, filename).not.toMatch(/\b(?:onbeforeunload|beforeunload)\b/)
    }
  })
  it("intercepta refresh somente quando há edição, usando o alerta obrigatório do navegador", () => {
    const app = readFileSync(new URL("AdminApp.tsx", adminDirectory), "utf8")
    expect(app).toContain('window.addEventListener("beforeunload", warn)')
    expect(app).toContain("if (!editorDirty) return")
    expect(app).toContain('window.removeEventListener("beforeunload", warn)')
  })
  it("mantém o diálogo acessível como ponto único de confirmação", () => {
    const dialog = readFileSync(new URL("AdminConfirmationHost.tsx", adminDirectory), "utf8")
    expect(dialog).toContain('role="alertdialog"')
    expect(dialog).toContain('aria-modal="true"')
    expect(dialog).toContain('event.key === "Escape"')
    expect(dialog).toContain("adminConfirm")
  })
})
