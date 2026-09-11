'use client';

import { useCart } from '@/lib/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotalPrice, discountAmount, totalPrice } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" 
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-amber-100 flex items-center justify-between bg-amber-50">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>🛒</span> Your Cart
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-slate-500 font-bold text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
              <span className="text-6xl mb-4">🍯</span>
              <p className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</p>
              <p className="mb-6">Looks like you haven't added anything yet.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-6">
                <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-amber-50 flex-shrink-0 border border-amber-100">
                  {item.image ? (
                    <Image 
                      src={`/${item.image}`} 
                      alt={item.title} 
                      fill 
                      sizes="96px"
                      className="object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🍯</div>
                  )}
                </div>
                
                <div className="flex-grow flex flex-col">
                  <h4 className="font-bold text-slate-800 leading-tight">{item.title}</h4>
                  
                  {item.childName && (
                    <p className="text-sm text-primary font-bold mt-1">
                      Name: {item.childName}
                    </p>
                  )}
                  
                  {item.isReturnGift && (
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">
                      Return Gift Pack
                    </p>
                  )}

                  <div className="mt-auto flex items-end justify-between pt-2">
                    <div className="flex items-center gap-3 border border-slate-200 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 font-bold"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-bold text-slate-700">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 font-bold"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg text-slate-800">₹{item.price * item.quantity}</div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 font-bold mt-1 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotalPrice}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
                  <span className="flex items-center gap-1">✨ Sibling Discount (10%)</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="text-slate-800 font-bold text-lg">Total</span>
                <span className="text-2xl font-bold text-primary">₹{totalPrice}</span>
              </div>
            </div>
            
            <Link 
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="btn-primary w-full text-center flex justify-center text-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
