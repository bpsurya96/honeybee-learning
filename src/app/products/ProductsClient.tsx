'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ui/ProductCard';

interface ProductsClientProps {
  initialProducts: Product[];
  themes: string[];
}

export default function ProductsClient({ initialProducts, themes }: ProductsClientProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');

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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Explore All Products</h1>
        <p className="text-lg text-slate-600">Find the perfect personalised gift or learning activity.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 sticky top-24">
            <h2 className="font-bold text-slate-800 text-lg mb-4">Filters</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">Product Type</h3>
              <div className="space-y-2">
                {['all', 'activity', 'reusable', 'stories', 'return-gift'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={selectedType === type}
                      onChange={() => setSelectedType(type)}
                      className="accent-primary"
                    />
                    <span className="text-slate-600 capitalize">{type.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">Themes</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="theme" 
                    checked={selectedTheme === 'all'}
                    onChange={() => setSelectedTheme('all')}
                    className="accent-primary"
                  />
                  <span className="text-slate-600">All Themes</span>
                </label>
                {themes.map(theme => (
                  <label key={theme} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="theme" 
                      checked={selectedTheme === theme}
                      onChange={() => setSelectedTheme(theme)}
                      className="accent-primary"
                    />
                    <span className="text-slate-600">{theme}</span>
                  </label>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-slate-600 font-medium">
              Showing {filteredProducts.length} products
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-amber-50 rounded-2xl">
              <span className="text-5xl mb-4 block">🍯</span>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
              <p className="text-slate-600">Try adjusting your filters to see more results.</p>
              <button 
                onClick={() => {setSelectedType('all'); setSelectedTheme('all');}}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
