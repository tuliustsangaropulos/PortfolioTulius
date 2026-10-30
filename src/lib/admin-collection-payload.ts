/** Keep CMS-only presentation fields out of the Supabase Data API payload. */
export function normalizeCollectionRecord<T extends Record<string, any>>(
  record: T,
  table: string,
): T {
  if (table !== "tool_categories") return { ...record }
  return {
    ...record,
    tools_text: Array.isArray(record.tools)
      ? record.tools
          .map((tool: { name?: string } | string) =>
            typeof tool === "string" ? tool : (tool.name ?? ""),
          )
          .join("\n")
      : "",
  }
}

export function buildCollectionSavePayload(draft: Record<string, any>, table: string) {
  const payload = { ...draft }
  delete payload.id
  delete payload.updated_at
  delete payload.tools_text
  if (table === "tool_categories") {
    payload.tools = String(draft.tools_text ?? "")
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name }))
  }
  return payload
}
