const fs = require('fs');
const path = require('path');

const replacements = {
  'ðŸ¦–': '🦖',
  'ðŸš€': '🚀',
  'ðŸ¦ ': '🦁',
  'ðŸ ‹': '🐳',
  'ðŸ¦š': '🦚',
  'ðŸ§šâ€ â™€ï¸ ': '🧚‍♀️',
  'ðŸŽ¨': '🎨',
  'ðŸ“š': '📚',
  'ðŸ– ï¸ ': '🖍️',
  'ðŸ  ': '🐝',
  'ðŸ‡®ðŸ‡³': '🇮🇳',
  'ðŸ’›': '💛',
  'ðŸ““': '📓',
  'ðŸŒŸ': '🌟',
  'ðŸ–¨ï¸ ': '🖨️',
  'ðŸŽ“': '🎓',
  'ðŸ †': '🏆',
  'ðŸ“¸': '📸',
  'ðŸŽ ': '🎁'
};

const filesToFix = [
  'src/app/page.tsx',
  'src/components/layout/Header.tsx',
  'src/app/products/[id]/ProductDetailClient.tsx'
];

filesToFix.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [bad, good] of Object.entries(replacements)) {
    content = content.split(bad).join(good);
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Fixed ${file}`);
});
