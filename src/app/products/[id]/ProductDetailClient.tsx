'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/components/ui/ProductImage';
import { Product } from '@/types/product';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { 
  CheckCircle2, 
  Gift, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Heart, 
  ArrowRight,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetailClient({ product }: { product: Product }) {
    const [activeImage, setActiveImage] = useState(product.images?.[0] || product.image);
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();

  const displayPrice = product.price;
  const isReturnGift = product.productType === 'return-gift';

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      price: displayPrice,
      quantity: 1,
      image: activeImage,
      
      isReturnGift: isReturnGift
    });

    // Fire Confetti!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444'],
      zIndex: 100
    });
  };

  return (
    <div className="bg-bg-cream min-h-screen pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-honey-light/30 pt-6 pb-6 shadow-sm mb-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <nav className="text-sm font-medium text-text-slate flex items-center gap-2">
            <Link href="/" className="hover:text-honey-amber transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <Link href="/products" className="hover:text-honey-amber transition-colors">Products</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span className="text-text-dark-brown font-bold truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Imagery */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <div className="relative rounded-3xl overflow-hidden shadow-sm border-4 border-white bg-white group">
              <ProductImage 
                src={activeImage}
                alt={product.title}
                fallbackEmoji={product.fallbackEmoji}
                variant="hero"
              />
              
              {activeImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                   
                </div>
              )}
              
              {product.badge && (
                <div className="absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-bold text-white shadow-md bg-accent-mint z-30 transform rotate-2">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {product.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      setActiveImage(img);
                      setImageError(false);
                    }}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all transform
                      ${activeImage === img ? 'ring-4 ring-honey-yellow scale-105 shadow-md' : 'border-2 border-white opacity-70 hover:opacity-100 hover:scale-105 shadow-sm'}`}
                  >
                    <ProductImage 
                      src={img}
                      alt={`${product.title} view ${i}`}
                      variant="thumbnail"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Trust Badges Strip (Desktop) */}
            <div className="hidden lg:flex flex-wrap gap-3 mt-4">
               <TrustBadge icon={<ShieldCheck className="w-4 h-4 text-green-500"/>} label="Safe & Non-Toxic" />
               <TrustBadge icon={<Heart className="w-4 h-4 text-red-400"/>} label="Handmade in India" />
            </div>
          </div>

          {/* Right Column: Content & Cart */}
          <div className="lg:w-1/2 flex flex-col">
            
            {/* Title & Price */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-text-dark-brown font-heading mb-4 leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-6 mb-4">
                <span className="text-4xl font-black text-text-charcoal">₹{displayPrice}</span>
                {isReturnGift && (
                  <span className="bg-accent-lavender/30 text-text-dark-brown px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-1 border border-accent-lavender/50">
                    <Gift className="w-4 h-4" /> Bulk Pack
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-honey-amber">
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-text-slate underline cursor-pointer hover:text-text-dark-brown transition-colors">4.9/5 (120+ Reviews)</span>
              </div>
            </div>
            
            {/* Description */}
            <div className="prose prose-lg text-text-slate mb-8 max-w-none leading-relaxed">
              <p>{product.fullDesc || product.shortDesc}</p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {product.tags.map(tag => (
                  <span key={tag} className="bg-white border border-honey-light/50 text-text-charcoal px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Add To Cart Section */}
            <div className="flex flex-col gap-4 mb-12">
              <Button 
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className="w-full py-5 text-xl rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all group"
              >
                <span className="flex items-center justify-center gap-3">
                  Add to Cart <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </span>
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs font-bold text-text-slate uppercase tracking-wider">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-500"/> Secure Checkout</span>
                <span className="text-honey-light">•</span>
                <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-text-charcoal"/> Free Shipping</span>
              </div>
            </div>

            {/* What You Get (Inside the Box) */}
            <div className="bg-white rounded-[2rem] border border-honey-light/50 p-8 shadow-sm">
              <h3 className="font-heading font-extrabold text-2xl text-text-dark-brown mb-6">
                What's Inside The Box? 🎁</h3>
              
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-honey-yellow/20 text-honey-amber flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark-brown text-lg">Premium Activity Book</h4>
                    <p className="text-text-slate">30+ vibrant, thick pages customized with their name and chosen theme.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-sky/20 text-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark-brown text-lg">Wipe-Clean Lamination</h4>
                    <p className="text-text-slate">Every page is 100% reusable. Write, wipe, and practice again!</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark-brown text-lg">Achievement Certificate</h4>
                    <p className="text-text-slate">A personalized certificate at the end of the book to celebrate their learning.</p>
                  </div>
                </li>
              </ul>

              {product.freebies && product.freebies.length > 0 && (
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100/50 rounded-full blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-3 relative z-10">
                    <Gift className="w-5 h-5" /> Included Freebies
                  </h4>
                  <ul className="space-y-2 relative z-10">
                    {product.freebies.map((freebie, i) => (
                      <li key={i} className="flex items-center gap-2 text-emerald-700 font-medium">
                        <Sparkles className="w-4 h-4 text-emerald-400" /> {freebie}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

