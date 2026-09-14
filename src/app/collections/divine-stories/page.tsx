export const dynamic = 'force-dynamic';

import { getAllProducts } from '@/lib/data';
import DivineStoriesClient from './DivineStoriesClient';

export default async function DivineStoriesCollectionPage() {
  const allProducts = await getAllProducts();
  const divineProducts = allProducts.filter(p => p.productType === 'stories');

  return <DivineStoriesClient divineProducts={divineProducts} />;
}