import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // We use dummy URLs if env vars are missing to prevent build crashes, 
  // but warn the user they need to set them up.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
