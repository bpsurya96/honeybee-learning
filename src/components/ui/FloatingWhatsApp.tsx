'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling down a bit
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.8,
        y: isVisible ? 0 : 20,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
    >
      <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-honey-light/50 text-sm font-bold text-text-charcoal hidden md:block">
        Need help? Chat with us!
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-honey-light/50 transform rotate-45"></div>
      </div>
      
      <a 
        href="https://wa.me/918883624873" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 rounded-full shadow-xl flex items-center justify-center text-white hover:bg-green-600 hover:scale-110 transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></div>
        <MessageCircle className="w-8 h-8 relative z-10" />
      </a>
    </motion.div>
  );
}
