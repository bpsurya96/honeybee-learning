import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full bg-amber-50 py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-block bg-white text-primary font-bold px-4 py-1 rounded-full text-sm mb-6 shadow-sm border border-amber-100">
            ✨ India's First Personalised Activity Books
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-800 mb-8 tracking-tight">
            Their Name. <span className="text-primary">Every Page.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Screen-free, value-based learning that kids actually love. Personalised with your child's name to make learning feel magical.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products" className="btn-primary text-lg">
              Explore Books 📚
            </Link>
            <Link href="/return-gifts" className="btn-secondary bg-white text-slate-800 hover:bg-slate-50 border-2 border-slate-100 text-lg">
              Birthday Gifts 🎁
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">🐝</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-pulse">🍯</div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Why HoneyBee Learning?</h2>
            <p className="text-lg text-slate-600">Thoughtfully designed to grow with your child.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">15+ Fun Themes</h3>
              <p className="text-slate-600">From dinosaurs to space, let them pick their favourite world.</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Write & Wipe</h3>
              <p className="text-slate-600">Fully laminated pages mean they can practice 100+ times.</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Certificate Included</h3>
              <p className="text-slate-600">Every book ends with a personalised achievement certificate.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
