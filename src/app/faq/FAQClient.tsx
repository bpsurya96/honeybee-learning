'use client';

import { useState } from 'react';

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
    <div className="space-y-12">
      {faqs.map((section, sIdx) => (
        <div key={sIdx}>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{section.category}</h2>
          <div className="space-y-4">
            {section.questions.map((faq, qIdx) => {
              const id = `${sIdx}-${qIdx}`;
              const isOpen = openIndex === id;
              
              return (
                <div 
                  key={qIdx} 
                  className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${isOpen ? 'border-primary bg-amber-50/30' : 'border-slate-200 bg-white hover:border-amber-200'}`}
                >
                  <button 
                    onClick={() => setOpenIndex(isOpen ? "" : id)}
                    className="w-full px-6 py-4 text-left font-bold text-slate-800 flex justify-between items-center"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-xl transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-400'}`}>
                      ▼
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
