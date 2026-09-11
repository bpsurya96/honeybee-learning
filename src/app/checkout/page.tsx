'use client';

import { useCart } from '@/lib/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const { items, subtotalPrice, discountAmount, totalPrice, totalItems, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isCartOpen) setIsCartOpen(false);
  }, [isCartOpen, setIsCartOpen]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <span className="text-6xl mb-4 block">🍯</span>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Your cart is empty</h1>
        <p className="text-slate-600 mb-8">Let's find some amazing personalised activities for your little one!</p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleOnlineCheckout = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalPrice,
          customerPhone: phone
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.url) {
        // Redirect to PhonePe payment page
        window.location.href = data.url;
      } else {
        alert("Payment initialization failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Secure Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Order Items</h2>
            
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{item.title}</h3>
                    <div className="text-sm text-slate-500 mt-1">Qty: {item.quantity} x ₹{item.price}</div>
                    {item.childName && (
                      <div className="text-sm font-bold text-primary mt-1">Name: {item.childName}</div>
                    )}
                  </div>
                  <div className="font-bold text-slate-800">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Contact Information</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary"
              />
              <p className="text-xs text-slate-500 mt-2">We need this to send your order confirmation and tracking details.</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Order Total</h2>
            
            <div className="flex justify-between items-center mb-4 text-slate-600">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{subtotalPrice}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between items-center mb-4 text-emerald-600 font-bold">
                <span>Sibling Discount</span>
                <span>- ₹{discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between items-center mb-6 text-slate-600">
              <span>Shipping</span>
              <span className="text-slate-500 italic">Free</span>
            </div>
            
            <div className="flex justify-between items-center mb-8 border-t pt-4">
              <span className="font-bold text-slate-800 text-lg">Total</span>
              <span className="font-bold text-primary text-3xl">₹{totalPrice}</span>
            </div>
            
            <button 
              onClick={handleOnlineCheckout}
              disabled={loading}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : 'Pay with PhonePe'}</span>
              <span>🔒</span>
            </button>
            <div className="text-center text-xs text-slate-400 mb-4 flex justify-center gap-2">
              <span>100% Secure Payments</span>
            </div>
            
            <button 
              onClick={() => router.push('/products')}
              className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-800"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
