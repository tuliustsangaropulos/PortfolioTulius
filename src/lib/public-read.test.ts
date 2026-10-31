import { afterEach, describe, expect, it, vi } from "vitest"
import { createPublicReadClient } from "./public-read"

afterEach(() => vi.unstubAllGlobals())

describe("leitura pública PostgREST", () => {
  it("preserva chave pública, autenticação anônima e filtro de publicação", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ id: "published" }]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    vi.stubGlobal("fetch", fetchMock)
    const client = createPublicReadClient("https://example.supabase.co/", "sb_publishable_test")
    const { data, error } = await client
      .from("sections")
      .select("id,content_blocks(id,status,content_json)")
      .eq("status", "published")
      .eq("is_visible", true)
      .order("sort_order")
    expect(error).toBeNull()
    expect(data).toEqual([{ id: "published" }])
    expect(fetchMock).toHaveBeenCalledOnce()
    const [input, options] = fetchMock.mock.calls[0]
    const url = new URL(String(input))
    expect(url.pathname).toBe("/rest/v1/sections")
    expect(url.searchParams.get("status")).toBe("eq.published")
    expect(url.searchParams.get("is_visible")).toBe("eq.true")
    expect(url.searchParams.get("order")).toBe("sort_order.asc")
    expect(url.searchParams.get("select")).toBe("id,content_blocks(id,status,content_json)")
    const headers = new Headers(options.headers)
    expect(headers.get("apikey")).toBe("sb_publishable_test")
    expect(headers.get("authorization")).toBe("Bearer sb_publishable_test")
    expect(options.method).toBe("GET")
  })

  it("não faz nenhuma operação de escrita", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ description: "publicada" }]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    vi.stubGlobal("fetch", fetchMock)
    const client = createPublicReadClient("https://example.supabase.co", "sb_publishable_test")
    const { error } = await client
      .from("career_experiences")
      .select("company,description")
      .eq("status", "published")
    expect(error).toBeNull()
    expect(fetchMock.mock.calls.every(([, options]) => options.method === "GET")).toBe(true)
  })
})
