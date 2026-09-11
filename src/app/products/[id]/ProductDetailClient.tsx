'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';

export default function ProductDetailClient({ product }: { product: Product }) {
  const [childName, setChildName] = useState('YOUR NAME');
  const [activeImage, setActiveImage] = useState(product.images?.[0] || product.image);
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();

  const displayPrice = product.price;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      price: displayPrice,
      quantity: 1,
      image: activeImage,
      childName: childName !== 'YOUR NAME' ? childName : undefined,
      isReturnGift: product.productType === 'return-gift'
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <nav className="mb-8 text-sm font-medium text-slate-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/products" className="hover:text-primary">Products</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-800">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full bg-amber-50 rounded-2xl overflow-hidden border border-amber-100 flex items-center justify-center">
            {activeImage && !imageError ? (
              <>
                <Image 
                  src={`/${activeImage}`} 
                  alt={product.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-primary shadow-lg transform -translate-y-24 rotate-[0deg]">
                     <span className="text-2xl font-bold text-primary tracking-widest uppercase">
                       {childName || 'YOUR NAME'}
                     </span>
                   </div>
                </div>
              </>
            ) : (
              <span className="text-9xl">{product.fallbackEmoji || '🍯'}</span>
            )}
            
            {product.badge && (
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold text-white shadow-sm bg-primary">
                {product.badge}
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    setActiveImage(img);
                    setImageError(false); // Reset error state on change
                  }}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors
                    ${activeImage === img ? 'border-primary' : 'border-transparent hover:border-amber-200'}`}
                >
                  <Image 
                    src={`/${img}`} 
                    alt={`${product.title} view ${i}`} 
                    fill 
                    sizes="96px"
                    className="object-cover" 
                    onError={(e) => {
                      // Hide the image if it errors
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">{product.title}</h1>
          <div className="text-3xl font-bold text-primary mb-8">₹{displayPrice}</div>
          
          <p className="text-slate-600 text-lg mb-8 whitespace-pre-line">
            {product.fullDesc || product.shortDesc}
          </p>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map(tag => (
                <span key={tag} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-xl">✨</span> Personalise this book
            </h3>
            <label className="block text-sm font-bold text-slate-600 mb-2">Child's Name (Printed on every page)</label>
            <input 
              type="text" 
              maxLength={15}
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g. ARYA"
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold uppercase focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-slate-500 mt-2">See a live preview of the name on the cover image!</p>
          </div>

          <button 
            onClick={handleAddToCart}
            className="btn-primary w-full py-4 text-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <span>Add to Cart</span>
            <span>🛒</span>
          </button>
          
          <p className="text-center text-sm text-slate-500 mt-4">
            We will send a digital preview of the cover for your approval before printing.
          </p>

          {product.freebies && product.freebies.length > 0 && (
            <div className="mt-12 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="text-xl">🎁</span> Included Free
              </h3>
              <ul className="space-y-2">
                {product.freebies.map((freebie, i) => (
                  <li key={i} className="flex items-center gap-2 text-emerald-700 font-medium">
                    {freebie}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
