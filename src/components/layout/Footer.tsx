import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t-4 border-primary">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🍯</span>
            <span className="text-2xl font-bold text-white tracking-tight">HoneyBee</span>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            India's first fully personalised, reusable activity books. Making learning magical, one name at a time.
          </p>
          <p className="text-sm text-slate-400">
            Made with ❤️ in Chennai.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
            <li><Link href="/return-gifts" className="hover:text-primary transition-colors">Birthday Return Gifts</Link></li>
            <li><Link href="/schools" className="hover:text-primary transition-colors">School Partnerships</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>WhatsApp: +91 88836 24873</li>
            <li>Email: hello@honeybeelearning.co.in</li>
            <li className="mt-4">
              <a href="https://wa.me/918883624873" className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-xl transition-colors">
                Message Us
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 text-center">
        © {new Date().getFullYear()} HoneyBee Learning. All rights reserved.
      </div>
    </footer>
  );
}
