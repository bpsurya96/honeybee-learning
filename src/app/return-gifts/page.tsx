import { getProductsByCategory } from '@/lib/data';
import ReturnGiftsClient from './ReturnGiftsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Birthday Return Gifts Calculator | HoneyBee Learning',
  description: 'Find the perfect personalised birthday return gifts for kids. Packs starting at ₹25. Educational, meaningful, and fun!',
};

export default async function ReturnGiftsPage() {
  const returnGifts = await getProductsByCategory('return-gift');
  
  // Sort from lowest price to highest
  const sortedGifts = [...returnGifts].sort((a, b) => a.price - b.price);

  return <ReturnGiftsClient gifts={sortedGifts} />;
}
