import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(url && publishableKey)
export const supabase = isSupabaseConfigured
  ? createClient(url, publishableKey)
  : null

export async function isAdmin() {
  if (!supabase) return false
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle()
  return Boolean(data)
}
