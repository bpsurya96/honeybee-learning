
'use client';
import { useState } from 'react';
import { updateUserAdmin } from '../actions';
import { Edit2, Shield, User } from 'lucide-react';

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ role: '', password: '', full_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openEdit = (user: any) => {
    setEditingUser(user);
    setFormData({ role: user.role, password: '', full_name: user.full_name || '' });
    setError('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await updateUserAdmin(editingUser.id, formData);
      setEditingUser(null);
      window.location.reload();
    } catch (e: any) {
      setError(e.message || 'Failed to update user');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Name / Email</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Account Type</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Role</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{user.full_name || 'No Name'}</div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {user.account_type?.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${
                    user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {user.role === 'admin' ? <Shield size={12}/> : <User size={12}/>}
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => openEdit(user)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors bg-white hover:bg-amber-50 rounded-lg shadow-sm border border-slate-200 hover:border-amber-200">
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Edit User</h3>
              <p className="text-sm text-slate-500">{editingUser.email}</p>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password (Leave blank to keep)</label>
                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="••••••••" />
                <p className="text-xs text-slate-400 mt-1">Requires SUPABASE_SERVICE_ROLE_KEY to be set in env.</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">Cancel</button>
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
