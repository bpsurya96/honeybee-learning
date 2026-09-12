'use client';

import { getAllProducts } from '@/lib/data';
import ProductCard from '@/components/ui/ProductCard';
import { motion } from 'framer-motion';
import { Waves, Fish } from 'lucide-react';
import Link from 'next/link';

export default function OceanCollectionPage() {
  const allProducts = getAllProducts();
  const oceanProducts = allProducts.filter(p => 
    p.title.toLowerCase().includes('ocean') || 
    p.tags?.some(tag => tag.toLowerCase().includes('ocean')) ||
    p.keywords?.some(kw => kw.toLowerCase().includes('ocean'))
  );

  return (
    <div className="bg-cyan-50 min-h-screen pb-20 relative overflow-hidden">
      {/* Background Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/40 bg-white/10"
            style={{
              width: Math.random() * 40 + 10,
              height: Math.random() * 40 + 10,
              left: `${Math.random() * 100}%`,
              bottom: -50,
            }}
            animate={{
              y: [0, -1000],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-teal-800 to-cyan-600 py-20 lg:py-28 rounded-b-[3rem] shadow-xl relative z-10 text-white text-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6 shadow-sm border border-white/30">
            <Fish className="w-4 h-4 text-cyan-200" />
            Ocean Collection
          </div>
          <h1 className="text-4xl lg:text-6xl font-black font-heading mb-6 tracking-tight drop-shadow-md">
            Dive into Learning!
          </h1>
          <p className="text-lg lg:text-xl font-medium text-cyan-100 max-w-2xl mx-auto leading-relaxed">
            Explore the wonders of the deep blue sea. Tracing, counting, and colouring with our personalised underwater friends.
          </p>
        </motion.div>
        
        {/* Decorative Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 flex justify-center">
          <div className="bg-white text-teal-700 w-16 h-16 rounded-full shadow-lg flex items-center justify-center border-4 border-cyan-50">
            <Waves className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 lg:px-8 mt-24 relative z-10">
        {oceanProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {oceanProducts.map((product, i) => (
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
            <p className="text-teal-800 font-bold text-xl">No Ocean products found right now. Stay tuned!</p>
            <Link href="/products" className="mt-4 inline-block btn-primary">Browse All Products</Link>
          </div>
        )}
      </div>
    </div>
  );
}
