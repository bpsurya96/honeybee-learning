import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | HoneyBee Learning',
  description: 'Learn how HoneyBee Learning started in Chennai to create meaningful, personalised, screen-free learning experiences for children.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <span className="text-6xl mb-6 block">🍯</span>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Our Story</h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          We started HoneyBee Learning because we couldn't find meaningful, screen-free gifts for our own children. 
          Everything was plastic, breakable, or quickly forgotten.
        </p>
      </div>

      <div className="space-y-16">
        <section className="bg-amber-50 p-8 md:p-12 rounded-3xl border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 rounded-bl-full opacity-20 -z-0"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span>✨</span> The "Aha!" Moment
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              When we saw how a child's eyes lit up seeing their <strong>own name</strong> printed inside a book, we knew we had something special. 
              We realised that personalisation isn't just a gimmick—it actually makes children <em>want</em> to learn.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              We combined this insight with high-quality, reusable dry-erase pages so the learning never stops. 
              The result? India's first fully personalised activity book where your child's name is the star of every page.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Made with ❤️ in Chennai</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Every single book is designed, printed, and hand-bound in our Medavakkam studio. 
              We don't mass produce. When you order from HoneyBee, an actual person reads your child's name, formats the pages, and prepares the shipment with care.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              By supporting us, you're not just buying a book—you're supporting a small, passionate team dedicated to early childhood education.
            </p>
          </div>
          <div className="bg-slate-100 aspect-square rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden group">
            {/* Using a placeholder since we don't have a team image */}
            <div className="text-center p-8 group-hover:scale-105 transition-transform duration-500">
              <span className="text-7xl block mb-4">🇮🇳</span>
              <span className="font-bold text-slate-400">100% Local Manufacturing</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
