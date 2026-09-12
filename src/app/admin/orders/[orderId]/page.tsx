import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AdminPdfUploadClient } from './AdminPdfUploadClient';

export default async function AdminOrderDetailsPage({ params }: { params: { orderId: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_status,
      total,
      created_at,
      profiles (
        full_name,
        email,
        phone,
        account_type
      ),
      order_items (
        id,
        product_name_snapshot,
        quantity,
        personalisation_data,
        order_files (
          id,
          file_name,
          version,
          status,
          created_at
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
    .single();

  if (error || !order) {
    return <div className="p-8">Order not found.</div>;
  }

  const primaryItem = order.order_items[0];
  const files = primaryItem?.order_files || [];
  const modifications = primaryItem?.order_modification_requests || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10 flex items-center gap-4">
        <Link href="/admin" className="text-slate-400 hover:text-slate-600 font-bold">← Back to Dashboard</Link>
        <h1 className="text-xl font-bold text-slate-800">Manage Order {order.order_number}</h1>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* Ebook Upload Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-800">
              Personalised Ebook Management
            </div>
            <div className="p-6">
              <AdminPdfUploadClient 
                orderId={order.id} 
                orderItemId={primaryItem?.id}
                currentVersion={files.length}
                currentStatus={order.status}
              />
              
              {files.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-3">Upload History</h4>
                  <div className="space-y-3">
                    {files.map((file: any) => (
                      <div key={file.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div>
                          <div className="font-bold text-slate-800">{file.file_name}</div>
                          <div className="text-xs text-slate-500">v{file.version} • {new Date(file.created_at).toLocaleString()}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${file.status === 'available' || file.status === 'uploaded' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                          {file.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modifications Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-800 flex justify-between items-center">
              <span>Customer Modification Requests</span>
              <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded-full text-xs">{modifications.length} / 2 used</span>
            </div>
            <div className="p-6">
              {modifications.length === 0 ? (
                <p className="text-slate-500 italic">No modifications requested by the customer.</p>
              ) : (
                <div className="space-y-6">
                  {modifications.map((mod: any) => (
                    <div key={mod.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-slate-800">Modification #{mod.modification_number}</span>
                        <span className="text-xs font-bold uppercase bg-amber-100 text-amber-700 px-2 py-1 rounded">{mod.status}</span>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg mb-4 text-amber-900 border border-amber-100">
                        {mod.request_text}
                      </div>
                      {/* Simple action to mark resolved. In a real app this would be a form to add a response. */}
                      <p className="text-xs text-slate-500">To resolve, prepare the revised PDF and upload it above. The system will automatically notify the customer.</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Customer Info</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500 block text-xs uppercase font-bold">Name</span> {(order.profiles as any)?.full_name}</p>
              <p><span className="text-slate-500 block text-xs uppercase font-bold">Email</span> {(order.profiles as any)?.email}</p>
              <p><span className="text-slate-500 block text-xs uppercase font-bold">Phone</span> {(order.profiles as any)?.phone}</p>
              <p><span className="text-slate-500 block text-xs uppercase font-bold">Account</span> <span className="uppercase">{(order.profiles as any)?.account_type?.replace('_', ' ')}</span></p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Personalisation Data</h3>
            {order.order_items.map((item: any) => (
              <div key={item.id} className="mb-4">
                <p className="font-bold text-primary mb-2 text-sm">{item.product_name_snapshot}</p>
                {item.personalisation_data ? (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                    {Object.entries(item.personalisation_data).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">{key.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-slate-800">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No data.</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
