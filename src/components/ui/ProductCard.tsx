'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useCart } from '@/lib/CartContext';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShoppingCart } from 'lucide-react';

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

  const badgeTypeMap: Record<string, "popular" | "new" | "festive" | "default"> = {
    new: "new",
    popular: "popular",
    premium: "festive",
  };

  return (
    <div className="card-premium flex flex-col h-full group p-5 bg-white relative overflow-hidden">
      <Link href={isReturnGift ? '/return-gifts' : `/products/${product.id}`} className="block relative">
        <div className="relative aspect-square w-full mb-5 bg-bg-cream rounded-2xl overflow-hidden flex items-center justify-center">
          {product.image && !imageError ? (
            <Image 
              src={`/${product.image}`} 
              alt={product.title} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
              {product.fallbackEmoji || '🍯'}
            </span>
          )}
          
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant={badgeTypeMap[product.badgeType || 'default'] || 'default'} className="shadow-sm">
                {product.badge}
              </Badge>
            </div>
          )}
        </div>
      </Link>
      
      <div className="flex-grow flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={isReturnGift ? '/return-gifts' : `/products/${product.id}`} className="block flex-1">
            <h3 className="font-heading font-extrabold text-text-dark-brown text-xl leading-tight group-hover:text-honey-amber transition-colors">
              {product.title}
            </h3>
          </Link>
          <div className="text-xl font-extrabold text-text-charcoal whitespace-nowrap">
            ₹{price}
          </div>
        </div>
        
        {product.shortDesc && (
          <p className="text-text-slate text-sm mb-4 line-clamp-2">
            {product.shortDesc}
          </p>
        )}
        
        {/* Fake Feature Chips based on product type to make it look premium */}
        {!isReturnGift && (
          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            <span className="text-[10px] uppercase tracking-wider font-bold bg-honey-light/20 text-honey-amber px-2 py-1 rounded-md">Personalised</span>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-honey-light/20 text-honey-amber px-2 py-1 rounded-md">Reusable</span>
          </div>
        )}
        {isReturnGift && (
          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            <span className="text-[10px] uppercase tracking-wider font-bold bg-accent-lavender/30 text-text-dark-brown px-2 py-1 rounded-md">Min. 10 Pcs</span>
          </div>
        )}
        
        <div className="mt-auto pt-2">
          <Button 
            onClick={handleAddToCart}
            variant="primary"
            className="w-full gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
