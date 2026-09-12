'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, signOut, loading } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/products', label: 'Activity Books' },
    { href: '/collections/divine-stories', label: 'Divine Stories' },
    { href: '/collections/ocean', label: 'Ocean Kits' },
    { href: '/collections/divine-stories', label: 'Divine Stories' },
    { href: '/collections/ocean', label: 'Ocean Kits' },
    { href: '/return-gifts', label: 'Return Gifts' },
    { href: '/schools', label: 'For Schools' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-honey-light/50 shadow-sm py-2' 
          : 'bg-bg-cream border-b border-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-text-dark-brown hover:bg-honey-light/20 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl md:text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🐝</span>
            <span className="text-2xl md:text-3xl font-extrabold text-text-dark-brown tracking-tight font-heading">
              HoneyBee
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="font-bold text-text-charcoal hover:text-honey-amber transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-honey-yellow transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* Auth Section Desktop */}
          <div className="hidden sm:flex items-center gap-4 border-r border-honey-light/50 pr-4">
            {!loading && (
              user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center gap-2 text-sm font-bold text-text-charcoal hover:text-honey-amber transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.email?.split('@')[0]}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  <AnimatePresence>
                    {showAccountMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-honey-light/50 py-2 z-50 overflow-hidden"
                      >
                        <Link 
                          href="/profile" 
                          onClick={() => setShowAccountMenu(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-text-charcoal hover:bg-bg-cream hover:text-honey-amber transition-colors border-b border-honey-light/30"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link 
                          href="/admin" 
                          onClick={() => setShowAccountMenu(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-text-charcoal hover:bg-bg-cream hover:text-honey-amber transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button 
                          onClick={() => {
                            signOut();
                            setShowAccountMenu(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href={`/login?next=${pathname}`} className="text-sm font-bold text-text-charcoal hover:text-honey-amber transition-colors">
                    Log In
                  </Link>
                  <Link href={`/login?next=${pathname}`}>
                    <Button variant="primary" size="sm" className="px-5">Sign Up</Button>
                  </Link>
                </>
              )
            )}
          </div>

          {/* Cart Button */}
          <button 
            className="relative p-2 text-text-dark-brown hover:bg-honey-light/20 rounded-full transition-colors group"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-honey-yellow text-white text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-text-dark-brown/20 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-bg-cream z-[70] shadow-2xl flex flex-col md:hidden border-r border-honey-light/50"
            >
              <div className="p-6 flex items-center justify-between border-b border-honey-light/50">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🐝</span>
                  <span className="text-2xl font-extrabold text-text-dark-brown font-heading">
                    HoneyBee
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-text-dark-brown hover:bg-honey-light/50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-6 flex-grow overflow-y-auto">
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-bold text-text-charcoal hover:text-honey-amber p-2 rounded-xl hover:bg-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                
                <div className="mt-auto pt-6 border-t border-honey-light/50 flex flex-col gap-4">
                  {!loading && (
                    user ? (
                      <>
                        <div className="p-4 bg-white rounded-2xl flex items-center gap-3 shadow-sm border border-honey-light/30">
                          <div className="w-10 h-10 rounded-full bg-honey-light flex items-center justify-center text-honey-amber font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-text-dark-brown truncate">{user.email}</p>
                          </div>
                        </div>
                        <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <User className="w-4 h-4" /> My Profile
                          </Button>
                        </Link>
                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Link href={`/login?next=${pathname}`} onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="primary" className="w-full">Log In / Sign Up</Button>
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

