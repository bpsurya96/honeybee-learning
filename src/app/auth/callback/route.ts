import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // The session is successfully established.
      // They will be redirected to the intended destination (e.g. /my-orders).
      // The middleware will automatically check if their profile is complete and redirect if necessary.
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to the login page with an error if code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`)
}
