const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');

// Replace the specific Sign Up link target
content = content.replace(
  '<Link href={`/login?next=${pathname}`}>\n                    <Button variant="primary" size="sm" className="px-5">Sign Up</Button>\n                  </Link>',
  '<Link href="/register">\n                    <Button variant="primary" size="sm" className="px-5">Sign Up</Button>\n                  </Link>'
);

fs.writeFileSync('src/components/layout/Header.tsx', content, 'utf8');
console.log("Updated Header Sign Up link");
