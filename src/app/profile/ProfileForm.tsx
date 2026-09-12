'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export default function ProfileForm({ initialProfile, email }: { initialProfile: any, email: string }) {
  const [name, setName] = useState(initialProfile?.full_name || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: name,
        phone: phone,
      })
      .eq('id', initialProfile.id);

    setLoading(false);

    if (error) {
      setMessage({ text: error.message || 'Failed to update profile.', type: 'error' });
    } else {
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-bold text-text-slate mb-1">Email Address</label>
          <input
            type="email"
            disabled
            value={email}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-text-slate mb-1">Account Type</label>
          <input
            type="text"
            disabled
            value={initialProfile?.account_type?.replace('_', ' ').toUpperCase() || 'INDIVIDUAL'}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-bold"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-text-slate mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-text-slate mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e: any) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow"
          />
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
          {message.text}
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button type="submit" variant="primary" size="lg" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
