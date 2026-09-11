'use client';

import { useState } from 'react';
import { Metadata } from 'next';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    
    const message = `Hi, I would like to track my order. My Order ID / Phone Number is: ${orderId}`;
    window.open(`https://wa.me/918883624873?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-md text-center">
      <span className="text-6xl mb-6 block">📍</span>
      <h1 className="text-4xl font-bold text-slate-800 mb-4">Track Order</h1>
      <p className="text-slate-600 mb-8">
        Enter your phone number or Order ID below to get a live status update from our team.
      </p>

      <form onSubmit={handleTrack} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <input 
          type="text" 
          placeholder="e.g. 9876543210 or HB-1234"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
        />
        <button type="submit" className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2">
          <span>Get Status on WhatsApp</span>
          <span>💬</span>
        </button>
      </form>
    </div>
  );
}
