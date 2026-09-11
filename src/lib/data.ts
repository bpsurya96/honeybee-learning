import { Product } from '@/types/product';
import productsActivity from '../data/products_activity.json';
import productsReusable from '../data/products_reusable.json';
import productsStories from '../data/products_stories.json';
import productsOther from '../data/products_other.json';
import returnGifts from '../data/return-gifts.json';

export function getAllProducts(): Product[] {
  const allProducts: Product[] = [];
  
  productsActivity.forEach((p: any) => {
    allProducts.push({
      ...p,
      productType: 'activity'
    });
  });

  productsReusable.forEach((p: any) => {
    allProducts.push({
      ...p,
      productType: 'reusable'
    });
  });

  productsStories.forEach((p: any) => {
    allProducts.push({
      ...p,
      productType: 'stories'
    });
  });

  productsOther.forEach((p: any) => {
    allProducts.push({
      ...p,
      productType: 'other'
    });
  });

  returnGifts.forEach((p: any) => {
    allProducts.push({
      id: p.id,
      title: p.name,
      price: p.price,
      image: '',
      fallbackEmoji: p.emoji,
      shortDesc: p.items?.join(', '),
      productType: 'return-gift',
      badge: p.mrpLabel,
      badgeType: p.category,
      tags: p.hasCandy ? ['Candy Included'] : [],
      ...p
    });
  });

  return allProducts;
}

export function getProductsByCategory(category: string): Product[] {
  const all = getAllProducts();
  if (category === 'all') return all;
  return all.filter(p => p.productType === category);
}

export function extractThemes(products: Product[]): string[] {
  const themes = new Set<string>();
  products.forEach(p => {
    if (p.tags) {
      p.tags.forEach(tag => {
        if (tag.toLowerCase().includes('theme')) {
          themes.add(tag.replace(/[^\w\s]/gi, '').trim());
        }
      });
    }
    if (p.title.toLowerCase().includes('theme')) {
      const match = p.title.match(/([\w\s]+) Theme/i);
      if (match && match[1]) {
        themes.add(match[1].trim() + ' Theme');
      }
    }
  });
  return Array.from(themes);
}

export function getProductById(id: string | number): Product | undefined {
  const all = getAllProducts();
  return all.find(p => p.id.toString() === id.toString());
}
