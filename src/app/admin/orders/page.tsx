import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Very basic authorization check. In production, check role in profiles table.
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    redirect('/my-orders'); 
  }

  // Fetch real orders from database
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total_amount,
      notes,
      age_group,
      created_at,
      profiles (
        full_name,
        email,
        account_type
      ),
      order_modification_requests (
        id
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐝</span>
          <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:inline-block">{user?.email}</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
            <a href="/api/admin/orders/export" className="inline-flex bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-slate-500 text-sm border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Type</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Amount</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order: any) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{order.order_number}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{(order.profiles as any)?.full_name || 'Guest'}</div>
                      <div className="text-xs text-slate-500">{(order.profiles as any)?.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        (order.profiles as any)?.account_type === 'school_wholesale' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {(order.profiles as any)?.account_type?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      {order.notes && (
                        <div className="text-xs font-bold text-slate-500 mt-1">📝 Has Notes</div>
                      )}
                      {order.order_modification_requests.length > 0 && (
                        <div className="text-xs font-bold text-red-500 mt-1">Mods: {order.order_modification_requests.length}</div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-800">₹{order.total_amount}</td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
                {!orders?.length && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No orders found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
