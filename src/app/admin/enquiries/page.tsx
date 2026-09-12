
import { createClient } from '@/lib/supabase/server';
import EnquiriesClient from './EnquiriesClient';
import { redirect } from 'next/navigation';

export default async function AdminEnquiriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/my-orders'); 

  const { data: enquiries, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Enquiries</h1>
          <p className="text-slate-500">Manage incoming customer enquiries.</p>
        </div>
      </div>
      <EnquiriesClient initialEnquiries={enquiries || []} />
    </div>
  );
}
