
'use client';
import { useState } from 'react';
import { updateOrganisationAdmin } from '../actions';
import { Edit2, Building } from 'lucide-react';

export default function OrgsClient({ initialOrgs }: { initialOrgs: any[] }) {
  const [editingOrg, setEditingOrg] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    organisation_name: '', 
    gst_number: '', 
    address: '', 
    city: '', 
    state: '', 
    pincode: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openEdit = (org: any) => {
    setEditingOrg(org);
    setFormData({ 
      organisation_name: org.organisation_name || '', 
      gst_number: org.gst_number || '', 
      address: org.address || '', 
      city: org.city || '', 
      state: org.state || '', 
      pincode: org.pincode || '' 
    });
    setError('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await updateOrganisationAdmin(editingOrg.id, formData);
      setEditingOrg(null);
      window.location.reload();
    } catch (e: any) {
      setError(e.message || 'Failed to update organisation');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Organisation Name</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Type / GST</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Primary Contact</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialOrgs.map(org => (
              <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <Building size={16} className="text-slate-400"/>
                    {org.organisation_name}
                  </div>
                  <div className="text-sm text-slate-500">{org.city}, {org.state}</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 uppercase">
                    {org.organisation_type?.replace('_', ' ')}
                  </span>
                  <div className="text-xs text-slate-500 mt-1 font-mono">{org.gst_number || 'N/A'}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-slate-800 font-medium">{org.profiles?.full_name}</div>
                  <div className="text-xs text-slate-500">{org.profiles?.email}</div>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => openEdit(org)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors bg-white hover:bg-amber-50 rounded-lg shadow-sm border border-slate-200 hover:border-amber-200">
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {initialOrgs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No organisations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingOrg && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Edit Organisation</h3>
              <p className="text-sm text-slate-500">{editingOrg.organisation_name}</p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {error && <div className="col-span-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Organisation Name</label>
                <input type="text" value={formData.organisation_name} onChange={e => setFormData({...formData, organisation_name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">GST Number</label>
                <input type="text" value={formData.gst_number} onChange={e => setFormData({...formData, gst_number: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                <input type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={() => setEditingOrg(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
