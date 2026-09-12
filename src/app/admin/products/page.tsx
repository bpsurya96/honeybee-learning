
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit2, PackageOpen } from 'lucide-react';

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/my-orders'); 

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500">Manage your store's inventory and digital products.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="inline-flex bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm shadow-amber-500/20 transition-all items-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600 w-16">Image</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Product Details</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Type</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Price</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products?.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    {product.image_url ? (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                        <PackageOpen size={20} />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{product.title}</div>
                    <div className="text-sm text-slate-500 max-w-xs truncate">{product.description || 'No description'}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ${
                      product.type === 'Ebook' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {product.type}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-800">
                    ₹{product.price}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/products/${product.id}`}
                      className="inline-flex p-2 text-slate-400 hover:text-amber-500 transition-colors bg-white hover:bg-amber-50 rounded-lg shadow-sm border border-slate-200 hover:border-amber-200"
                    >
                      <Edit2 size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No products found. Click "Add Product" to create one.
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
