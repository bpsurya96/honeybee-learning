'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { checkUsernameAction, completeProfileAction } from './actions';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function CompleteProfilePage() {
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Debounce username check
  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus(username.length > 0 ? 'invalid' : 'idle');
      return;
    }

    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(username)) {
      setUsernameStatus('invalid');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const isAvailable = await checkUsernameAction(username);
      setUsernameStatus(isAvailable ? 'available' : 'taken');
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usernameStatus !== 'available') return;
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      const formData = new FormData(e.currentTarget);
      await completeProfileAction(formData);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete registration');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-honey-light">
        <div className="text-center">
          <span className="text-5xl block mb-4">🚀</span>
          <h2 className="text-3xl font-extrabold text-text-dark-brown font-heading">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-text-slate">
            Just a few more details to get your account ready.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-text-slate mb-1">Account Type</label>
              <select
                name="accountType"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow bg-white"
                defaultValue="individual"
              >
                <option value="individual">Personal</option>
                <option value="school_wholesale">Organization / Wholesale</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-slate mb-1">Phone Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="flex-1 px-4 py-3 rounded-r-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow"
                  placeholder="XXXXX XXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-slate mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 pr-10
                    ${usernameStatus === 'available' ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : 
                      usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
                      'border-slate-200 focus:border-honey-yellow focus:ring-honey-yellow'}`}
                  placeholder="Enter your username"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {usernameStatus === 'checking' && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
                  {usernameStatus === 'available' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {(usernameStatus === 'taken' || usernameStatus === 'invalid') && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </div>
              <div className="mt-1 text-xs">
                {usernameStatus === 'checking' && <span className="text-slate-500">Checking availability...</span>}
                {usernameStatus === 'available' && <span className="text-green-600 font-medium">Username is available!</span>}
                {usernameStatus === 'taken' && <span className="text-red-500 font-medium">Username is already taken</span>}
                {usernameStatus === 'invalid' && <span className="text-red-500 font-medium">Use 3-20 characters (letters, numbers, _ -)</span>}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl text-sm font-bold bg-red-50 text-red-500 text-center">
              {errorMsg}
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full" 
            disabled={loading || usernameStatus !== 'available'}
          >
            {loading ? 'Completing Registration...' : 'Complete Registration'}
          </Button>
        </form>
      </div>
    </div>
  );
}
