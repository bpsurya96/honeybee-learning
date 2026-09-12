const fs = require('fs');
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

const oldMetadata = `export const metadata: Metadata = {
  title: "HoneyBee Learning | Premium Kids Activity Books",
  description: "India's first personalised activity book for kids.",
};`;

const newMetadata = `export const metadata: Metadata = {
  title: "HoneyBee Learning | Premium Kids Activity Books",
  description: "India's first personalised activity book for kids. Educational, fun, and completely customised for your child.",
  openGraph: {
    title: "HoneyBee Learning",
    description: "Personalised Activity Books for Kids",
    url: 'https://honeybeelearning.co.in',
    siteName: 'HoneyBee Learning',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HoneyBee Learning Activity Books',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HoneyBee Learning | Premium Kids Activity Books',
    description: "India's first personalised activity book for kids.",
    images: ['/og-image.jpg'],
  },
};`;

layout = layout.replace(oldMetadata, newMetadata);
fs.writeFileSync('src/app/layout.tsx', layout, 'utf8');
console.log("Updated global metadata in layout.tsx");
