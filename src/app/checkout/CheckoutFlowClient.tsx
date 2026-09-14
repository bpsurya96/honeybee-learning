'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';
import { Phone, CheckCircle2, MapPin, Package, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutFlowClient() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [address, setAddress] = useState({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (items.length === 0 && step !== 5) {
      router.push('/cart');
    }
  }, [items, router, step]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phone.length < 10) return setError('Enter a valid 10-digit phone number');
    
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (res.ok) setStep(2);
      else setError(data.error || 'Failed to send OTP');
    } catch (err) {
      setError('An error occurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length < 6) return setError('Enter 6-digit OTP');

    setLoading(true);
    try {
      const res = await fetch('/api/checkout/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      if (res.ok) setStep(3);
      else setError(data.error || 'Invalid OTP');
    } catch (err) {
      setError('An error occurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!address.fullName || !address.line1 || !address.city || !address.state || !address.pincode) {
      return setError('Please fill all mandatory address fields');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout/route', { // Ensure we call route.ts or just /api/checkout
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          phone,
          customer_name: address.fullName,
          shipping_address: address
        })
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        setStep(5);
        // We could redirect to a success page, but showing Step 5 is also fine
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch (err) {
      setError('An error occurred while placing your order.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 5) {
    return (
      <div className="min-h-screen bg-bg-cream flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Order Confirmed!</h2>
          <p className="text-slate-600 mb-8">Thank you for your purchase. We have sent a confirmation to your WhatsApp.</p>
          <button onClick={() => router.push('/products')} className="btn-primary w-full">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = totalPrice;

  return (
    <div className="min-h-screen bg-bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Form */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-6 lg:p-8 border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800 mb-8 font-heading">Secure Checkout</h1>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Step 1 & 2: Verification */}
            <div className={`p-6 rounded-2xl border ${step === 1 || step === 2 ? 'border-amber-400 bg-amber-50/30 shadow-inner' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step > 2 ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {step > 2 ? <CheckCircle2 size={20} /> : '1'}
                </div>
                <h3 className="text-lg font-bold text-slate-800">Phone Verification</h3>
              </div>

              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="tel" 
                      placeholder="Mobile Number" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                  </button>
                  <p className="text-xs text-center text-slate-500">We will send an OTP to verify your number. Check console logs if SMS is disabled.</p>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-sm text-slate-600">Enter the OTP sent to <strong className="text-slate-800">{phone}</strong></p>
                  <input 
                    type="text" 
                    placeholder="6-digit OTP" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none text-center tracking-[0.5em] font-bold text-lg"
                    maxLength={6}
                    required
                  />
                  <button type="submit" disabled={loading} className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : 'Verify & Continue'}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-slate-500 hover:text-slate-800">Change Phone Number</button>
                </form>
              )}
            </div>

            {/* Step 3: Address */}
            <div className={`p-6 rounded-2xl border ${step === 3 ? 'border-amber-400 bg-amber-50/30 shadow-inner' : 'border-slate-200 bg-slate-50 opacity-50'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step > 3 ? 'bg-green-500 text-white' : step === 3 ? 'bg-amber-500 text-white' : 'bg-slate-300 text-white'}`}>
                  {step > 3 ? <CheckCircle2 size={20} /> : '2'}
                </div>
                <h3 className="text-lg font-bold text-slate-800">Delivery Address</h3>
              </div>

              {step === 3 && (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
                  <input type="text" placeholder="Address Line 1 (House No, Building, Street)" required value={address.line1} onChange={(e) => setAddress({...address, line1: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
                  <input type="text" placeholder="Address Line 2 (Landmark, etc) - Optional" value={address.line2} onChange={(e) => setAddress({...address, line2: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
                    <input type="text" placeholder="State" required value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
                  </div>
                  <input type="text" placeholder="Pincode" required value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
                  
                  <div className="pt-4 border-t border-amber-200/50 mt-6">
                    <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                      {loading ? <Loader2 className="animate-spin" /> : <>Place Order (COD) <ArrowRight size={20} /></>}
                    </button>
                    <p className="text-xs text-center text-slate-500 mt-4">Payment options are currently disabled. You will pay upon delivery.</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-24 border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Package size={20} className="text-amber-500" />
              Order Summary
            </h3>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={item.image || '/images/placeholder.webp'} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                    <div className="text-sm text-slate-500 flex justify-between mt-1">
                      <span>Qty: {item.quantity}</span>
                      <span className="font-bold text-slate-800">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-800 pt-4 border-t border-slate-100">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}