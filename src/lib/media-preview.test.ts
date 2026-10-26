import type { SupabaseClient } from "@supabase/supabase-js"
import { describe, expect, it, vi } from "vitest"
import { resolveMediaPreview } from "./media-preview"

function fakeStorage() {
  const getPublicUrl = vi
    .fn()
    .mockReturnValue({ data: { publicUrl: "https://assets.example/public/logo.png" } })
  const createSignedUrl = vi.fn().mockResolvedValue({
    data: { signedUrl: "https://assets.example/private/logo.png?token=limited" },
    error: null,
  })
  const from = vi.fn().mockReturnValue({ getPublicUrl, createSignedUrl })
  return {
    storage: { from } as unknown as SupabaseClient["storage"],
    from,
    getPublicUrl,
    createSignedUrl,
  }
}

describe("resolveMediaPreview", () => {
  it("uses only the public bucket's permanent URL for published objects", async () => {
    const mock = fakeStorage()
    const result = await resolveMediaPreview(mock.storage, {
      storage_bucket: "portfolio-public",
      storage_path: "logo.png",
    })
    expect(result).toEqual({ url: "https://assets.example/public/logo.png" })
    expect(mock.from).toHaveBeenCalledWith("portfolio-public")
    expect(mock.getPublicUrl).toHaveBeenCalledWith("logo.png")
    expect(mock.createSignedUrl).not.toHaveBeenCalled()
  })

  it("signs private previews for one hour without exposing a public URL", async () => {
    const mock = fakeStorage()
    const result = await resolveMediaPreview(mock.storage, {
      storage_bucket: "portfolio-private",
      storage_path: "logo.png",
    })
    expect(result.url).toContain("token=limited")
    expect(mock.from).toHaveBeenCalledWith("portfolio-private")
    expect(mock.createSignedUrl).toHaveBeenCalledWith("logo.png", 3600)
    expect(mock.getPublicUrl).not.toHaveBeenCalled()
  })

  it("reports an explicit error if signing private content is denied", async () => {
    const mock = fakeStorage()
    mock.createSignedUrl.mockResolvedValue({ data: null, error: { message: "denied" } })
    expect(
      await resolveMediaPreview(mock.storage, {
        storage_bucket: "portfolio-private",
        storage_path: "logo.png",
      }),
    ).toEqual({ error: "Não foi possível abrir a prévia: denied" })
  })

  it("handles rejected preview requests without failing the entire library", async () => {
    const mock = fakeStorage()
    mock.createSignedUrl.mockRejectedValue(new Error("network"))
    expect(
      await resolveMediaPreview(mock.storage, {
        storage_bucket: "portfolio-private",
        storage_path: "logo.png",
      }),
    ).toEqual({ error: "Falha ao solicitar a prévia privada." })
  })

  it("does not make storage requests for missing file paths", async () => {
    const mock = fakeStorage()
    expect(
      await resolveMediaPreview(mock.storage, {
        storage_bucket: "portfolio-public",
        storage_path: "",
      }),
    ).toEqual({ error: "Arquivo sem caminho de armazenamento." })
    expect(mock.from).not.toHaveBeenCalled()
  })

  it("refuses unknown buckets instead of constructing arbitrary URLs", async () => {
    const mock = fakeStorage()
    expect(
      await resolveMediaPreview(mock.storage, {
        storage_bucket: "unknown",
        storage_path: "logo.png",
      }),
    ).toEqual({ error: "Bucket de mídia não reconhecido." })
    expect(mock.from).not.toHaveBeenCalled()
  })

  it("explains when storage fails to provide a usable preview URL", async () => {
    const mock = fakeStorage()
    mock.getPublicUrl.mockReturnValue({ data: { publicUrl: "" } })
    expect(
      await resolveMediaPreview(mock.storage, {
        storage_bucket: "portfolio-public",
        storage_path: "missing.png",
      }),
    ).toEqual({ error: "URL pública indisponível." })
    mock.createSignedUrl.mockResolvedValue({ data: null, error: null })
    expect(
      await resolveMediaPreview(mock.storage, {
        storage_bucket: "portfolio-private",
        storage_path: "missing.png",
      }),
    ).toEqual({ error: "Link privado da prévia indisponível." })
  })
})
