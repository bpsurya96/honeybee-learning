import FAQClient from './FAQClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ & Help | HoneyBee Learning',
  description: 'Common questions about shipping, personalisation, return gifts, and how HoneyBee Learning books work.',
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-16">
        <span className="text-6xl mb-6 block">🤔</span>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-slate-600">Everything you need to know about our personalised books and return gifts.</p>
      </div>

      <FAQClient />
      
      <div className="mt-16 bg-slate-50 p-8 rounded-3xl text-center border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-2">Still have questions?</h3>
        <p className="text-slate-600 mb-6">We're always here to help. Send us a message on WhatsApp!</p>
        <a href="https://wa.me/918883624873" className="btn-primary inline-flex items-center gap-2">
          <span>Chat on WhatsApp</span>
          <span>💬</span>
        </a>
      </div>
    </div>
  );
}
