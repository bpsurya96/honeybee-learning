
'use server';

import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Service role client needed for Auth API (changing passwords, etc.)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function updateUserAdmin(userId: string, data: any) {
  const supabase = await createServerClient();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single();
  
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  // Update profile
  if (data.role || data.full_name) {
    const { error } = await supabase.from('profiles').update({
      role: data.role,
      full_name: data.full_name,
    }).eq('id', userId);
    
    if (error) throw error;
  }

  // Update password if provided (Requires SUPABASE_SERVICE_ROLE_KEY)
  if (data.password) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
       throw new Error('SUPABASE_SERVICE_ROLE_KEY is required to update passwords.');
    }
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: data.password
    });
    if (error) throw error;
  }

  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateOrganisationAdmin(orgId: string, data: any) {
  const supabase = await createServerClient();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single();
  
  if (profile?.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabase.from('organisations').update(data).eq('id', orgId);
  if (error) throw error;

  revalidatePath('/admin/organisations');
  return { success: true };
}

export async function updateEnquiryAdmin(enquiryId: string, status: string) {
  const supabase = await createServerClient();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single();
  
  if (profile?.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabase.from('enquiries').update({ status }).eq('id', enquiryId);
  if (error) throw error;

  revalidatePath('/admin/enquiries');
  return { success: true };
}
