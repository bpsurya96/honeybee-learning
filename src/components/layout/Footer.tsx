import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-amber-50 py-12 mt-20 border-t border-amber-100">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🍯</span>
            <span className="text-xl font-bold text-primary">HoneyBee</span>
          </div>
          <p className="text-slate-600 text-sm">
            India's first personalised activity book for kids. Made with love, right here in Chennai.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/products" className="hover:text-primary">All Products</Link></li>
            <li><Link href="/return-gifts" className="hover:text-primary">Return Gifts</Link></li>
            <li><Link href="/ocean-kits" className="hover:text-primary">Ocean Kits</Link></li>
            <li><Link href="/divine-stories" className="hover:text-primary">Divine Stories</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 mb-4">Help</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link href="/about" className="hover:text-primary">Our Story</Link></li>
            <li><Link href="/bee-points" className="hover:text-primary">Bee Points</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><a href="https://wa.me/918883624873" className="hover:text-primary">WhatsApp: +91 8883624873</a></li>
            <li>Medavakkam, Chennai</li>
            <li>Tamil Nadu, India</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-amber-200 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} HoneyBee Learning. All rights reserved.
      </div>
    </footer>
  );
}
