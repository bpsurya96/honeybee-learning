import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, FileText, Settings, History } from 'lucide-react';
import { OrderActionsClient } from './OrderActionsClient';

export default async function OrderDetailsPage({ params }: { params: { orderId: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch complete order details
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_status,
      total,
      created_at,
      order_items (
        id,
        product_name_snapshot,
        quantity,
        total,
        personalisation_data,
        order_files (
          id,
          file_name,
          version,
          status,
          storage_path
        ),
        order_modification_requests (
          id,
          modification_number,
          request_text,
          status,
          admin_response,
          created_at
        )
      )
    `)
    .eq('id', params.orderId)
    .eq('user_id', user.id)
    .single();

  if (error || !order) {
    return (
      <div className="min-h-screen bg-bg-cream flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
          <span className="text-4xl block mb-4">🤷‍♀️</span>
          <h2 className="text-2xl font-bold text-text-dark-brown">Order not found</h2>
          <p className="text-text-slate mb-6">We couldn't find the order you're looking for.</p>
          <Link href="/my-orders" className="text-honey-amber font-bold hover:underline">Return to My Orders</Link>
        </div>
      </div>
    );
  }

  const primaryItem = order.order_items[0]; // Assuming 1 primary custom item for simplicity in UI, extendable later
  const currentFile = primaryItem?.order_files?.find((f: any) => f.status === 'available' || f.status === 'uploaded');
  const modifications = primaryItem?.order_modification_requests || [];
  
  // Generate signed URL if file exists
  let signedUrl = null;
  if (currentFile) {
    const { data: urlData } = await supabase.storage.from('order-files').createSignedUrl(currentFile.storage_path, 3600);
    signedUrl = urlData?.signedUrl;
  }

  const MAX_MODIFICATIONS = 2;

  return (
    <div className="min-h-screen bg-bg-cream pb-20">
      <div className="bg-white border-b border-honey-light/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/my-orders" className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-text-slate transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-extrabold text-text-dark-brown font-heading">Order {order.order_number}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Actions & Progress */}
        <div className="flex-1 space-y-8">
          <OrderActionsClient 
            orderId={order.id}
            orderItemId={primaryItem.id}
            modificationCount={modifications.length}
            maxModifications={MAX_MODIFICATIONS}
            pdfUrl={signedUrl}
            status={order.status}
          />
          
          {/* Modification History */}
          {modifications.length > 0 && (
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-honey-light/50">
              <h3 className="text-xl font-bold text-text-dark-brown font-heading mb-6 flex items-center gap-2">
                <History className="w-5 h-5 text-honey-amber" /> Modification History
              </h3>
              <div className="space-y-6">
                {modifications.map((mod: any) => (
                  <div key={mod.id} className="relative pl-6 border-l-2 border-honey-yellow/30">
                    <span className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-bg-cream border-2 border-honey-yellow"></span>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-text-dark-brown text-sm">Modification #{mod.modification_number}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                        mod.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {mod.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-charcoal italic bg-slate-50 p-3 rounded-xl mb-2">"{mod.request_text}"</p>
                    {mod.admin_response && (
                      <div className="bg-honey-yellow/10 p-3 rounded-xl border border-honey-yellow/20">
                        <p className="text-xs font-bold text-honey-amber mb-1">HoneyBee Team:</p>
                        <p className="text-sm text-text-dark-brown">{mod.admin_response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Info */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-honey-light/50">
            <h3 className="font-bold text-text-dark-brown font-heading mb-4 text-lg border-b border-slate-100 pb-2">Order Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-slate">Status</span>
                <span className="font-bold text-text-charcoal capitalize">{order.status.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-slate">Date</span>
                <span className="font-bold text-text-charcoal">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-slate">Payment</span>
                <span className="font-bold text-emerald-600 capitalize">{order.payment_status}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100">
                <span className="text-text-slate font-bold">Total Amount</span>
                <span className="font-extrabold text-lg text-text-dark-brown">₹{order.total}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-honey-light/50">
            <h3 className="font-bold text-text-dark-brown font-heading mb-4 text-lg border-b border-slate-100 pb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-honey-amber" /> Personalisation Data
            </h3>
            {order.order_items.map((item: any) => (
              <div key={item.id} className="mb-4 last:mb-0">
                <p className="font-bold text-text-charcoal mb-2">{item.product_name_snapshot}</p>
                {item.personalisation_data ? (
                  <div className="space-y-2 bg-bg-cream p-3 rounded-xl border border-honey-light/50">
                    {Object.entries(item.personalisation_data).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-xs text-text-slate uppercase tracking-wider block mb-0.5">{key.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-bold text-text-dark-brown">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-slate italic">No personalisation data provided.</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
