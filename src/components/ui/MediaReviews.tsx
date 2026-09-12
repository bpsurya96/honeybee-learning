'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageCircle, Camera, Video, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  name?: string;
  loc?: string;
  stars: number;
  date: string;
  text?: string;
  img?: string;
  youtube?: string;
}

interface MediaReviewsProps {
  reviews: {
    text: Review[];
    photos: Review[];
    videos: Review[];
  }
}

export default function MediaReviews({ reviews }: MediaReviewsProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'photos' | 'videos'>('text');
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentData = reviews[activeTab] || [];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1 >= currentData.length ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? currentData.length - 1 : prev - 1));
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-5xl mb-6 block">💛</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-text-dark-brown font-heading mb-4">
            Loved by 1200+ Parents
          </h2>
          <p className="text-lg text-text-slate">Real reviews from happy families across India!</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => { setActiveTab('text'); setCurrentIndex(0); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === 'text' 
                ? 'bg-honey-yellow text-text-dark-brown shadow-md scale-105' 
                : 'bg-bg-cream text-text-slate hover:bg-honey-light/50'
            }`}
          >
            <MessageCircle className="w-5 h-5" /> Text Reviews
          </button>
          <button
            onClick={() => { setActiveTab('photos'); setCurrentIndex(0); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === 'photos' 
                ? 'bg-honey-yellow text-text-dark-brown shadow-md scale-105' 
                : 'bg-bg-cream text-text-slate hover:bg-honey-light/50'
            }`}
          >
            <Camera className="w-5 h-5" /> Photo Reviews
          </button>
          <button
            onClick={() => { setActiveTab('videos'); setCurrentIndex(0); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === 'videos' 
                ? 'bg-honey-yellow text-text-dark-brown shadow-md scale-105' 
                : 'bg-bg-cream text-text-slate hover:bg-honey-light/50'
            }`}
          >
            <Video className="w-5 h-5" /> Video Reviews
          </button>
        </div>

        {/* Carousel Content */}
        <div className="relative max-w-4xl mx-auto">
          {/* Nav Buttons */}
          {currentData.length > 1 && (
            <>
              <button 
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full bg-white shadow-xl border border-honey-light flex items-center justify-center text-text-dark-brown hover:bg-honey-yellow z-10 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full bg-white shadow-xl border border-honey-light flex items-center justify-center text-text-dark-brown hover:bg-honey-yellow z-10 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="overflow-hidden rounded-3xl p-4">
            <AnimatePresence mode="wait">
              {currentData.length > 0 && (
                <motion.div
                  key={activeTab + currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center"
                >
                  {/* TEXT RENDERER */}
                  {activeTab === 'text' && (
                    <div className="card-premium w-full max-w-2xl mx-auto bg-white p-8 md:p-12">
                      <div className="flex justify-center gap-1 mb-6">
                        {[...Array(currentData[currentIndex].stars || 5)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 fill-honey-yellow text-honey-yellow" />
                        ))}
                      </div>
                      <p className="text-text-charcoal text-xl md:text-2xl italic mb-8 text-center leading-relaxed">
                        &quot;{currentData[currentIndex].text}&quot;
                      </p>
                      <div className="flex flex-col items-center mt-auto pt-6 border-t border-honey-light/30">
                        <div className="w-14 h-14 rounded-full bg-honey-light/30 flex items-center justify-center text-honey-amber font-bold text-2xl font-heading mb-3">
                          {currentData[currentIndex].name?.charAt(0) || 'H'}
                        </div>
                        <h4 className="font-bold text-text-dark-brown text-lg">{currentData[currentIndex].name}</h4>
                        <span className="text-sm text-text-slate">{currentData[currentIndex].loc} • {currentData[currentIndex].date}</span>
                      </div>
                    </div>
                  )}

                  {/* PHOTO RENDERER */}
                  {activeTab === 'photos' && (
                    <div className="w-full max-w-md mx-auto">
                      <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                        <img 
                          src={'/' + currentData[currentIndex].img} 
                          alt="Customer Review" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-center gap-1 mt-6">
                        {[...Array(currentData[currentIndex].stars || 5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-honey-yellow text-honey-yellow" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VIDEO RENDERER */}
                  {activeTab === 'videos' && (
                    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
                      <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 mb-8">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={`https://www.youtube.com/embed/${currentData[currentIndex].youtube}`} 
                          title="Customer Review Video" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      
                      <div className="text-center px-4">
                        <div className="flex justify-center gap-1 mb-4">
                          {[...Array(currentData[currentIndex].stars || 5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-honey-yellow text-honey-yellow" />
                          ))}
                        </div>
                        <p className="text-text-charcoal text-lg italic mb-4">&quot;{currentData[currentIndex].text}&quot;</p>
                        <h4 className="font-bold text-text-dark-brown">{currentData[currentIndex].name}</h4>
                        <span className="text-sm text-text-slate">{currentData[currentIndex].loc}</span>
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {currentData.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex ? 'bg-honey-amber scale-125' : 'bg-honey-light/50 hover:bg-honey-yellow'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
