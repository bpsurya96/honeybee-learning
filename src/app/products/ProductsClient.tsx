'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ui/ProductCard';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductsClientProps {
  initialProducts: Product[];
  themes: string[];
}

export default function ProductsClient({ initialProducts, themes }: ProductsClientProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredProducts = initialProducts.filter(p => {
    if (selectedType !== 'all' && p.productType !== selectedType) return false;
    
    if (selectedTheme !== 'all') {
      const pThemes = p.tags?.map(t => t.toLowerCase()) || [];
      const titleThemeMatch = p.title.toLowerCase().includes(selectedTheme.toLowerCase());
      const hasThemeTag = pThemes.some(t => t.includes(selectedTheme.toLowerCase()));
      if (!titleThemeMatch && !hasThemeTag) return false;
    }
    
    return true;
  });

  const productTypes = [
    { id: 'all', label: 'All Products' },
    { id: 'activity', label: 'Activity Books' },
    { id: 'reusable', label: 'Reusable Books' },
    { id: 'return-gift', label: 'Return Gifts' },
  ];

  return (
    <div className="bg-bg-cream min-h-screen">
      {/* Header Banner */}
      <div className="bg-honey-yellow py-12 lg:py-16 mb-8 lg:mb-12 rounded-b-[3rem] shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-text-dark-brown/5 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-text-dark-brown font-heading mb-4">Explore All Products</h1>
          <p className="text-lg lg:text-xl text-text-dark-brown/80 font-medium">Find the perfect personalised gift or learning activity.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pb-20">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6 flex items-center justify-between">
           <p className="text-text-slate font-medium text-sm">Showing {filteredProducts.length} products</p>
           <Button variant="outline" size="sm" onClick={() => setIsMobileFiltersOpen(true)} className="gap-2">
             <Filter className="w-4 h-4" /> Filters
           </Button>
        </div>

        {/* Mobile Horizontal Pills (Themes quick filter) */}
        <div className="md:hidden flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
           <button 
             onClick={() => setSelectedTheme('all')}
             className={`flex-none px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedTheme === 'all' ? 'bg-text-dark-brown text-white' : 'bg-white border border-honey-light/50 text-text-charcoal'}`}
           >
             All Themes
           </button>
           {themes.slice(0, 5).map(theme => (
             <button 
               key={theme}
               onClick={() => setSelectedTheme(theme)}
               className={`flex-none px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedTheme === theme ? 'bg-text-dark-brown text-white' : 'bg-white border border-honey-light/50 text-text-charcoal'}`}
             >
               {theme}
             </button>
           ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Desktop Sidebar Filters */}
          <div className={`
            fixed inset-0 z-50 bg-white md:bg-transparent md:relative md:w-64 lg:w-72 flex-shrink-0 transition-transform duration-300 md:transform-none
            ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
            <div className="h-full flex flex-col md:block bg-white md:bg-white md:p-6 md:rounded-3xl md:shadow-sm md:border border-honey-light/50 md:sticky top-28 overflow-y-auto">
              
              {/* Mobile Filter Header */}
              <div className="flex md:hidden items-center justify-between p-4 border-b border-honey-light/50 sticky top-0 bg-white z-10">
                <h2 className="font-bold text-text-dark-brown text-lg font-heading">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-text-slate">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4 md:p-0">
                <h2 className="hidden md:block font-extrabold text-text-dark-brown text-xl mb-6 font-heading">Filters</h2>
                
                <div className="mb-8">
                  <h3 className="font-bold text-text-slate mb-4 text-xs uppercase tracking-wider">Product Type</h3>
                  <div className="space-y-3">
                    {productTypes.map(type => (
                      <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedType === type.id ? 'bg-honey-yellow border-honey-yellow text-white' : 'border-slate-300 group-hover:border-honey-yellow'}`}>
                          {selectedType === type.id && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input 
                          type="radio" 
                          name="type" 
                          checked={selectedType === type.id}
                          onChange={() => setSelectedType(type.id)}
                          className="sr-only"
                        />
                        <span className={`font-medium transition-colors ${selectedType === type.id ? 'text-text-dark-brown font-bold' : 'text-text-slate group-hover:text-text-charcoal'}`}>
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-text-slate mb-4 text-xs uppercase tracking-wider">Themes</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTheme === 'all' ? 'bg-honey-yellow border-honey-yellow text-white' : 'border-slate-300 group-hover:border-honey-yellow'}`}>
                         {selectedTheme === 'all' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <input 
                        type="radio" 
                        name="theme" 
                        checked={selectedTheme === 'all'}
                        onChange={() => setSelectedTheme('all')}
                        className="sr-only"
                      />
                      <span className={`font-medium transition-colors ${selectedTheme === 'all' ? 'text-text-dark-brown font-bold' : 'text-text-slate group-hover:text-text-charcoal'}`}>
                        All Themes
                      </span>
                    </label>
                    {themes.map(theme => (
                      <label key={theme} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTheme === theme ? 'bg-honey-yellow border-honey-yellow text-white' : 'border-slate-300 group-hover:border-honey-yellow'}`}>
                          {selectedTheme === theme && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input 
                          type="radio" 
                          name="theme" 
                          checked={selectedTheme === theme}
                          onChange={() => setSelectedTheme(theme)}
                          className="sr-only"
                        />
                        <span className={`font-medium transition-colors ${selectedTheme === theme ? 'text-text-dark-brown font-bold' : 'text-text-slate group-hover:text-text-charcoal'}`}>
                          {theme}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:hidden mt-auto p-4 border-t border-honey-light/50">
                <Button variant="primary" className="w-full" onClick={() => setIsMobileFiltersOpen(false)}>
                  Show {filteredProducts.length} Results
                </Button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="hidden md:flex mb-8 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-honey-light/50">
              <p className="text-text-charcoal font-bold">
                Showing <span className="text-honey-amber">{filteredProducts.length}</span> products
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border border-honey-light/50 shadow-sm mt-8">
                <span className="text-6xl mb-6 block">🍯</span>
                <h3 className="text-2xl font-extrabold text-text-dark-brown mb-3 font-heading">No products found</h3>
                <p className="text-text-slate mb-8 max-w-md mx-auto">We couldn't find any products matching your current filters. Try adjusting them to see more results.</p>
                <Button 
                  variant="secondary"
                  onClick={() => {setSelectedType('all'); setSelectedTheme('all'); setIsMobileFiltersOpen(false);}}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
