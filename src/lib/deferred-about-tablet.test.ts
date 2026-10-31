import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const publicSite = readFileSync(new URL("../components/public/PublicSite.tsx", import.meta.url), "utf8")

describe("Miniatura Sobre carregada sob demanda", () => {
  it("restringe adiamento ao PNG publicado e preserva o CMS para outras imagens", () => {
    expect(publicSite).toContain("a46a4091-bce1-4345-a17f-7d7947a8e903-tulius_tablet.png")
    expect(publicSite).toContain("item.image === APPROVED_ABOUT_TABLET")
    expect(publicSite).toContain("src={item.image}")
  })
  it("reserva proporções e carrega quando a imagem se aproxima da viewport", () => {
    expect(publicSite).toContain('rootMargin: "600px 0px"')
    expect(publicSite).toContain("src={nearViewport ? APPROVED_ABOUT_TABLET : undefined}")
    expect(publicSite).toContain("width={900}")
    expect(publicSite).toContain("height={1200}")
    expect(publicSite).toContain('fetchPriority="low"')
  })
})
