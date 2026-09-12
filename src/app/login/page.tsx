'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push('/my-orders'); // Route directly to My Orders after login
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-honey-light">
        <div className="text-center">
          <span className="text-5xl block mb-4">🍯</span>
          <h2 className="text-3xl font-extrabold text-text-dark-brown font-heading">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-text-slate">
            Sign in to track your orders and personalised books.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-text-slate mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-text-slate">Password</label>
                <a href="#" className="text-xs font-bold text-honey-amber hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className="p-4 rounded-xl text-sm font-bold bg-red-50 text-red-500 text-center">
              {message}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <p className="text-center text-sm text-text-slate font-medium">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-honey-amber hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
