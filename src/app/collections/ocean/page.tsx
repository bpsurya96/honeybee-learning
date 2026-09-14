export const dynamic = 'force-dynamic';

import { getAllProducts } from '@/lib/data';
import OceanClient from './OceanClient';

export default async function OceanCollectionPage() {
  const allProducts = await getAllProducts();
  const oceanProducts = allProducts.filter(p => 
    p.title.toLowerCase().includes('ocean') || 
    p.tags?.some(tag => tag.toLowerCase().includes('ocean')) ||
    p.keywords?.some(kw => kw.toLowerCase().includes('ocean'))
  );

  return <OceanClient oceanProducts={oceanProducts} />;
}