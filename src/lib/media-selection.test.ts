import { describe, expect, it } from "vitest"
import {
  getPublishedImageChoices,
  withOpenGraphImage,
  type MediaLibraryRow,
} from "./media-selection"

const base: MediaLibraryRow = {
  id: "a",
  title: "Logo Vale",
  alt_text: "Logotipo da Vale",
  mime_type: "image/png",
  storage_bucket: "portfolio-public",
  storage_path: "logos/vale.png",
  status: "published",
}
const url = (path: string) => `https://assets.example/${path}`

describe("getPublishedImageChoices", () => {
  it("selects published public images and includes metadata", () => {
    expect(getPublishedImageChoices([base], url)).toEqual([
      {
        id: "a",
        title: "vale.png",
        alt: "Logotipo da Vale",
        url: "https://assets.example/logos/vale.png",
        path: "logos/vale.png",
      },
    ])
  })

  it("excludes private, draft, archived, and in-review assets", () => {
    const rows = [
      { ...base, id: "b", storage_bucket: "portfolio-private" },
      { ...base, id: "c", status: "draft" },
      { ...base, id: "d", status: "archived" },
      { ...base, id: "e", status: "in_review" },
    ]
    expect(getPublishedImageChoices(rows, url)).toEqual([])
  })

  it("excludes non-image uploads and empty file paths", () => {
    const rows = [
      { ...base, mime_type: "application/pdf" },
      { ...base, storage_path: "" },
    ]
    expect(getPublishedImageChoices(rows, url)).toEqual([])
  })

  it("supports JPEG, PNG, WebP, and SVG", () => {
    const rows = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].map(
      (mime_type, index) => ({
        ...base,
        id: String(index),
        mime_type,
      }),
    )
    expect(getPublishedImageChoices(rows, url)).toHaveLength(4)
  })

  it("handles missing metadata without inventing text", () => {
    const rows = [{ ...base, title: null, alt_text: null }]
    expect(getPublishedImageChoices(rows, url)[0]).toMatchObject({
      title: "vale.png",
      alt: "",
    })
  })

  it("rejects unsafe URLs and URL-generation failures", () => {
    expect(getPublishedImageChoices([base], () => "javascript:alert(1)")).toEqual([])
    expect(
      getPublishedImageChoices([base], () => {
        throw new Error("storage")
      }),
    ).toEqual([])
  })
})

describe("withOpenGraphImage", () => {
  it("keeps other SEO options while selecting a published image", () => {
    const original = {
      canonical: "https://tulius.work/",
      robots: "index,follow",
      ogImage: "https://old.example/og.png",
    }
    const changed = withOpenGraphImage(original, "https://assets.example/share.png")
    expect(changed).toEqual({
      canonical: "https://tulius.work/",
      robots: "index,follow",
      ogImage: "https://assets.example/share.png",
    })
    expect(original.ogImage).toBe("https://old.example/og.png")
  })

  it("can clear the image without losing SEO metadata", () => {
    expect(withOpenGraphImage({ canonical: "https://tulius.work/" }, "")).toEqual({
      canonical: "https://tulius.work/",
      ogImage: "",
    })
  })

  it("accepts empty original configuration", () => {
    expect(withOpenGraphImage(null, "https://assets.example/share.png")).toEqual({
      ogImage: "https://assets.example/share.png",
    })
  })
})
