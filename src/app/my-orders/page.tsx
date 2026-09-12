import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const metadata = {
  title: 'My Orders | HoneyBee Learning',
};

// Helper function to render status badge
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
    case 'processing':
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200"><Clock className="w-3 h-3"/> {status.toUpperCase()}</span>;
    case 'ebook_ready':
    case 'awaiting_customer_approval':
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-honey-yellow/20 text-honey-amber border border-honey-yellow/30"><AlertCircle className="w-3 h-3"/> AWAITING APPROVAL</span>;
    case 'modification_requested':
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-accent-lavender/30 text-indigo-600 border border-indigo-200"><Clock className="w-3 h-3"/> MODIFICATION REQUESTED</span>;
    case 'approved':
    case 'completed':
    case 'shipped':
    case 'delivered':
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-accent-mint/30 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3"/> {status.toUpperCase()}</span>;
    default:
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">{status.toUpperCase()}</span>;
  }
};

export default async function MyOrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch orders for the logged in user
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total,
      created_at,
      order_items (
        id,
        product_name_snapshot,
        quantity,
        total
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-text-dark-brown font-heading mb-2">My Orders</h1>
          <p className="text-lg text-text-slate">View your orders, personalised books and approval requests.</p>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-honey-light/50">
            <span className="text-6xl block mb-6">📚</span>
            <h2 className="text-2xl font-bold text-text-dark-brown font-heading mb-3">No books yet!</h2>
            <p className="text-text-slate mb-8 max-w-sm mx-auto">Your personalised learning journey starts here. Explore our collection of activities.</p>
            <Link href="/products" className="inline-block bg-honey-yellow hover:bg-honey-amber text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-honey-yellow/20 transition-all hover:-translate-y-1">
              Explore Books
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-honey-light/50 hover:shadow-md transition-shadow group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-text-dark-brown text-lg font-heading">Order {order.order_number}</h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-text-slate">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-text-slate mb-1">Total Amount</p>
                    <p className="font-extrabold text-xl text-text-charcoal">₹{order.total}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                      <div className="w-12 h-12 rounded-xl bg-honey-light flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-honey-amber" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-text-dark-brown leading-tight">{item.product_name_snapshot}</p>
                        <p className="text-sm text-text-slate">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Link 
                    href={`/my-orders/${order.id}`}
                    className="flex items-center gap-2 text-honey-amber font-bold hover:text-honey-yellow transition-colors bg-honey-yellow/10 px-6 py-3 rounded-xl group-hover:bg-honey-yellow group-hover:text-white"
                  >
                    View Order Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
