'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useCart } from '@/lib/CartContext';
import { useState } from 'react';

export default function ProductCard({ product }: { product: Product }) {
  const isReturnGift = product.productType === 'return-gift';
  const price = isReturnGift ? product.price : product.price;
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      title: product.title,
      price: price,
      quantity: isReturnGift ? 10 : 1,
      image: product.image || product.images?.[0] || '',
      isReturnGift: isReturnGift
    });
  };

  return (
    <div className="card flex flex-col h-full group hover:shadow-md transition-shadow">
      <Link href={isReturnGift ? '/return-gifts' : `/products/${product.id}`} className="block">
        <div className="relative aspect-square w-full mb-4 bg-amber-50 rounded-xl overflow-hidden flex items-center justify-center">
          {product.image && !imageError ? (
            <Image 
              src={`/${product.image}`} 
              alt={product.title} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-6xl">{product.fallbackEmoji || '🍯'}</span>
          )}
          
          {product.badge && (
            <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm
              ${product.badgeType === 'new' ? 'bg-emerald-500' : 
                product.badgeType === 'premium' ? 'bg-violet-500' : 'bg-primary'}`}>
              {product.badge}
            </div>
          )}
        </div>
      </Link>
      
      <div className="flex-grow flex flex-col">
        <h3 className="font-bold text-slate-800 text-lg mb-2 leading-tight">
          {product.title}
        </h3>
        
        {product.shortDesc && (
          <p className="text-slate-500 text-sm mb-4 line-clamp-2">
            {product.shortDesc}
          </p>
        )}
        
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="text-xl font-bold text-slate-800">
            ₹{price}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="btn-primary py-2 px-4 text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
