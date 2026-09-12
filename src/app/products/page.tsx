import { getAllProducts, extractThemes } from '@/lib/data';
import ProductsClient from './ProductsClient';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'All Products | HoneyBee Learning',
  description: 'Explore our full range of personalised activity books, flashcards, reusable worksheets, and birthday return gifts.',
};

export default function ProductsPage() {
  const allProducts = getAllProducts();
  const themes = extractThemes(allProducts);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-bg-cream text-honey-amber font-bold text-xl">Loading amazing products...</div>}>
      <ProductsClient initialProducts={allProducts} themes={themes} />
    </Suspense>
  );
}
