'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { MessageCircle, Star, Sparkles, ShieldCheck, Heart, BookOpen, Gift, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const reviews = [
  { id: 1, name: "Sneha R.", location: "Chennai", text: "My 3-year-old was thrilled to see her name on the cover! The write & wipe quality is amazing. We use it every single day.", rating: 5, date: "2 days ago" },
  { id: 2, name: "Priya M.", location: "Bangalore", text: "Ordered 30 Dino kits for my son's birthday. They were a massive hit with the kids and parents alike. Much better than plastic toys!", rating: 5, date: "1 week ago" },
  { id: 3, name: "Karthik S.", location: "Hyderabad", text: "The customisation makes it feel so premium. Customer support on WhatsApp was extremely helpful and shipping was fast.", rating: 5, date: "3 weeks ago" },
];

const themes = [
  { name: "Dino Explorer", emoji: "🦖", color: "bg-emerald-100" },
  { name: "Space Journey", emoji: "🚀", color: "bg-slate-800" },
  { name: "Jungle Safari", emoji: "🦁", color: "bg-amber-100" },
  { name: "Ocean Magic", emoji: "🐋", color: "bg-cyan-100" },
  { name: "Little Krishna", emoji: "🦚", color: "bg-indigo-100" },
  { name: "Fairy Princess", emoji: "🧚‍♀️", color: "bg-pink-100" },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <div className="flex flex-col bg-bg-cream overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>⭐</div>
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '4s' }}>🎨</div>
        <div className="absolute top-40 right-20 text-3xl opacity-20 animate-pulse">✨</div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-honey-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-72 h-72 bg-accent-sky/30 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-white text-text-charcoal font-bold px-4 py-1.5 rounded-full text-sm mb-6 shadow-sm border border-honey-light/50">
                <Sparkles className="w-4 h-4 text-honey-yellow" />
                India's First Personalised Activity Books
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-text-dark-brown mb-6 font-heading leading-[1.1]">
                Your Child's Name. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-honey-amber to-honey-yellow">
                  On Every Page.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-text-slate mb-8 max-w-lg leading-relaxed">
                Screen-free, value-based learning that kids actually love. Make learning feel magical with our premium reusable books.
              </p>
              
              <form onSubmit={handleSearch} className="w-full max-w-md mb-8 relative z-20">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for dinosaurs, space, gifts..." 
                  className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-honey-yellow focus:outline-none focus:ring-4 focus:ring-honey-light/50 text-text-dark-brown font-medium shadow-sm transition-all"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 w-12 bg-honey-yellow text-white rounded-full flex items-center justify-center hover:bg-honey-amber transition-colors shadow-sm">
                  <Search className="w-5 h-5" />
                </button>
              </form>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                    Shop Personalised Books <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="https://wa.me/918883624873" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                    <MessageCircle className="w-5 h-5 text-green-500" /> Order on WhatsApp
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Right Rich Visual Composition */}
            <motion.div 
              style={{ y: heroY }}
              className="lg:w-1/2 relative w-full aspect-square max-w-lg mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-sky/40 to-honey-light/40 rounded-[3rem] transform rotate-3"></div>
              <div className="absolute inset-0 bg-white rounded-[3rem] shadow-xl transform -rotate-2 border-4 border-white flex items-center justify-center p-8 overflow-hidden group">
                <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-700">
                  <Image 
                    src="/book-mockup.jpg" // We assume this exists or fallback to a div if not
                    alt="Personalised Activity Book Mockup"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      // Fallback visual if no image
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Fallback composition if image fails */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-cream rounded-2xl border-2 border-dashed border-honey-light/50">
                     <span className="text-6xl mb-4">📚</span>
                     <h3 className="font-heading font-bold text-2xl text-text-dark-brown">Aarav's Dinosaur Book</h3>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-honey-light/30"
                >
                  <span className="text-3xl">🖍️</span>
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 15, 0] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 -left-6 bg-white px-4 py-2 rounded-2xl shadow-lg border border-honey-light/30 flex items-center gap-2"
                >
                  <span className="text-xl">✨</span>
                  <span className="font-bold text-sm text-text-dark-brown">Ages 2-12</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <div className="relative z-20 -mt-8 mb-16 container mx-auto px-4 lg:px-8">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-white flex flex-wrap justify-center gap-3 lg:gap-6">
          <TrustBadge icon="🐝" label="1200+ Happy Orders" />
          <TrustBadge icon={<Sparkles className="w-5 h-5 text-honey-amber"/>} label="Personalised Every Page" />
          <TrustBadge icon="♻️" label="Reusable Books" />
          <TrustBadge icon="🇮🇳" label="Chennai-based" />
        </div>
      </div>

      {/* 3. WHY HONEYBEE - EDITORIAL SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-text-dark-brown font-heading mb-6 leading-tight">
              Learning Feels Different <br className="hidden md:block"/>When It's Personal.
            </h2>
            <p className="text-lg text-text-slate">
              We design books that put your child in the center of the story. It’s not just a book, it’s an experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Their Name", desc: "Featured dynamically on every single page.", icon: "✨", color: "bg-accent-peach" },
              { num: "02", title: "Their Favourite Theme", desc: "From Dinosaurs to Princesses, pick what they love.", icon: "🎨", color: "bg-accent-sky" },
              { num: "03", title: "Write & Wipe", desc: "Premium laminated pages for endless practice.", icon: "♻️", color: "bg-accent-mint" },
              { num: "04", title: "Learn Again", desc: "Pass it down or practice daily without waste.", icon: "📚", color: "bg-accent-lavender" },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col relative p-8 bg-bg-cream rounded-3xl border border-honey-light/20 hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center text-2xl mb-6 shadow-sm`}>
                  {feature.icon}
                </div>
                <div className="text-honey-yellow/30 font-heading font-black text-6xl absolute top-6 right-6 select-none pointer-events-none">
                  {feature.num}
                </div>
                <h3 className="text-xl font-bold text-text-dark-brown mb-3 font-heading z-10">{feature.title}</h3>
                <p className="text-text-slate text-sm leading-relaxed z-10">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THEME SHOWCASE */}
      <section className="py-24 bg-bg-cream overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-text-dark-brown font-heading mb-4">
              Pick a Theme They'll Love 💛
            </h2>
            <p className="text-text-slate text-lg max-w-xl">
              We have something for every imagination.
            </p>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-2 text-honey-amber font-bold hover:underline">
            View All Themes <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-8 hide-scrollbar px-4 lg:px-8 gap-6 snap-x">
          {themes.map((theme, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="flex-none w-64 snap-start"
            >
              <Link href="/products" className="block relative h-80 rounded-3xl overflow-hidden group shadow-sm border border-honey-light/30">
                <div className={`absolute inset-0 ${theme.color} transition-transform duration-500 group-hover:scale-105 flex items-center justify-center`}>
                  <span className="text-8xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">{theme.emoji}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-text-dark-brown/80 via-text-dark-brown/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl font-heading mb-1">{theme.name}</h3>
                  <span className="text-white/80 text-sm font-medium flex items-center gap-1 group-hover:text-honey-yellow transition-colors">
                    Explore <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
          {/* View All Card */}
          <div className="flex-none w-64 snap-start flex items-center justify-center">
            <Link href="/products" className="flex flex-col items-center gap-4 group">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all">
                <ChevronRight className="w-8 h-8 text-honey-amber" />
              </div>
              <span className="font-bold text-text-dark-brown">View All Themes</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. PERSONALISATION EXPERIENCE */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-text-dark-brown font-heading mb-6">
              Their Name Changes Everything.
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 max-w-5xl mx-auto">
            <div className="flex-1 w-full bg-slate-50 p-8 rounded-[3rem] text-center border border-slate-200">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 block">Generic Book</span>
              <div className="bg-white aspect-[3/4] w-48 mx-auto rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                <span className="text-slate-300 text-6xl">📓</span>
              </div>
              <h3 className="font-bold text-slate-500 line-through">"This is my book"</h3>
            </div>
            
            <div className="hidden md:flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-honey-yellow flex items-center justify-center text-white shadow-md animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            <div className="flex-1 w-full bg-gradient-to-br from-honey-light/30 to-accent-sky/30 p-8 rounded-[3rem] text-center border border-honey-light">
              <span className="text-sm font-bold text-honey-amber uppercase tracking-wider mb-4 block flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4"/> HoneyBee Book
              </span>
              <div className="bg-white aspect-[3/4] w-56 mx-auto rounded-xl shadow-xl border border-honey-light flex items-center justify-center mb-6 transform scale-110 -rotate-2 hover:rotate-0 transition-transform">
                <div className="text-center">
                   <span className="text-6xl mb-2 block">🌟</span>
                   <div className="text-lg font-heading font-bold text-text-dark-brown">Aarav's</div>
                   <div className="text-sm text-text-slate">Magic Book</div>
                </div>
              </div>
              <h3 className="font-bold text-text-dark-brown text-xl">"This is Aarav's book!"</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (TIMELINE) */}
      <section className="py-24 bg-text-dark-brown text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold font-heading mb-6">
              How It Works
            </h2>
          </div>

          <div className="flex flex-col md:flex-row relative max-w-5xl mx-auto gap-12 md:gap-0">
            {/* Connecting Line Desktop */}
            <div className="hidden md:block absolute top-12 left-12 right-12 h-1 bg-white/10 rounded-full"></div>
            
            {[
              { step: "01", title: "Choose Theme", desc: "Select from our wide range of educational themes.", icon: "🎨" },
              { step: "02", title: "Personalise", desc: "Enter your child's name and photo (optional).", icon: "✨" },
              { step: "03", title: "We Print", desc: "We custom print and laminate every single page.", icon: "🖨️" },
              { step: "04", title: "They Learn", desc: "Delivered to your doorstep, ready for fun!", icon: "🚀" },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-row md:flex-col items-start md:items-center relative z-10 gap-6 md:gap-0">
                <div className="w-24 h-24 rounded-full bg-text-charcoal border-4 border-text-dark-brown flex items-center justify-center text-4xl shadow-xl md:mb-6 flex-shrink-0 z-10 relative">
                  {item.icon}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-honey-yellow text-white text-sm font-bold flex items-center justify-center border-2 border-text-dark-brown">
                    {item.step}
                  </div>
                </div>
                <div className="md:text-center pt-2 md:pt-0">
                  <h3 className="text-xl font-bold font-heading mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm max-w-[200px] mx-auto leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CERTIFICATE SECTION */}
      <section className="py-20 bg-bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-gradient-to-r from-accent-sky/20 to-accent-lavender/20 rounded-[3rem] p-8 md:p-16 border border-white flex flex-col md:flex-row items-center gap-12 shadow-sm">
            <div className="flex-1">
              <div className="inline-block bg-white text-text-charcoal font-bold px-4 py-1.5 rounded-full text-sm mb-6 shadow-sm">
                🎓 Included in every book
              </div>
              <h2 className="text-4xl font-extrabold text-text-dark-brown font-heading mb-6">
                A Certificate of Achievement
              </h2>
              <p className="text-lg text-text-slate mb-8 leading-relaxed max-w-lg">
                Every book ends with a personalised achievement certificate. A proud moment for your child to celebrate completing their learning journey.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-text-charcoal font-medium">
                  <CheckCircle2 className="w-5 h-5 text-honey-amber" /> Personalised with their name
                </li>
                <li className="flex items-center gap-3 text-text-charcoal font-medium">
                  <CheckCircle2 className="w-5 h-5 text-honey-amber" /> Encourages task completion
                </li>
              </ul>
              <Button variant="primary">Shop Now</Button>
            </div>
            
            <div className="flex-1 w-full relative">
              {/* Certificate Mockup */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-4 border-honey-light/50 transform rotate-2 mx-auto max-w-md text-center relative overflow-hidden">
                 <div className="border-2 border-honey-light border-dashed p-8 h-full rounded-xl flex flex-col items-center justify-center">
                    <span className="text-4xl mb-4">🏆</span>
                    <h3 className="font-heading font-black text-2xl text-text-dark-brown uppercase tracking-widest mb-2">Certificate</h3>
                    <p className="text-xs text-text-slate uppercase tracking-widest mb-4">of Achievement</p>
                    <p className="text-sm italic text-text-slate mb-2">This is proudly presented to</p>
                    <div className="border-b-2 border-text-dark-brown w-full pb-2 mb-4">
                      <span className="font-heading font-bold text-3xl text-honey-amber">Aarav</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. REVIEWS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-5xl mb-6 block">💛</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-text-dark-brown font-heading mb-4">
              Loved by 1200+ Parents
            </h2>
            <p className="text-lg text-text-slate">Don't just take our word for it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="card-premium">
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-honey-yellow text-honey-yellow" />
                  ))}
                </div>
                <p className="text-text-charcoal text-lg italic mb-8 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-honey-light/30">
                  <div className="w-12 h-12 rounded-full bg-honey-light/30 flex items-center justify-center text-honey-amber font-bold text-xl font-heading">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark-brown">{review.name}</h4>
                    <span className="text-xs text-text-slate">{review.location} • {review.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FOUNDER STORY */}
      <section className="py-20 bg-bg-cream border-t border-honey-light/20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full md:w-2/5 aspect-square bg-white p-4 rounded-3xl shadow-sm border border-honey-light/50 transform -rotate-2">
               <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                 {/* Placeholder for Founder Image */}
                 <span className="text-6xl text-slate-300">📸</span>
                 <div className="absolute inset-0 bg-text-dark-brown/10"></div>
               </div>
            </div>
            
            <div className="w-full md:w-3/5">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-text-dark-brown font-heading mb-6">
                Made with Love, Right Here in Chennai.
              </h2>
              <p className="text-lg text-text-slate mb-6 leading-relaxed">
                We started HoneyBee Learning because we couldn't find engaging, screen-free activities that felt special enough for our own kids. When a child sees their name in print, their eyes light up—and learning suddenly becomes magic.
              </p>
              <p className="text-lg text-text-slate mb-8 leading-relaxed">
                Every book is personally handled and packed with care. We're proud to have delivered over 1200+ smiles across India.
              </p>
              
              <div className="flex items-center gap-4">
                <TrustBadge icon={<ShieldCheck className="w-5 h-5 text-green-500"/>} label="Safe & Non-toxic" />
                <TrustBadge icon={<Heart className="w-5 h-5 text-red-400"/>} label="Handmade" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
