
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types/product';

// Map database fields to the Product type expected by the frontend
function mapProduct(row: any): Product {
  return {
    ...row,
    id: row.id,
    title: row.title,
    price: row.price,
    productType: row.type,
    image: row.image_url,
    images: row.images || [],
    shortDesc: row.description,
    fullDesc: row.full_description,
    tags: row.tags || [],
    keywords: row.keywords || [],
    ...row.metadata // Splat godCharacter, badge, lesson, etc. onto the root object
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data.map(mapProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getAllProducts();
  if (category === 'all') return all;
  return all.filter(p => p.productType === category);
}

export async function extractThemes(): Promise<string[]> {
  const products = await getAllProducts();
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

export async function getProductById(id: string | number): Promise<Product | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !data) return undefined;
  return mapProduct(data);
}
