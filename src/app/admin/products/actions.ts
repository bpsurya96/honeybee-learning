
'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createProductAdmin(data: any) {
  const supabase = await createServerClient();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single();
  if (profile?.role !== 'admin') throw new Error('Unauthorized');

  const { data: product, error } = await supabase.from('products').insert([data]).select().single();
  if (error) throw error;

  revalidatePath('/admin/products');
  return { success: true, product };
}

export async function updateProductAdmin(id: string, data: any) {
  const supabase = await createServerClient();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single();
  if (profile?.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabase.from('products').update(data).eq('id', id);
  if (error) throw error;

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}`);
  return { success: true };
}

export async function deleteProductAdmin(id: string) {
  const supabase = await createServerClient();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single();
  if (profile?.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;

  revalidatePath('/admin/products');
  return { success: true };
}
