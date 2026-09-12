import Link from 'next/link';
import { MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-text-dark-brown text-honey-light/80 py-16 border-t-[8px] border-honey-yellow relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl filter drop-shadow-md">🐝</span>
            <span className="text-3xl font-extrabold text-white tracking-tight font-heading">HoneyBee</span>
          </div>
          <p className="text-sm text-honey-light/90 leading-relaxed max-w-xs">
            India's first fully personalised, reusable activity books. Making learning magical, one name at a time.
          </p>
          <div className="inline-block bg-white/10 px-4 py-2 rounded-xl text-sm text-white font-bold backdrop-blur-sm">
            Made with ❤️ in Chennai
          </div>
        </div>
        
        {/* Shop Column */}
        <div>
          <h4 className="text-white font-bold mb-6 text-lg font-heading">Shop</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link href="/products" className="hover:text-white hover:translate-x-1 inline-block transition-all">All Products</Link></li>
            <li><Link href="/return-gifts" className="hover:text-white hover:translate-x-1 inline-block transition-all flex items-center gap-2">Birthday Return Gifts <span className="bg-honey-yellow text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Hot</span></Link></li>
            <li><Link href="/schools" className="hover:text-white hover:translate-x-1 inline-block transition-all">School Partnerships</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="text-white font-bold mb-6 text-lg font-heading">Support</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link href="/track-order" className="hover:text-white hover:translate-x-1 inline-block transition-all">Track Order</Link></li>
            <li><Link href="/faq" className="hover:text-white hover:translate-x-1 inline-block transition-all">FAQ</Link></li>
            <li><Link href="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">About Us</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="text-white font-bold mb-6 text-lg font-heading">Contact</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-honey-yellow" />
              <span>+91 88836 24873</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-honey-yellow" />
              <span>hello@honeybeelearning.co.in</span>
            </li>
            <li className="pt-4 flex gap-4">
              <a href="https://wa.me/918883624873" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-honey-yellow hover:text-white transition-all text-white">
                <MessageCircle className="w-6 h-6" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-honey-yellow hover:text-white transition-all text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 text-sm text-honey-light/60 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} HoneyBee Learning. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
