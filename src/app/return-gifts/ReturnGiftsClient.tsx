'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';
import { MessageCircle, Calculator, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReturnGiftsClient({ gifts }: { gifts: Product[] }) {
  const [kidsCount, setKidsCount] = useState<number | ''>(30);
  const [budget, setBudget] = useState<number | ''>(100);

  const parsedKidsCount = typeof kidsCount === 'number' ? kidsCount : 0;
  const parsedBudget = typeof budget === 'number' ? budget : 0;

  // Sort by price descending to show highest value first that fits the budget
  const eligibleGifts = gifts.filter(g => g.price <= parsedBudget).sort((a, b) => b.price - a.price);
  const bestMatch = eligibleGifts.length > 0 ? eligibleGifts[0] : null;

  const handleWhatsAppOrder = (packName: string, price: number) => {
    const total = parsedKidsCount * price;
    const text = `Hi HoneyBee Learning! 🍯\n\nI'd like to place a bulk order for Return Gifts.\n\n🎁 Pack: ${packName}\n👦 Number of kids: ${parsedKidsCount}\n💰 Expected Total: ₹${total}\n\nPlease let me know the available themes and delivery options!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918883624873?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-bg-cream min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-honey-yellow py-16 lg:py-20 mb-12 rounded-b-[3rem] shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-text-dark-brown/5 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white text-text-charcoal font-bold px-4 py-1.5 rounded-full text-sm mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-honey-amber" />
            Make Their Birthday Extra Special
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-text-dark-brown font-heading mb-6 tracking-tight leading-tight">
            Perfect Return Gifts. <br className="hidden md:block" />
            <span className="text-white drop-shadow-md">Zero Plastic. 100% Learning.</span>
          </h1>
          <p className="text-lg lg:text-xl text-text-dark-brown/80 font-medium">
            Thoughtful, personalised packs that kids actually use. 
            From ₹25 to ₹170.
          </p>
        </div>
      </div>

      {/* Budget Calculator Section */}
      <div className="container mx-auto px-4 lg:px-8 -mt-24 relative z-20 mb-20">
        <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-xl border border-honey-light max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
          
          {/* Inputs */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-honey-light flex items-center justify-center">
                <Calculator className="w-6 h-6 text-honey-amber" />
              </div>
              <h2 className="text-2xl font-extrabold text-text-dark-brown font-heading">Find Your Pack</h2>
            </div>

            <div className="space-y-6 bg-bg-cream/50 p-6 rounded-3xl border border-honey-light/50">
              <div>
                <label className="block text-text-charcoal font-bold mb-3 text-sm uppercase tracking-wider">Number of Kids</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-2xl">👦</span>
                  <input 
                    type="number" 
                    value={kidsCount}
                    onChange={(e) => setKidsCount(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full bg-white border border-honey-light/80 rounded-2xl pl-12 pr-4 py-4 text-xl font-bold text-text-dark-brown focus:outline-none focus:ring-4 focus:ring-honey-yellow/20 focus:border-honey-yellow transition-all shadow-sm"
                    min="10"
                    placeholder="e.g. 30"
                  />
                </div>
                <p className="text-xs font-bold text-text-slate mt-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-peach"></span> Minimum order: 10 sets
                </p>
              </div>
              
              <div>
                <label className="block text-text-charcoal font-bold mb-3 text-sm uppercase tracking-wider">Budget per Child (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-text-slate font-bold text-xl">₹</span>
                  <input 
                    type="number" 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full bg-white border border-honey-light/80 rounded-2xl pl-10 pr-4 py-4 text-xl font-bold text-text-dark-brown focus:outline-none focus:ring-4 focus:ring-honey-yellow/20 focus:border-honey-yellow transition-all shadow-sm"
                    min="25"
                    step="5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Result */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {parsedKidsCount < 10 ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full bg-accent-peach/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-accent-peach/50"
                >
                  <span className="text-5xl mb-4">⚠️</span>
                  <h3 className="font-heading font-bold text-xl text-text-dark-brown mb-2">Almost there</h3>
                  <p className="text-text-slate font-medium">Please enter at least 10 kids for a bulk return gift recommendation.</p>
                </motion.div>
              ) : bestMatch ? (
                <motion.div 
                  key="match"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full bg-gradient-to-br from-honey-light/40 to-white rounded-3xl p-8 flex flex-col border border-honey-light relative overflow-hidden shadow-sm"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                  
                  <div className="inline-flex w-fit items-center gap-1 text-xs font-black text-honey-amber uppercase tracking-wider mb-4 bg-white px-3 py-1 rounded-full shadow-sm">
                    <Sparkles className="w-3 h-3" /> Best Value Match
                  </div>
                  
                  <h3 className="text-3xl font-extrabold text-text-dark-brown font-heading mb-2 leading-tight">
                    {bestMatch.fallbackEmoji} {bestMatch.title}
                  </h3>
                  
                  <div className="flex items-baseline gap-2 mb-6 border-b border-honey-light/50 pb-6">
                    <span className="text-5xl font-black text-honey-amber tracking-tight">₹{parsedKidsCount * bestMatch.price}</span>
                    <span className="text-text-slate font-bold">for {parsedKidsCount} kids</span>
                  </div>
                  
                  <div className="space-y-3 mb-8 flex-grow">
                    {bestMatch.shortDesc?.split(', ').map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-text-charcoal font-medium">
                        <div className="w-5 h-5 rounded-full bg-accent-mint flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-text-dark-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => handleWhatsAppOrder(bestMatch.title, bestMatch.price)}
                    className="w-full gap-2 shadow-lg shadow-honey-yellow/20"
                  >
                    Order on WhatsApp <MessageCircle className="w-5 h-5" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="nomatch"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full bg-slate-50 rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-slate-200"
                >
                  <span className="text-5xl mb-4 block">🤷‍♀️</span>
                  <h3 className="font-heading font-bold text-xl text-text-dark-brown mb-2">No packs found</h3>
                  <p className="text-text-slate font-medium">We don't have any packs under ₹{parsedBudget}.</p>
                  <p className="text-sm font-bold text-honey-amber mt-2">Packs start from ₹25.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* All Combos Grid */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-text-dark-brown font-heading mb-3">Browse All Packs</h2>
            <p className="text-text-slate font-medium text-lg">We have something for every budget.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {gifts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
