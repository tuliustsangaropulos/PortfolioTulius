/**
 * A tiny anonymous, read-only PostgREST query subset for public pages.
 * Admin/auth, Storage and writes remain in the lazy Supabase SDK.
 * Publishable keys belong only in apikey headers, never Bearer tokens.
 */
const apiUrl = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const isPublicConfigured = Boolean(apiUrl && publishableKey)

const tables = new Set([
  "pages",
  "site_settings",
  "sections",
  "section_panels",
  "block_placements",
  "design_tokens",
  "navigation_items",
  "career_experiences",
  "portfolio_projects",
  "metrics",
  "skills",
  "education",
  "language_levels",
  "tool_categories",
  "testimonials",
  "contact_channels",
])
type Result = { data: Record<string, unknown>[] | null; error: Error | null }

class ReadQuery implements PromiseLike<Result> {
  private readonly requestUrl: URL
  constructor(
    base: string,
    private readonly key: string,
    table: string,
    columns: string,
    private readonly reader: typeof fetch,
  ) {
    const root = base.endsWith("/") ? base.slice(0, -1) : base
    this.requestUrl = new URL(root + "/rest/v1/" + table)
    this.requestUrl.searchParams.set("select", columns)
  }
  eq(column: string, value: string | boolean | number) {
    this.requestUrl.searchParams.set(column, "eq." + String(value))
    return this
  }
  neq(column: string, value: string | boolean | number) {
    this.requestUrl.searchParams.set(column, "neq." + String(value))
    return this
  }
  order(column: string) {
    this.requestUrl.searchParams.set("order", column + ".asc")
    return this
  }
  limit(n: number) {
    this.requestUrl.searchParams.set("limit", String(n))
    return this
  }
  private async read(): Promise<Result> {
    try {
      const res = await this.reader(this.requestUrl.toString(), {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        headers: { apikey: this.key, Accept: "application/json" },
      })
      if (!res.ok) return { data: null, error: new Error("Anonymous read: HTTP " + res.status) }
      const data: unknown = await res.json()
      return Array.isArray(data)
        ? { data: data as Record<string, unknown>[], error: null }
        : { data: null, error: new Error("Invalid anonymous read payload") }
    } catch {
      return { data: null, error: new Error("Anonymous read unavailable") }
    }
  }
  async maybeSingle() {
    const result = await this.read()
    if (result.error) return { data: null, error: result.error }
    if ((result.data?.length ?? 0) > 1)
      return { data: null, error: new Error("Multiple rows for maybeSingle") }
    return { data: result.data?.[0] ?? null, error: null }
  }
  then<TResult1 = Result, TResult2 = never>(
    fulfilled?: ((value: Result) => TResult1 | PromiseLike<TResult1>) | null,
    rejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.read().then(fulfilled, rejected)
  }
}

export function createPublicReadClient(
  url: string = apiUrl,
  key: string = publishableKey,
  reader: typeof fetch = fetch,
) {
  if (!url || !key || !url.startsWith("https://")) throw new Error("Public reader not configured")
  return {
    from(table: string) {
      if (!tables.has(table)) throw new Error("Public table not allowed")
      return {
        select(columns: string) {
          return new ReadQuery(url, key, table, columns, reader)
        },
      }
    },
  }
}
