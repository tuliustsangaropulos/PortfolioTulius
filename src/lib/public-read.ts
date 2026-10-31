import { PostgrestClient } from "@supabase/postgrest-js"

// Public pages only need PostgREST reads. Auth, Realtime and Storage remain
// available exclusively through the full Supabase client on admin routes.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export function createPublicReadClient(baseUrl: string, publishableKey: string) {
  return new PostgrestClient(`${baseUrl.replace(/\/+$/, "")}/rest/v1`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
  })
}

export const publicReadClient =
  url && key ? createPublicReadClient(url, key) : null
