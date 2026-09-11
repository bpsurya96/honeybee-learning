'use client';

import Link from 'next/link';
import { useCart } from '@/lib/CartContext';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-100 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🍯</span>
          <span className="text-2xl font-bold text-primary tracking-tight">HoneyBee Learning</span>
        </Link>
        <nav className="hidden md:flex gap-8 font-bold text-slate-600">
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <Link href="/return-gifts" className="hover:text-primary transition-colors">Return Gifts</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-700 hover:text-primary transition-colors"
          >
            <span className="text-2xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
          
          <a href="https://wa.me/918883624873" target="_blank" rel="noreferrer" className="btn-primary py-2 px-5 text-sm hidden md:block">
            WhatsApp Us
          </a>
        </div>
      </div>
    </header>
  );
}
