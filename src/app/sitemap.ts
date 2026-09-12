import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://honeybeelearning.co.in';
  
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/products',
    '/collections/ocean',
    '/collections/divine-stories',
    '/return-gifts',
    '/schools',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic product routes
  const products = getAllProducts();
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
