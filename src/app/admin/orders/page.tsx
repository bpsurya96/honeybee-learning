
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    redirect('/my-orders'); 
  }

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Recent Orders</h1>
          <p className="text-slate-500">Manage customer orders and modifications.</p>
        </div>
        <a href="/api/admin/orders/export" className="inline-flex bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </a>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600">Order ID</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Customer</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Type</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Amount</th>
                <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{order.order_number}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{(order.profiles as any)?.full_name || 'Guest'}</div>
                    <div className="text-xs text-slate-500">{(order.profiles as any)?.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ${
                      (order.profiles as any)?.account_type === 'school_wholesale' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {(order.profiles as any)?.account_type?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 uppercase tracking-wider">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    {order.notes && (
                      <div className="text-xs font-medium text-slate-500 mt-2">📝 Has Notes</div>
                    )}
                    {order.order_modification_requests.length > 0 && (
                      <div className="text-xs font-bold text-red-500 mt-1">Mods: {order.order_modification_requests.length}</div>
                    )}
                  </td>
                  <td className="p-4 font-bold text-slate-800">₹{order.total_amount}</td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
    </div>
  );
}
