'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Mock Orders since we are waiting on Supabase connection
  const mockOrders = [
    { id: 'ORD-1234', date: '2026-09-11', amount: 1500, status: 'PAID', items: '2x Dino Book, 1x Space Book', names: 'ARYA, KABIR' },
    { id: 'ORD-1235', date: '2026-09-11', amount: 350, status: 'PENDING', items: '1x Unicorn Book', names: 'SARA' },
    { id: 'ORD-1236', date: '2026-09-10', amount: 2000, status: 'PAID', items: 'Return Gifts (20x)', names: 'N/A' },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If they aren't logged in, redirect to login
        router.push('/login');
      } else {
        setUser(session.user);
        // Ideally, here we would also fetch orders from Supabase DB:
        // const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        // setOrders(data);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin Panel...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐝</span>
          <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:inline-block">{user?.email}</span>
          <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:underline">
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-bold mb-2">Total Sales (Today)</h3>
            <p className="text-3xl font-bold text-slate-800">₹3,850</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-bold mb-2">Orders Pending Personalisation</h3>
            <p className="text-3xl font-bold text-amber-500">2</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-bold mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-emerald-500">4.2%</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
            <Link href="/" className="text-primary text-sm font-bold hover:underline">View Live Site</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Amount</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Items</th>
                  <th className="p-4 font-bold">Personalisation Names</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{order.id}</td>
                    <td className="p-4 text-slate-600">{order.date}</td>
                    <td className="p-4 font-bold text-slate-800">₹{order.amount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">{order.items}</td>
                    <td className="p-4 font-bold text-primary text-sm">{order.names}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
