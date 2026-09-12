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
      username: cleanUsername,
      is_profile_complete: true
    })
    .eq('id', user.id)

  if (error) {
    // 23505 is Postgres unique violation
    if (error.code === '23505') {
       throw new Error('Username already exists')
    }
    throw new Error(error.message)
  }

  // Handle organisation insert if necessary
  if (accountType === 'school_wholesale') {
    const orgName = formData.get('orgName') as string
    const orgType = formData.get('orgType') as string
    const gst = formData.get('gst') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const pincode = formData.get('pincode') as string

    if (!orgName || !orgType || !address || !city || !state || !pincode) {
      throw new Error('All organisation fields are required')
    }

    const { error: orgError } = await supabase.from('organisations').insert({
      profile_id: user.id,
      organisation_name: orgName,
      organisation_type: orgType,
      gst_number: gst || null,
      address,
      city,
      state,
      pincode
    });

    if (orgError) {
      throw new Error('Failed to save organisation details')
    }
  }

  const nextUrl = (formData.get('next') as string) || '/my-orders'
  const safeNext = nextUrl.startsWith('/') ? nextUrl : '/'

  revalidatePath('/', 'layout')
  redirect(safeNext)
}
