import { isSafeEditorialImage } from "./validation"

export type MediaLibraryRow = {
  id: string
  title: string | null
  alt_text: string | null
  mime_type: string | null
  storage_bucket: string
  storage_path: string
  status: string
}

export type PublishedImageChoice = {
  id: string
  title: string
  alt: string
  url: string
  path: string
}

/** Only public, published image assets can be linked into publicly rendered content. */
export function getPublishedImageChoices(
  rows: readonly MediaLibraryRow[],
  publicUrl: (path: string) => string,
): PublishedImageChoice[] {
  const types = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"])
  return rows
    .filter(
      (row) =>
        row.storage_bucket === "portfolio-public" &&
        row.status === "published" &&
        types.has(row.mime_type ?? "") &&
        Boolean(row.storage_path),
    )
    .flatMap((row) => {
      let url = ""
      try {
        url = publicUrl(row.storage_path)
      } catch {
        return []
      }
      return isSafeEditorialImage(url)
        ? [
            {
              id: row.id,
              title: row.title?.trim() || row.storage_path,
              alt: row.alt_text?.trim() || "",
              url,
              path: row.storage_path,
            },
          ]
        : []
    })
}
