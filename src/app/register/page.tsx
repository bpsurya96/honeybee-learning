'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Building2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<'individual' | 'school_wholesale' | null>(null);
  
  // Individual Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // School Fields
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('school');
  const [gst, setGst] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    const supabase = await createClient();

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone,
            account_type: accountType
          }
        }
      });

      if (error) throw error;

      // If School, insert into organisations table
      if (accountType === 'school_wholesale' && data.user) {
        const { error: orgError } = await supabase.from('organisations').insert({
          profile_id: data.user.id,
          organisation_name: orgName,
          organisation_type: orgType,
          gst_number: gst || null,
          address,
          city,
          state,
          pincode
        });

        if (orgError) {
          console.error("Org insertion error:", orgError);
          // We don't block auth success on this right now, but we should handle it gracefully in production
        }
      }

      setMessage('Check your email for the confirmation link!');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  if (!accountType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-cream py-12 px-4">
        <div className="max-w-xl w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-honey-light">
          <div className="text-center mb-10">
            <span className="text-5xl block mb-4">👋</span>
            <h2 className="text-3xl font-extrabold text-text-dark-brown font-heading mb-2">Create an Account</h2>
            <p className="text-text-slate">Who are you signing up as?</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => setAccountType('individual')}
              className="w-full flex items-center p-6 border-2 border-slate-100 rounded-3xl hover:border-honey-yellow hover:bg-honey-yellow/5 transition-all group text-left"
            >
              <div className="w-16 h-16 rounded-full bg-honey-light flex flex-shrink-0 items-center justify-center mr-6 group-hover:bg-honey-yellow group-hover:text-white transition-colors">
                <User className="w-8 h-8 text-honey-amber group-hover:text-white" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-text-dark-brown font-heading">Personal Account</h3>
                <p className="text-text-slate text-sm">For parents, individuals and everyday customers.</p>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-honey-yellow" />
            </button>
            
            <button 
              onClick={() => setAccountType('school_wholesale')}
              className="w-full flex items-center p-6 border-2 border-slate-100 rounded-3xl hover:border-honey-yellow hover:bg-honey-yellow/5 transition-all group text-left"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex flex-shrink-0 items-center justify-center mr-6 group-hover:bg-honey-yellow group-hover:text-white transition-colors">
                <Building2 className="w-8 h-8 text-slate-400 group-hover:text-white" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-text-dark-brown font-heading">School / Wholesale</h3>
                <p className="text-text-slate text-sm">For bulk orders, schools and institutions.</p>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-honey-yellow" />
            </button>
          </div>
          
          <p className="mt-8 text-center text-sm text-text-slate">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-honey-amber hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-cream py-12 px-4">
      <div className="max-w-2xl w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-honey-light">
        <button 
          onClick={() => setAccountType(null)}
          className="flex items-center text-sm font-bold text-text-slate hover:text-text-charcoal mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Account Type
        </button>
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-text-dark-brown font-heading">
            {accountType === 'individual' ? 'Create Personal Account' : 'School / Wholesale Account'}
          </h2>
          <p className="text-text-slate mt-2">Please fill in your details to register.</p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          {accountType === 'school_wholesale' && (
            <div className="space-y-6 mb-8">
              <h3 className="font-bold text-text-dark-brown text-lg border-b border-honey-light pb-2">Organisation Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-slate mb-1">Organisation Name *</label>
                  <input type="text" required value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-slate mb-1">Organisation Type *</label>
                  <select required value={orgType} onChange={e => setOrgType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow">
                    <option value="school">School / Pre-school</option>
                    <option value="corporate">Corporate</option>
                    <option value="retailer">Retailer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-slate mb-1">GST Number (Optional)</label>
                  <input type="text" value={gst} onChange={e => setGst(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-text-slate mb-1">Address *</label>
                  <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-slate mb-1">City *</label>
                  <input type="text" required value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-slate mb-1">State *</label>
                  <input type="text" required value={state} onChange={e => setState(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-slate mb-1">Pincode *</label>
                  <input type="text" required value={pincode} onChange={e => setPincode(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-bold text-text-dark-brown text-lg border-b border-honey-light pb-2">
              {accountType === 'school_wholesale' ? 'Contact Person' : 'Personal Details'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-text-slate mb-1">Full Name *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-slate mb-1">Mobile Number *</label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-text-dark-brown text-lg border-b border-honey-light pb-2">Account Details</h3>
            <div>
              <label className="block text-sm font-bold text-text-slate mb-1">Email Address *</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-text-slate mb-1">Password *</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-slate mb-1">Confirm Password *</label>
                <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow" />
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold ${message.includes('Check your email') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {message}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
