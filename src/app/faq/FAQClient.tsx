'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: "Personalisation & Products",
    questions: [
      {
        q: "What does 'Personalised' mean?",
        a: "Your child's exact name will be printed directly onto the activities. For example, 'Trace ARYA's Name', or 'Help KABIR find the dinosaur'. It makes the book uniquely theirs."
      },
      {
        q: "Are the books actually reusable?",
        a: "Yes! All our activity books use thick, premium lamination. Use the provided marker to write, and wipe it off with a tissue or eraser. They can be used 100+ times."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Since every book is custom printed with your child's name, please allow 2-3 days for production, and an additional 3-5 days for shipping depending on your location in India."
      },
      {
        q: "Do you ship across India?",
        a: "Yes, we deliver pan-India via trusted courier partners."
      }
    ]
  },
  {
    category: "Return Gifts & Bulk Orders",
    questions: [
      {
        q: "What is the minimum quantity for Return Gifts?",
        a: "Our bulk return gift pricing applies to orders of 10 kits or more."
      },
      {
        q: "Can I mix different themes for my return gifts?",
        a: "Absolutely! You can specify how many of each theme you want (e.g., 10 Dino, 10 Peppa) when ordering via WhatsApp."
      }
    ]
  }
];

export default function FAQClient() {
  const [openIndex, setOpenIndex] = useState<string>("0-0");

  return (
    <div className="bg-bg-cream min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-5xl block mb-6 animate-bounce" style={{ animationDuration: '3s' }}>🤔</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-text-dark-brown font-heading mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-text-slate">Everything you need to know about HoneyBee Learning.</p>
        </div>

        <div className="space-y-12">
          {faqs.map((section, sIdx) => (
            <div key={sIdx} className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-honey-light/50">
              <h2 className="text-2xl font-extrabold text-text-dark-brown mb-8 font-heading flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-honey-light flex items-center justify-center text-sm">{sIdx + 1}</span>
                {section.category}
              </h2>
              
              <div className="space-y-4">
                {section.questions.map((faq, qIdx) => {
                  const id = `${sIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  
                  return (
                    <div 
                      key={qIdx} 
                      className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-honey-yellow bg-bg-cream shadow-sm' : 'border-transparent bg-slate-50 hover:bg-slate-100 hover:border-honey-light/50'}`}
                    >
                      <button 
                        onClick={() => setOpenIndex(isOpen ? "" : id)}
                        className="w-full px-6 py-5 text-left flex justify-between items-center group"
                      >
                        <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-text-dark-brown font-heading' : 'text-text-charcoal'}`}>
                          {faq.q}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isOpen ? 'bg-honey-yellow text-white rotate-180' : 'bg-white text-text-slate shadow-sm group-hover:text-honey-amber'}`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-2 text-text-slate font-medium leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
