
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Users, IndianRupee, ShoppingBag, Eye, TrendingDown, ArrowUpRight } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/my-orders'); 

  // Fetch quick stats
  const [
    { count: totalUsers },
    { count: totalOrders, data: ordersData },
    { count: totalVisits },
    { count: totalDrops }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount'),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'page_view'),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'checkout_drop')
  ]);

  const totalRevenue = ordersData?.reduce((acc, order) => acc + Number(order.total_amount || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Overview Analytics</h1>
        <p className="text-slate-500">Monitor your store's performance and customer engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600">Total Revenue</h3>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><IndianRupee size={20}/></div>
          </div>
          <div className="text-3xl font-bold text-slate-800">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-sm font-medium text-emerald-500 mt-2 flex items-center gap-1"><ArrowUpRight size={14}/> Lifetime</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600">Total Orders</h3>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><ShoppingBag size={20}/></div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{totalOrders || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600">Registered Users</h3>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Users size={20}/></div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{totalUsers || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600">Checkout Drops</h3>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><TrendingDown size={20}/></div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{totalDrops || 0}</div>
          <div className="text-sm font-medium text-slate-400 mt-2">Tracked drops from cart</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-96 flex flex-col">
          <h3 className="font-semibold text-slate-800 mb-4">Store Visits</h3>
          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
             <div className="text-center">
               <Eye size={48} className="mx-auto text-slate-300 mb-3"/>
               <p className="text-slate-500 font-medium">Analytics tracking active.</p>
               <p className="text-sm text-slate-400">Total page views: {totalVisits || 0}</p>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-96 flex flex-col">
           <h3 className="font-semibold text-slate-800 mb-4">Recent Customers</h3>
           <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
             <div className="text-center">
               <Users size={48} className="mx-auto text-slate-300 mb-3"/>
               <p className="text-slate-500 font-medium">Customer data tracking active.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
