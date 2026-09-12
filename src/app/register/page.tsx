'use client';

import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Building2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function RegisterContent() {
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
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/my-orders';

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage('');
    
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/my-orders`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage(error.message || 'Error signing in with Google');
      setLoading(false);
    }
  };

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
            <p className="text-text-slate">Choose how you want to sign up.</p>
          </div>
          
          <div className="space-y-6">
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border-slate-200"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500 font-medium">Or sign up with email as</span>
              </div>
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
        </div>
          
          <p className="mt-8 text-center text-sm text-text-slate">
            Already have an account?{' '}
            <Link href={`/login?next=${next}`} className="font-bold text-honey-amber hover:underline">
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


export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-bg-cream py-12 px-4"><div className="text-center font-bold text-text-dark-brown">Loading...</div></div>}>
      <RegisterContent />
    </Suspense>
  );
}