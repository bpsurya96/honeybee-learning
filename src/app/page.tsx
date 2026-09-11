import Link from 'next/link';
import Image from 'next/image';

// We'll hardcode a few reviews for the homepage to avoid needing an async file read here, 
// or we could use the reviews.json but keeping it simple for the landing page layout.
const reviews = [
  { id: 1, name: "Sneha R.", location: "Chennai", text: "My 3-year-old was thrilled to see her name on the cover! The write & wipe quality is amazing. We use it every single day.", rating: 5 },
  { id: 2, name: "Priya M.", location: "Bangalore", text: "Ordered 30 Dino kits for my son's birthday. They were a massive hit with the kids and parents alike. Much better than plastic toys!", rating: 5 },
  { id: 3, name: "Karthik S.", location: "Hyderabad", text: "The customisation makes it feel so premium. Customer support on WhatsApp was extremely helpful and shipping was fast.", rating: 5 },
];

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
            <Link href="/products" className="btn-primary text-lg shadow-lg shadow-primary/20">
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
        <div className="absolute top-40 right-20 text-5xl opacity-20 rotate-12">🖍️</div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Why HoneyBee Learning?</h2>
            <p className="text-lg text-slate-600">Thoughtfully designed to grow with your child.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center group">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🎨</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">15+ Fun Themes</h3>
              <p className="text-slate-600">From dinosaurs to space, let them pick their favourite world.</p>
            </div>
            <div className="card text-center group">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">✨</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Write & Wipe</h3>
              <p className="text-slate-600">Fully laminated pages mean they can practice 100+ times.</p>
            </div>
            <div className="card text-center group">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Certificate Included</h3>
              <p className="text-slate-600">Every book ends with a personalised achievement certificate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* UGC / Reviews Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-4xl mb-4 block">⭐</span>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Happy Little Bees</h2>
            <p className="text-lg text-slate-600">Join thousands of parents making learning fun again.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-slate-700 italic mb-6 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-primary font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{review.name}</h4>
                    <span className="text-xs text-slate-500">{review.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products" className="text-primary font-bold hover:underline text-lg">
              Read more reviews →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
