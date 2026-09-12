'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function AdminPdfUploadClient({ orderId, orderItemId, currentVersion, currentStatus }: { orderId: string, orderItemId: string, currentVersion: number, currentStatus: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setMessage('');
    
    const supabase = createClient();
    
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `order_${orderId}_v${currentVersion + 1}_${Date.now()}.${fileExt}`;
      const filePath = `${orderId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('order-files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;

      // 2. Mark older files as superseded (optional depending on exact requirements, but good practice)
      await supabase
        .from('order_files')
        .update({ status: 'superseded' })
        .eq('order_id', orderId)
        .eq('status', 'available');

      // 3. Insert record into order_files
      const { error: dbError } = await supabase
        .from('order_files')
        .insert({
          order_id: orderId,
          order_item_id: orderItemId,
          storage_path: filePath,
          file_name: file.name,
          version: currentVersion + 1,
          status: 'available'
        });

      if (dbError) throw dbError;

      // 4. Update order status to awaiting_customer_approval
      await supabase
        .from('orders')
        .update({ status: 'awaiting_customer_approval' })
        .eq('id', orderId);

      // 5. Update modification request status if it was in progress (simplistic logic)
      if (currentStatus === 'modification_requested') {
        await supabase
          .from('order_modification_requests')
          .update({ status: 'completed', admin_response: 'Revised PDF uploaded.' })
          .eq('order_id', orderId)
          .eq('status', 'requested'); // or in_progress
      }

      // 6. Log activity
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('order_activity').insert({
        order_id: orderId,
        user_id: user?.id,
        actor_type: 'admin',
        action: 'EBOOK_UPLOADED',
        description: `Admin uploaded PDF version ${currentVersion + 1}.`
      });

      setMessage('File uploaded successfully!');
      setFile(null);
      router.refresh();
      
    } catch (err: any) {
      setMessage(err.message || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 border-2 border-dashed border-slate-200 rounded-xl text-center">
      <form onSubmit={handleUpload}>
        <div className="mb-4">
          <input 
            type="file" 
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-amber-600 cursor-pointer"
          />
        </div>
        
        {message && (
          <div className={`mb-4 text-sm font-bold ${message.includes('successfully') ? 'text-emerald-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={!file || loading}
          className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold text-sm disabled:opacity-50 hover:bg-slate-700 transition-colors"
        >
          {loading ? 'Uploading...' : 'Upload & Notify Customer'}
        </button>
      </form>
    </div>
  );
}
