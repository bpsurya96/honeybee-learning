const fs = require('fs');

function fixFile(file, replacements) {
  let content = fs.readFileSync(file, 'utf8');
  for (const [badLine, goodLine] of Object.entries(replacements)) {
    content = content.replace(badLine, goodLine);
  }
  fs.writeFileSync(file, content, 'utf8');
}

fixFile('src/app/page.tsx', {
  'emoji: "ðŸ¦ ",': 'emoji: "🦁",',
  'emoji: "ðŸ ‹",': 'emoji: "🐳",',
  'emoji: "ðŸ§šâ€ â™€ï¸ ",': 'emoji: "🧚‍♀️",',
  '<span className="text-3xl">ðŸ– ï¸ </span>': '<span className="text-3xl">🖍️</span>',
  '<TrustBadge icon="ðŸ  "': '<TrustBadge icon="🐝"',
  'icon: "ðŸ–¨ï¸ "': 'icon: "🖨️"',
  '<span className="text-4xl mb-4">ðŸ †</span>': '<span className="text-4xl mb-4">🏆</span>'
});

fixFile('src/components/layout/Header.tsx', {
  '<span className="text-3xl md:text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">ðŸ  </span>': '<span className="text-3xl md:text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🐝</span>',
  '<span className="text-3xl">ðŸ  </span>': '<span className="text-3xl">🐝</span>'
});

fixFile('src/app/products/[id]/ProductDetailClient.tsx', {
  "What's Inside The Box? ðŸŽ ": "What's Inside The Box? 🎁"
});

console.log("Fixed remaining emojis!");
