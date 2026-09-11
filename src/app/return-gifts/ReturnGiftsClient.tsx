'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ui/ProductCard';

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
    <div className="container mx-auto px-4 py-12">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 tracking-tight">
          Perfect Return Gifts. <br />
          <span className="text-primary">Zero Plastic. 100% Learning.</span>
        </h1>
        <p className="text-lg text-slate-600">
          Thoughtful, personalised, and ready-to-gift packs that kids actually use. 
          Use our calculator below to find the perfect combo for your party!
        </p>
      </div>

      {/* Budget Calculator */}
      <div className="bg-amber-50 rounded-3xl p-8 mb-20 shadow-sm border border-amber-100 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🧮</span>
          <h2 className="text-2xl font-bold text-slate-800">Return Gift Calculator</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-slate-700 font-bold mb-2">Number of Kids</label>
              <input 
                type="number" 
                value={kidsCount}
                onChange={(e) => setKidsCount(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="10"
                placeholder="e.g. 30"
              />
              <p className="text-sm text-slate-500 mt-2">Minimum order is 10 sets.</p>
            </div>
            
            <div>
              <label className="block text-slate-700 font-bold mb-2">Budget per Child (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 text-lg">₹</span>
                <input 
                  type="number" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="25"
                  step="5"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-center">
            {parsedKidsCount < 10 ? (
              <div className="text-center text-amber-600 font-medium">
                Please enter at least 10 kids for a bulk order recommendation.
              </div>
            ) : bestMatch ? (
              <>
                <div className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-2">✨ Best Match</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{bestMatch.fallbackEmoji} {bestMatch.title}</h3>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-4xl font-bold text-primary">₹{parsedKidsCount * bestMatch.price}</span>
                  <span className="text-slate-500 mb-1">total for {parsedKidsCount} kids</span>
                </div>
                <div className="space-y-2 mb-8">
                  {bestMatch.shortDesc?.split(', ').map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-600">
                      <span className="text-emerald-500">✓</span> {item}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleWhatsAppOrder(bestMatch.title, bestMatch.price)}
                  className="btn-primary w-full text-center flex items-center justify-center gap-2 text-lg"
                >
                  <span>Order on WhatsApp</span>
                  <span className="text-xl">💬</span>
                </button>
              </>
            ) : (
              <div className="text-center text-slate-500">
                <span className="text-4xl block mb-4">🤷‍♀️</span>
                <p>We don't have any packs under ₹{parsedBudget}.</p>
                <p className="text-sm mt-2">Packs start from ₹25.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Combos Grid */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Browse All Return Gift Packs</h2>
        <p className="text-slate-600 mb-8">From ₹25 to ₹170. We have something for every budget.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gifts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
