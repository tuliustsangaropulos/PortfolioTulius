import { describe, expect, it } from "vitest"
import { placementMotionVariables } from "./placement-motion"

describe("placement motion CSS variables", () => {
  it("uses ms for timings and px only for distances", () => {
    expect(placementMotionVariables({ duration: 520, delay: 120, distance: 18 })).toEqual({
      "--placement-duration": "520ms",
      "--placement-delay": "120ms",
      "--placement-distance": "18px",
    })
  })

  it("preserves valid zero values", () => {
    expect(placementMotionVariables({ duration: 0, delay: 0, distance: 0 })).toEqual({
      "--placement-duration": "0ms",
      "--placement-delay": "0ms",
      "--placement-distance": "0px",
    })
  })

  it("enforces existing limits without modifying other layout properties", () => {
    expect(placementMotionVariables({ duration: 2200, delay: 900, distance: 80 })).toEqual({
      "--placement-duration": "1200ms",
      "--placement-delay": "600ms",
      "--placement-distance": "48px",
    })
  })

  it("leaves unspecified or invalid values to CSS defaults", () => {
    const unset = {
      "--placement-duration": undefined,
      "--placement-delay": undefined,
      "--placement-distance": undefined,
    }
    expect(placementMotionVariables()).toEqual(unset)
    expect(
      placementMotionVariables({
        duration: "520",
        delay: Number.NaN,
        distance: Number.POSITIVE_INFINITY,
      }),
    ).toEqual(unset)
  })
})
