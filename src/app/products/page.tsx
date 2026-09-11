import { getAllProducts, extractThemes } from '@/lib/data';
import ProductsClient from './ProductsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products | HoneyBee Learning',
  description: 'Explore our full range of personalised activity books, flashcards, reusable worksheets, and birthday return gifts.',
};

export default function ProductsPage() {
  const allProducts = getAllProducts();
  const themes = extractThemes(allProducts);

  return <ProductsClient initialProducts={allProducts} themes={themes} />;
}
