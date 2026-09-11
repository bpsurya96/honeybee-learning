import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/api/'],
    },
    sitemap: 'https://honeybeelearning.co.in/sitemap.xml',
  };
}
