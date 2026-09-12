
import { createClient } from '@/lib/supabase/server';
import UsersClient from './UsersClient';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/my-orders'); 

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Users</h1>
          <p className="text-slate-500">Manage user roles and profiles.</p>
        </div>
      </div>
      <UsersClient initialUsers={users || []} />
    </div>
  );
}
