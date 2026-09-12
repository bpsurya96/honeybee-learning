const fs = require('fs');
let page = fs.readFileSync('src/app/products/[id]/page.tsx', 'utf8');

const oldMeta = `  return {
    title: \`\${product.seoTitle || product.title} | HoneyBee Learning\`,
    description: product.metaDescription || product.shortDesc,
  };`;

const newMeta = `  const imageUrl = product.images?.[0] || '/og-image.jpg';
  
  return {
    title: \`\${product.seoTitle || product.title} | HoneyBee Learning\`,
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
  };`;

page = page.replace(oldMeta, newMeta);
fs.writeFileSync('src/app/products/[id]/page.tsx', page, 'utf8');
console.log("Updated product page SEO metadata");
