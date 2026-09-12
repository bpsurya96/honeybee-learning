
'use client';
import { useState } from 'react';
import { createProductAdmin, updateProductAdmin } from '../actions';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductFormClient({ initialData, isEdit }: { initialData: any, isEdit: boolean }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    type: initialData?.type || 'Physical',
    is_active: initialData?.is_active ?? true,
    image_url: initialData?.image_url || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError('');
      
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await updateProductAdmin(initialData.id, formData);
      } else {
        await createProductAdmin(formData);
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 space-y-8">
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Title *</label>
              <input 
                type="text" 
                required
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" 
                placeholder="e.g. Advanced Robotics Kit"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹) *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.01"
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Type</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                >
                  <option value="Physical">Physical Kit</option>
                  <option value="Ebook">Digital E-Book</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea 
                rows={6}
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none" 
                placeholder="Write a detailed description..."
              />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <input 
                type="checkbox" 
                id="is_active"
                checked={formData.is_active} 
                onChange={e => setFormData({...formData, is_active: e.target.checked})} 
                className="w-5 h-5 text-amber-500 rounded border-slate-300 focus:ring-amber-500" 
              />
              <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 cursor-pointer">
                Product is Active (Visible to customers)
              </label>
            </div>
          </div>

          <div className="space-y-6">
             <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image</label>
             {formData.image_url ? (
               <div className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50 aspect-square flex items-center justify-center">
                 <img src={formData.image_url} alt="Product preview" className="max-w-full max-h-full object-contain" />
                 <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                     type="button"
                     onClick={removeImage}
                     className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold shadow-sm hover:scale-105 transition-transform flex items-center gap-2"
                   >
                     <X size={16}/> Remove
                   </button>
                 </div>
               </div>
             ) : (
               <div className="border-2 border-dashed border-slate-200 rounded-2xl aspect-square flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
                 {uploading ? (
                   <div className="text-amber-500 flex flex-col items-center">
                     <Loader2 size={32} className="animate-spin mb-2"/>
                     <span className="font-semibold text-sm">Uploading...</span>
                   </div>
                 ) : (
                   <>
                     <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-400">
                       <Upload size={24} />
                     </div>
                     <span className="font-semibold text-slate-700">Click to upload image</span>
                     <span className="text-sm text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                   </>
                 )}
                 <input 
                   type="file" 
                   accept="image/*"
                   onChange={handleImageUpload}
                   disabled={uploading}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                 />
               </div>
             )}
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
        <Link 
          href="/admin/products"
          className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
        >
          Cancel
        </Link>
        <button 
          type="submit"
          disabled={loading || uploading}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
