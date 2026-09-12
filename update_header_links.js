const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');

// Replace all instances of Link href={`/login?next=${pathname}`} that wrap a Button with Sign Up
content = content.replace(
  /<Link href=\{\`\/login\?next=\$\{pathname\}\`\}>\s*<Button variant="primary"(.*?)>Sign Up<\/Button>\s*<\/Link>/g,
  '<Link href="/register">\n                    <Button variant="primary"$1>Sign Up</Button>\n                  </Link>'
);

fs.writeFileSync('src/components/layout/Header.tsx', content, 'utf8');
console.log("Updated ALL Header Sign Up links");
