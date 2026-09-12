
import { createClient } from '@/lib/supabase/server';
import OrgsClient from './OrgsClient';
import { redirect } from 'next/navigation';

export default async function AdminOrgsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/my-orders'); 

  const { data: orgs, error } = await supabase
    .from('organisations')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Organisations</h1>
          <p className="text-slate-500">Manage school and wholesale accounts.</p>
        </div>
      </div>
      <OrgsClient initialOrgs={orgs || []} />
    </div>
  );
}
