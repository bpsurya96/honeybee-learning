const fs = require('fs');

// 1. Header.tsx
let header = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');
header = header.replace(
  "{ href: '/products', label: 'Activity Books' },",
  "{ href: '/products', label: 'Activity Books' },\n    { href: '/collections/divine-stories', label: 'Divine Stories' },\n    { href: '/collections/ocean', label: 'Ocean Kits' },"
);
fs.writeFileSync('src/components/layout/Header.tsx', header, 'utf8');

// 2. ProductDetailClient.tsx
let pd = fs.readFileSync('src/app/products/[id]/ProductDetailClient.tsx', 'utf8');
if (!pd.includes("import confetti")) {
  pd = pd.replace("import { Button } from '@/components/ui/Button';", "import { Button } from '@/components/ui/Button';\nimport confetti from 'canvas-confetti';");
  const confettiCode = `
    addItem({
      productId: product.id,
      title: product.title,
      price: displayPrice,
      quantity: 1,
      image: activeImage,
      childName: childName.trim() !== '' ? childName : undefined,
      isReturnGift: isReturnGift
    });

    // Fire Confetti!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444'],
      zIndex: 100
    });
`;
  pd = pd.replace(/addItem\(\{[\s\S]*?\}\);/, confettiCode);
  fs.writeFileSync('src/app/products/[id]/ProductDetailClient.tsx', pd, 'utf8');
}

// 3. page.tsx
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
if (!page.includes("MediaReviews")) {
  page = page.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport MediaReviews from '@/components/ui/MediaReviews';");
  page = page.replace('<section className="bg-honey-yellow py-20 relative overflow-hidden">', '<MediaReviews />\n\n      <section className="bg-honey-yellow py-20 relative overflow-hidden">');
  fs.writeFileSync('src/app/page.tsx', page, 'utf8');
}
console.log("Restored all changes safely.");
