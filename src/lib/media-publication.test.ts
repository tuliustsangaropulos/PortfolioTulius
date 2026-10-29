import { describe, expect, it } from "vitest"
import { getPublishedImageChoices } from "./media-selection"

const row = (storage_bucket: string) => ({
  id: storage_bucket, title: "photo.jpg", alt_text: "", mime_type: "image/jpeg",
  storage_bucket, storage_path: "photo.jpg", status: "published",
})

describe("published metadata cannot expose private media", () => {
  it("excludes the private bucket from public page media choices", () => {
    const choices = getPublishedImageChoices(
      [row("portfolio-private"), row("portfolio-public")],
      (path) => "https://example.supabase.co/storage/v1/object/public/portfolio-public/" + path,
    )
    expect(choices).toHaveLength(1)
    expect(choices[0]?.id).toBe("portfolio-public")
  })
})
