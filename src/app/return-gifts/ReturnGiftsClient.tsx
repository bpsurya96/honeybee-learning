'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';
import { MessageCircle, Calculator, Sparkles, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReturnGiftsClient({ gifts }: { gifts: Product[] }) {
  const [kidsCount, setKidsCount] = useState<number | ''>(30);
  const [budget, setBudget] = useState<number | ''>(100);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [childName, setChildName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [candyPreference, setCandyPreference] = useState('Chocolate');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedKidsCount = typeof kidsCount === 'number' ? kidsCount : 0;
  const parsedBudget = typeof budget === 'number' ? budget : 0;

  // Sort by price descending to show highest value first that fits the budget
  const eligibleGifts = gifts.filter(g => g.price <= parsedBudget).sort((a, b) => b.price - a.price);
  const bestMatch = eligibleGifts.length > 0 ? eligibleGifts[0] : null;

  const openEnquiryModal = () => {
    setIsModalOpen(true);
  };

  const submitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!bestMatch) return;
    
    const total = parsedKidsCount * bestMatch.price;
    const enquiryData = {
      buyerName,
      whatsappNumber,
      childName,
      ageGroup,
      candyPreference,
      deliveryDate,
      specialNotes,
      kidsCount: parsedKidsCount,
      budget: parsedBudget,
      packName: bestMatch.title,
      totalExpected: total
    };

    try {
      // Save to Supabase (in the background)
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData)
      });
    } catch (err) {
      console.error('Failed to save enquiry, proceeding to WhatsApp', err);
    }
    
    // Redirect to WhatsApp
    const text = `Hi HoneyBee Learning! 🍯\n\nI'd like to place a bulk order for Return Gifts.\n\n📦 Pack: ${bestMatch.title}\n👦 Child's Name: ${childName}\n🎂 Age Group: ${ageGroup}\n🍬 Candy: ${candyPreference}\n📅 Delivery Needed: ${deliveryDate}\n👥 Number of kids: ${parsedKidsCount}\n💰 Expected Total: ₹${total}\n📝 Notes: ${specialNotes || 'None'}\n\nName: ${buyerName}\nWhatsApp: ${whatsappNumber}`;
    
    const encoded = encodeURIComponent(text);
    setIsSubmitting(false);
    setIsModalOpen(false);

    // Fire Confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444'],
      zIndex: 100
    });

    // Wait a bit before redirecting so they see the confetti
    setTimeout(() => {
      window.open('https://wa.me/918883624873?text=' + encoded, '_blank');
    }, 1000);
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
                    onClick={openEnquiryModal}
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
                  <p className="text-text-slate font-medium">We don&apos;t have any packs under ₹{parsedBudget}.</p>
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

      {/* Enquiry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-text-dark-brown/60 backdrop-blur-sm z-50"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed inset-x-4 top-[5%] md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-[10%] md:w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-text-dark-brown">Send Enquiry</h3>
                  <p className="text-sm text-text-slate font-medium">Fill in the details — we&apos;ll personalise it just for you!</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={submitEnquiry} className="p-6 space-y-6">
                <div className="bg-honey-yellow/10 rounded-2xl p-4 border border-honey-yellow/30 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-honey-amber uppercase tracking-wider mb-1">Selected Combo</div>
                    <div className="font-heading font-bold text-lg text-text-dark-brown">{bestMatch?.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-2xl text-text-charcoal">₹{parsedKidsCount * (bestMatch?.price || 0)}</div>
                    <div className="text-xs font-bold text-text-slate">for {parsedKidsCount} kids</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-text-slate mb-2">Your Name *</label>
                    <input required type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full bg-bg-cream border border-honey-light/80 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-honey-yellow focus:ring-2 focus:ring-honey-yellow/20" placeholder="Parent / Buyer name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-slate mb-2">WhatsApp Number *</label>
                    <input required type="tel" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full bg-bg-cream border border-honey-light/80 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-honey-yellow focus:ring-2 focus:ring-honey-yellow/20" placeholder="10-digit number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-text-slate mb-2">Birthday Child&apos;s Name *</label>
                    <input required type="text" value={childName} onChange={(e) => setChildName(e.target.value)} className="w-full bg-bg-cream border border-honey-light/80 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-honey-yellow focus:ring-2 focus:ring-honey-yellow/20" placeholder="e.g. Arjun" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-slate mb-2">Delivery Date Needed *</label>
                    <input required type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full bg-bg-cream border border-honey-light/80 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-honey-yellow focus:ring-2 focus:ring-honey-yellow/20" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-slate mb-2">Age Group of Kids *</label>
                  <select required value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="w-full bg-bg-cream border border-honey-light/80 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-honey-yellow focus:ring-2 focus:ring-honey-yellow/20 appearance-none">
                    <option value="" disabled>Select age group</option>
                    <option value="1-2 years (Toddler)">1–2 years (Toddler)</option>
                    <option value="3-5 years (Nursery/LKG)">3–5 years (Nursery/LKG)</option>
                    <option value="6-8 years (Class 1–3)">6–8 years (Class 1–3)</option>
                    <option value="9-12 years (Class 4–7)">9–12 years (Class 4–7)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-slate mb-3">Candy Preference *</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setCandyPreference('Chocolate')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all ${candyPreference === 'Chocolate' ? 'border-honey-amber bg-honey-yellow/10 text-honey-amber' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                    >
                      🍫 Chocolate
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCandyPreference('Chikki')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all ${candyPreference === 'Chikki' ? 'border-honey-amber bg-honey-yellow/10 text-honey-amber' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                    >
                      🍬 Chikki
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-slate mb-2">Special Notes</label>
                  <textarea value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} className="w-full bg-bg-cream border border-honey-light/80 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-honey-yellow focus:ring-2 focus:ring-honey-yellow/20 min-h-[80px]" placeholder="Theme preference, multiple names, etc." />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="w-full gap-2 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                    ) : (
                      <>Send Enquiry <MessageCircle className="w-5 h-5" /></>
                    )}
                  </Button>
                  <p className="text-center text-xs font-bold text-text-slate mt-4">We will reach out to you and customize based on your preference.</p>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}



