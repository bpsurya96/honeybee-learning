'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function checkUsernameAction(username: string) {
  const supabase = await createClient()
  
  // Clean username
  const cleanUsername = username.trim().toLowerCase()
  
  if (cleanUsername.length < 3) return false
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', cleanUsername)
    .single()
    
  if (data) return false // Username is taken
  return true // Username is available
}

export async function completeProfileAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  const accountType = formData.get('accountType') as string
  const phone = formData.get('phone') as string
  const username = formData.get('username') as string

  // Validate inputs
  if (!accountType || !phone || !username) {
    throw new Error('All fields are required')
  }

  const cleanUsername = username.trim().toLowerCase()
  const usernameRegex = /^[a-zA-Z0-9_-]+$/
  if (!usernameRegex.test(cleanUsername) || cleanUsername.length < 3 || cleanUsername.length > 20) {
    throw new Error('Invalid username format. Use 3-20 characters, letters, numbers, _, -')
  }

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      account_type: accountType,
      phone: phone,
      username: cleanUsername
    })
    .eq('id', user.id)

  if (error) {
    // 23505 is Postgres unique violation
    if (error.code === '23505') {
       throw new Error('Username already exists')
    }
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/my-orders')
}
