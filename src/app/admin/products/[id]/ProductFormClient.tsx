
'use client';
import { useState } from 'react';
import { createProductAdmin, updateProductAdmin } from '../actions';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Loader2, Plus, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductFormClient({ initialData, isEdit }: { initialData: any, isEdit: boolean }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    full_description: initialData?.full_description || '',
    price: initialData?.price || 0,
    type: initialData?.type || 'activity',
    is_active: initialData?.is_active ?? true,
    image_url: initialData?.image_url || '',
    images: initialData?.images || [],
    tags: initialData?.tags || [],
    keywords: initialData?.keywords || [],
    metadata: initialData?.metadata || {}
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  // UI States for array inputs
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newMetaKey, setNewMetaKey] = useState('');
  const [newMetaValue, setNewMetaValue] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    try {
      setUploading(true);
      setError('');
      
      if (!e.target.files || e.target.files.length === 0) return;

      const files = Array.from(e.target.files);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }

      if (isGallery) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      } else {
        setFormData(prev => ({ ...prev, image_url: uploadedUrls[0] }));
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeArrayItem = (field: 'images' | 'tags' | 'keywords', index: number) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'tags' | 'keywords', value: string, setter: any) => {
    if (!value.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setter('');
  };

  const addMetadata = () => {
    if (!newMetaKey.trim()) return;
    setFormData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [newMetaKey.trim()]: newMetaValue }
    }));
    setNewMetaKey('');
    setNewMetaValue('');
  };

  const removeMetadata = (key: string) => {
    setFormData(prev => {
      const newMeta = { ...prev.metadata };
      delete newMeta[key];
      return { ...prev, metadata: newMeta };
    });
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
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹) *</label>
                <input type="number" required min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="activity">Activity Kits</option>
                  <option value="stories">Divine Stories</option>
                  <option value="return-gift">Return Gifts</option>
                  <option value="reusable">Reusable Books</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Description</label>
              <textarea rows={6} value={formData.full_description} onChange={e => setFormData({...formData, full_description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-y" />
            </div>
            
            {/* Tags & Keywords */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('tags', newTag, setNewTag))} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Add tag..." />
                    <button type="button" onClick={() => addArrayItem('tags', newTag, setNewTag)} className="p-2 bg-slate-100 rounded-lg"><Plus size={16}/></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs flex items-center gap-1">
                        {tag} <X size={12} className="cursor-pointer" onClick={() => removeArrayItem('tags', i)}/>
                      </span>
                    ))}
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Keywords</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('keywords', newKeyword, setNewKeyword))} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Add keyword..." />
                    <button type="button" onClick={() => addArrayItem('keywords', newKeyword, setNewKeyword)} className="p-2 bg-slate-100 rounded-lg"><Plus size={16}/></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs flex items-center gap-1">
                        {kw} <X size={12} className="cursor-pointer" onClick={() => removeArrayItem('keywords', i)}/>
                      </span>
                    ))}
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 text-amber-500 rounded border-slate-300 focus:ring-amber-500" />
              <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 cursor-pointer">
                Product is Active (Visible on Storefront)
              </label>
            </div>
          </div>

          <div className="space-y-6">
             <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Image</label>
             {formData.image_url ? (
               <div className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50 aspect-video flex items-center justify-center h-48">
                 <img src={formData.image_url} className="max-w-full max-h-full object-contain" />
                 <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                   <button type="button" onClick={() => setFormData({...formData, image_url: ''})} className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold"><X size={16} className="inline mr-1"/> Remove</button>
                 </div>
               </div>
             ) : (
               <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 relative h-48">
                 {uploading ? <Loader2 className="animate-spin text-amber-500"/> : <Upload size={24} className="text-slate-400 mb-2" />}
                 <input type="file" accept="image/*" onChange={(e) => handleUpload(e, false)} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
               </div>
             )}

             <label className="block text-sm font-semibold text-slate-700 mb-2">Gallery Images</label>
             <div className="grid grid-cols-3 gap-4">
                {formData.images.map((url: string, i: number) => (
                  <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 group bg-slate-50 aspect-square flex items-center justify-center">
                    <img src={url} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeArrayItem('images', i)} className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100"><X size={14}/></button>
                  </div>
                ))}
                <div className="border-2 border-dashed border-slate-200 rounded-lg aspect-square flex items-center justify-center relative hover:bg-slate-50">
                  <Plus className="text-slate-400" />
                  <input type="file" multiple accept="image/*" onChange={(e) => handleUpload(e, true)} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
             </div>

             <div className="pt-4 border-t border-slate-200">
               <label className="block text-sm font-semibold text-slate-700 mb-2">Extra Metadata (JSONB)</label>
               <p className="text-xs text-slate-500 mb-4">Add custom fields like godCharacter, badge, or lesson here.</p>
               
               <div className="space-y-2 mb-4">
                 {Object.entries(formData.metadata).map(([key, value]) => (
                   <div key={key} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100 text-sm">
                     <span className="font-semibold text-slate-700 w-1/3 truncate">{key}</span>
                     <span className="text-slate-600 w-1/2 truncate">{String(value)}</span>
                     <button type="button" onClick={() => removeMetadata(key)} className="text-red-400 hover:text-red-600 p-1"><X size={14}/></button>
                   </div>
                 ))}
               </div>

               <div className="flex gap-2">
                 <input type="text" value={newMetaKey} onChange={e => setNewMetaKey(e.target.value)} placeholder="Key (e.g. badge)" className="w-1/3 p-2 border border-slate-200 rounded-lg text-sm" />
                 <input type="text" value={newMetaValue} onChange={e => setNewMetaValue(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addMetadata())} placeholder="Value (e.g. Best Seller)" className="flex-1 p-2 border border-slate-200 rounded-lg text-sm" />
                 <button type="button" onClick={addMetadata} className="p-2 bg-slate-900 text-white rounded-lg"><Plus size={16}/></button>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
        <Link href="/admin/products" className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</Link>
        <button type="submit" disabled={loading || uploading} className="px-8 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
