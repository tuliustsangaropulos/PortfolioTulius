import { describe, expect, it } from "vitest"
import {
  defaultMediaFraming,
  imageFramingStyle,
  mediaFileName,
  normalizeMediaFraming,
} from "./media-framing"

describe("Enquadramento editorial por uso", () => {
  it("padroniza valores, sem alterar a imagem original", () => {
    expect(normalizeMediaFraming()).toEqual(defaultMediaFraming)
    expect(normalizeMediaFraming({ x: -9, y: 120, zoom: 10 })).toEqual({
      x: 0,
      y: 100,
      zoom: 3,
    })
  })
  it("aplica posição X/Y e zoom na apresentação", () => {
    expect(imageFramingStyle({ x: 30, y: 65, zoom: 1.4 })).toMatchObject({
      objectPosition: "30% 65%",
      transform: "scale(1.4)",
      transformOrigin: "30% 65%",
    })
    expect(imageFramingStyle(undefined)).toBeUndefined()
  })
  it("usa nome do arquivo com extensão, sem diretórios", () => {
    expect(mediaFileName("galerias/vale-01.svg")).toBe("vale-01.svg")
    expect(mediaFileName("vale.png")).toBe("vale.png")
  })
})
