'use client';

import { useCart } from '@/lib/CartContext';
import { ProductImage } from '@/components/ui/ProductImage';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotalPrice, discountAmount, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-text-dark-brown/40 backdrop-blur-sm z-[100]" 
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col border-l border-honey-light/50"
          >
            {/* Header */}
            <div className="p-6 border-b border-honey-light/30 flex items-center justify-between bg-bg-cream">
              <h2 className="text-2xl font-extrabold text-text-dark-brown flex items-center gap-3 font-heading">
                <div className="w-10 h-10 rounded-full bg-honey-light flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-honey-amber" />
                </div>
                Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-honey-light/50 text-text-slate transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Step Indicator (Visual only for Cart step) */}
            <div className="bg-white px-6 py-4 border-b border-honey-light/30">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-text-slate">
                <span className="text-honey-amber flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-honey-yellow text-white flex items-center justify-center">1</span> Cart</span>
                <span className="opacity-30">-------------</span>
                <span className="flex items-center gap-1 opacity-50"><span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">2</span> Details</span>
                <span className="opacity-30">-------------</span>
                <span className="flex items-center gap-1 opacity-50"><span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">3</span> Pay</span>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-white">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-slate text-center">
                  <span className="text-7xl mb-6">🍯</span>
                  <p className="text-2xl font-extrabold text-text-dark-brown mb-2 font-heading">Your cart is empty</p>
                  <p className="mb-8">Looks like you haven't added any magic yet.</p>
                  <Button 
                    onClick={() => setIsCartOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 border border-honey-light/50 rounded-2xl bg-bg-cream/50">
                    <div className="w-24 h-24 flex-shrink-0">
                      <ProductImage 
                        src={item.image} 
                        alt={item.title} 
                        variant="thumbnail"
                      />
                    </div>
                    
                    <div className="flex-grow flex flex-col">
                      <h4 className="font-bold text-text-dark-brown leading-tight font-heading">{item.title}</h4>
                      
                      {item.childName && (
                        <p className="text-sm text-honey-amber font-bold mt-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {item.childName}
                        </p>
                      )}
                      
                      {item.isReturnGift && (
                        <p className="text-[10px] bg-accent-lavender/30 text-text-dark-brown inline-block px-2 py-0.5 rounded-full mt-2 uppercase tracking-wider font-bold w-fit">
                          Return Gift Pack
                        </p>
                      )}

                      <div className="mt-auto flex items-end justify-between pt-3">
                        <div className="flex items-center gap-2 bg-white border border-honey-light/80 rounded-full px-1 py-1 shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-text-slate hover:bg-honey-light/50 hover:text-text-dark-brown transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-text-charcoal text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-text-slate hover:bg-honey-light/50 hover:text-text-dark-brown transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="text-right flex flex-col items-end">
                          <div className="font-extrabold text-lg text-text-charcoal">₹{item.price * item.quantity}</div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-400 flex items-center gap-1 font-bold mt-1 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-honey-light/50 bg-bg-cream rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-10">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-text-slate font-medium">
                    <span>Subtotal</span>
                    <span>₹{subtotalPrice}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-accent-mint font-bold bg-accent-mint/10 p-3 rounded-xl border border-accent-mint/30">
                      <span className="flex items-center gap-2"><Sparkles className="w-4 h-4"/> Sibling Discount (10%)</span>
                      <span>- ₹{discountAmount}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t border-honey-light/50">
                    <span className="text-text-dark-brown font-extrabold text-lg font-heading">Total</span>
                    <span className="text-3xl font-black text-text-charcoal">₹{totalPrice}</span>
                  </div>
                </div>
                
                <Link 
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" size="lg" className="w-full flex justify-between items-center">
                    <span>Proceed to Checkout</span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-center text-xs text-text-slate mt-4 font-medium flex items-center justify-center gap-1">
                  Secure Checkout <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
