const fs = require('fs');
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

layout = layout.replace(
  'export const metadata: Metadata = {',
  `export const metadata: Metadata = {
  metadataBase: new URL('https://honeybeelearning.co.in'),`
);

fs.writeFileSync('src/app/layout.tsx', layout, 'utf8');
console.log("Added metadataBase to layout.tsx");
