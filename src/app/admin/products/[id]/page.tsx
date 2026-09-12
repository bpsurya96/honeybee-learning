
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProductFormClient from './ProductFormClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AdminProductEditPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/my-orders'); 

  const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single();

  if (!product) {
    redirect('/admin/products');
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm">
        <ArrowLeft size={16} />
        Back to Products
      </Link>
      
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Edit Product</h1>
        <p className="text-slate-500">Update details for {product.title}</p>
      </div>
      
      <ProductFormClient initialData={product} isEdit={true} />
    </div>
  );
}
