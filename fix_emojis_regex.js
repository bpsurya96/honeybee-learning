const fs = require('fs');

function replaceContext(file, replacements) {
  let content = fs.readFileSync(file, 'utf8');
  for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
  }
  fs.writeFileSync(file, content, 'utf8');
}

replaceContext('src/app/page.tsx', [
  [/emoji: "[^"]+", color: "bg-emerald-100"/, 'emoji: "🦖", color: "bg-emerald-100"'],
  [/emoji: "[^"]+", color: "bg-slate-800"/, 'emoji: "🚀", color: "bg-slate-800"'],
  [/emoji: "[^"]+", color: "bg-amber-100"/, 'emoji: "🦁", color: "bg-amber-100"'],
  [/emoji: "[^"]+", color: "bg-cyan-100"/, 'emoji: "🐳", color: "bg-cyan-100"'],
  [/emoji: "[^"]+", color: "bg-indigo-100"/, 'emoji: "🦚", color: "bg-indigo-100"'],
  [/emoji: "[^"]+", color: "bg-pink-100"/, 'emoji: "🧚‍♀️", color: "bg-pink-100"'],
  [/animationDuration: '4s' \}\}>[^<]+<\/div>/, "animationDuration: '4s' }}>🎨</div>"],
  [/<span className="text-6xl mb-4">[^<]+<\/span>/g, '<span className="text-6xl mb-4">📚</span>'], // Wait, there's multiple?
  [/<span className="text-3xl">[^<]+<\/span>/, '<span className="text-3xl">🖍️</span>'],
  [/<TrustBadge icon="[^"]+" label="1200\+ Happy Orders" \/>/, '<TrustBadge icon="🐝" label="1200+ Happy Orders" />'],
  [/<TrustBadge icon="[^"]+" label="Chennai-based" \/>/, '<TrustBadge icon="🇮🇳" label="Chennai-based" />'],
  [/icon: "[^"]+", color: "bg-accent-sky"/, 'icon: "🎨", color: "bg-accent-sky"'],
  [/icon: "[^"]+", color: "bg-accent-lavender"/, 'icon: "📚", color: "bg-accent-lavender"'],
  [/Pick a Theme They'll Love [^<]+<\/h2>/, "Pick a Theme They'll Love 💛</h2>"],
  [/<span className="text-slate-300 text-6xl">[^<]+<\/span>/, '<span className="text-slate-300 text-6xl">📓</span>'],
  [/<span className="text-6xl mb-2 block">[^<]+<\/span>/, '<span className="text-6xl mb-2 block">🌟</span>'],
  [/icon: "[^"]+" \}, \/\/ Choose Theme/, 'icon: "🎨" },'],
  [/desc: "Select from our wide range of educational themes.", icon: "[^"]+"/, 'desc: "Select from our wide range of educational themes.", icon: "🎨"'],
  [/desc: "We custom print and laminate every single page.", icon: "[^"]+"/, 'desc: "We custom print and laminate every single page.", icon: "🖨️"'],
  [/desc: "Delivered to your doorstep, ready for fun!", icon: "[^"]+"/, 'desc: "Delivered to your doorstep, ready for fun!", icon: "🚀"'],
  [/>[^<]+ Included in every book/, '>🎓 Included in every book'],
  [/<span className="text-4xl mb-4">[^<]+<\/span>/, '<span className="text-4xl mb-4">🏆</span>'],
  [/<span className="text-6xl text-slate-300">[^<]+<\/span>/, '<span className="text-6xl text-slate-300">📸</span>'],
]);

replaceContext('src/components/layout/Header.tsx', [
  [/<span className="text-3xl md:text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">[^<]+<\/span>/, '<span className="text-3xl md:text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🐝</span>'],
  [/<span className="text-3xl">[^<]+<\/span>/, '<span className="text-3xl">🐝</span>']
]);

replaceContext('src/app/products/[id]/ProductDetailClient.tsx', [
  [/What's Inside The Box\? [^<]+<\/h3>/, "What's Inside The Box? 🎁</h3>"]
]);

console.log("Replaced using regex context matching.");
