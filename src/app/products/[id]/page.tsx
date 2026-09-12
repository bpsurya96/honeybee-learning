import { getProductById, getAllProducts } from '@/lib/data';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const id = (await params).id;
  const product = getProductById(id);
  if (!product) return { title: 'Not Found' };
  
  const imageUrl = product.images?.[0] || '/og-image.jpg';
  
  return {
    title: `${product.seoTitle || product.title} | HoneyBee Learning`,
    description: product.metaDescription || product.shortDesc,
    openGraph: {
      title: product.seoTitle || product.title,
      description: product.metaDescription || product.shortDesc,
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seoTitle || product.title,
      description: product.metaDescription || product.shortDesc,
      images: [imageUrl],
    }
  };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const product = getProductById(id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
