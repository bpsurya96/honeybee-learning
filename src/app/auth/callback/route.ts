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
      // Ensure 'next' is a relative path to prevent open redirect vulnerabilities
      const safeNext = next.startsWith('/') ? next : '/'
      return NextResponse.redirect(`${origin}${safeNext}`)
    }
  }

  // return the user to the login page with an error if code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`)
}
