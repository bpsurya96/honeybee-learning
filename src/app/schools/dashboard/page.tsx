import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'School Dashboard | HoneyBee Learning',
};

export default async function SchoolDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/schools/dashboard');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('id', user.id)
    .single();

  if (profile?.account_type !== 'school_wholesale' && profile?.account_type !== 'admin') {
    redirect('/my-orders');
  }

  const { data: org } = await supabase
    .from('organisations')
    .select('*')
    .eq('profile_id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-dark-brown font-heading">Wholesale Portal</h1>
          <p className="mt-2 text-text-slate">Manage your school or organisation orders and settings.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-2xl p-6 md:p-8 border border-honey-light">
              <h2 className="text-xl font-bold text-text-dark-brown font-heading mb-4 border-b border-slate-100 pb-2">Organisation Details</h2>
              {org ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-slate-400 font-bold mb-1">Name</span>
                    <span className="text-slate-800 font-medium">{org.organisation_name}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold mb-1">Type</span>
                    <span className="text-slate-800 font-medium capitalize">{org.organisation_type}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold mb-1">GST</span>
                    <span className="text-slate-800 font-medium">{org.gst_number || 'Not provided'}</span>
                  </div>
                  <div className="sm:col-span-2 mt-2">
                    <span className="block text-slate-400 font-bold mb-1">Address</span>
                    <span className="text-slate-800 font-medium">
                      {org.address}, {org.city}, {org.state} - {org.pincode}
                    </span>
                  </div>
                  <div className="sm:col-span-2 mt-4">
                     <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        {org.is_verified ? 'Verified Partner' : 'Verification Pending'}
                     </span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">No organisation details found. Please contact support.</p>
              )}
            </div>

            <div className="bg-white shadow rounded-2xl p-6 md:p-8 border border-honey-light">
              <h2 className="text-xl font-bold text-text-dark-brown font-heading mb-4 border-b border-slate-100 pb-2">Bulk Orders</h2>
              <p className="text-slate-600 mb-6 text-sm">
                As a registered wholesale partner, you are eligible for custom branding on bulk orders (50+ units). 
                To place a bulk order, please contact your dedicated account manager on WhatsApp.
              </p>
              <a 
                href="https://wa.me/918883624873?text=Hi%20HoneyBee,%20I%20am%20a%20registered%20wholesale%20partner%20and%20want%20to%20place%20a%20bulk%20order."
                target="_blank"
                rel="noreferrer"
                className="inline-flex bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Place Bulk Order on WhatsApp
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-honey-yellow/10 rounded-2xl p-6 border border-honey-yellow/30">
              <h3 className="font-bold text-honey-amber mb-2">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">Our B2B support team is available Monday to Saturday, 9 AM - 6 PM.</p>
              <a href="tel:+918883624873" className="block text-sm font-bold text-text-charcoal hover:text-honey-amber mb-2">
                📞 +91 88836 24873
              </a>
              <a href="mailto:b2b@honeybeelearning.in" className="block text-sm font-bold text-text-charcoal hover:text-honey-amber">
                ✉️ b2b@honeybeelearning.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
