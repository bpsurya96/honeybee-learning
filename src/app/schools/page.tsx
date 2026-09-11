import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'School Partnerships | HoneyBee Learning',
  description: 'Customised, branded learning materials for preschools and activity centres.',
};

export default function SchoolsPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-slate-900 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-block bg-primary/20 text-amber-300 font-bold px-4 py-1 rounded-full text-sm mb-6 border border-primary/30">
            For Preschools & Activity Centres
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Elevate your curriculum with <span className="text-primary">branded learning</span>.
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Get our premium, reusable write-and-wipe activity books customised with your school's logo and branding.
          </p>
          <a 
            href="https://wa.me/918883624873?text=Hi%20HoneyBee,%20I%20run%20a%20preschool%20and%20want%20to%20enquire%20about%20branded%20bulk%20orders."
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-lg"
          >
            Request B2B Pricing on WhatsApp
          </a>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl mb-4">🏫</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Your Logo Here</h3>
              <p className="text-slate-600">We replace our branding with yours, making it the perfect welcome kit for new admissions.</p>
            </div>
            <div>
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Wholesale Pricing</h3>
              <p className="text-slate-600">Enjoy steep discounts on bulk orders starting from just 50 units.</p>
            </div>
            <div>
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Curriculum Aligned</h3>
              <p className="text-slate-600">Our content covers early phonics, numbers, and motor skills perfect for ages 2-6.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
