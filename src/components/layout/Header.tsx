import Link from 'next/link';

export default function Header() {
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
        <div className="flex items-center gap-4">
          <a href="https://wa.me/918883624873" target="_blank" rel="noreferrer" className="btn-primary py-2 px-5 text-sm hidden md:block">
            WhatsApp Us
          </a>
        </div>
      </div>
    </header>
  );
}
