import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';

export const metadata = {
  title: 'My Profile | HoneyBee Learning',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/profile');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-dark-brown font-heading">My Profile</h1>
          <p className="mt-2 text-text-slate">Manage your account settings and personal details.</p>
        </div>
        
        <div className="bg-white shadow rounded-2xl p-6 md:p-8 border border-honey-light">
          <ProfileForm initialProfile={profile} email={user.email || ''} />
        </div>
      </div>
    </div>
  );
}
