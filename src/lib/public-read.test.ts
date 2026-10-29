import { describe, expect, it, vi } from "vitest"
import { createPublicReadClient } from "./public-read"

describe("anonymous public reader", () => {
  it("uses GET and publishable apikey only, preserving PostgREST filters", async () => {
    const mocked = vi.fn(
      async () => new Response(JSON.stringify([{ title: "Invest RS" }]), { status: 200 }),
    )
    const client = createPublicReadClient(
      "https://example.supabase.co",
      "sb_publishable_test",
      mocked as typeof fetch,
    )
    const result = await client
      .from("sections")
      .select("id,title,content_blocks(id,status,content_json)")
      .eq("status", "published")
      .eq("is_visible", true)
      .order("sort_order")
    expect(result.error).toBeNull()
    expect(result.data?.[0]?.title).toBe("Invest RS")
    expect(mocked).toHaveBeenCalledTimes(1)
    const [request, opts] = mocked.mock.calls[0] as unknown as [string, RequestInit]
    const url = new URL(request)
    expect(url.pathname).toBe("/rest/v1/sections")
    expect(url.searchParams.get("select")).toContain("content_blocks")
    expect(url.searchParams.get("status")).toBe("eq.published")
    expect(url.searchParams.get("is_visible")).toBe("eq.true")
    expect(url.searchParams.get("order")).toBe("sort_order.asc")
    expect(opts.method).toBe("GET")
    expect(opts.credentials).toBe("omit")
    expect(opts.headers).toEqual({ apikey: "sb_publishable_test", Accept: "application/json" })
  })
  it("offers no mutation methods or administrative table access", () => {
    const client = createPublicReadClient("https://example.supabase.co", "sb_publishable_test")
    expect(() => client.from("admin_users")).toThrow()
    expect("insert" in client.from("sections").select("*")).toBe(false)
    expect("rpc" in client).toBe(false)
  })
  it("resolves optional single rows and reports HTTP failures", async () => {
    const client = createPublicReadClient(
      "https://example.supabase.co",
      "sb_publishable_test",
      vi.fn(async () => new Response("[]", { status: 200 })) as typeof fetch,
    )
    expect(await client.from("pages").select("seo_title").eq("slug", "home").maybeSingle()).toEqual(
      { data: null, error: null },
    )
    const denied = createPublicReadClient(
      "https://example.supabase.co",
      "sb_publishable_test",
      vi.fn(async () => new Response("denied", { status: 403 })) as typeof fetch,
    )
    const result = await denied.from("sections").select("*")
    expect(result.data).toBeNull()
    expect(result.error?.message).toContain("403")
  })
})
