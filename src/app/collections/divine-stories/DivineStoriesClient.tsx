'use client';

import ProductCard from '@/components/ui/ProductCard';
import { motion } from 'framer-motion';
import { Sparkles, Sun } from 'lucide-react';
import Link from 'next/link';

export default function DivineStoriesClient({ divineProducts }: { divineProducts: any[] }) {
  return (
    <div className="bg-orange-50 min-h-screen pb-20 relative overflow-hidden">
      {/* Background Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-amber-400 rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 py-20 lg:py-28 rounded-b-[3rem] shadow-2xl relative z-10 text-white text-center px-4">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300/20 via-transparent to-transparent opacity-60"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto relative z-20"
        >
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-6 shadow-inner border border-white/20 text-yellow-100">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            Divine Stories Collection
          </div>
          <h1 className="text-4xl lg:text-6xl font-black font-heading mb-6 tracking-tight drop-shadow-lg text-white">
            Spiritual Learning <br className="hidden md:block"/> for Little Ones
          </h1>
          <p className="text-lg lg:text-xl font-medium text-orange-100 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Make the Gods their special friends. Personalised storybooks that instil timeless values and divine love.
          </p>
        </motion.div>
        
        {/* Decorative Divider */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 flex justify-center">
          <div className="bg-white text-orange-600 w-16 h-16 rounded-full shadow-xl flex items-center justify-center border-4 border-orange-50 relative z-30">
            <Sun className="w-8 h-8 animate-spin-slow" style={{ animationDuration: '10s' }} />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 lg:px-8 mt-24 relative z-10">
        {divineProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {divineProducts.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-orange-800 font-bold text-xl">No Divine Stories found right now. Stay tuned!</p>
            <Link href="/products" className="mt-4 inline-block btn-primary">Browse All Products</Link>
          </div>
        )}
      </div>
    </div>
  );
}