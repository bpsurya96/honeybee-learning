const fs = require('fs');

// 1. Update /schools/page.tsx
let schoolsPage = fs.readFileSync('src/app/schools/page.tsx', 'utf8');
schoolsPage = schoolsPage.replace(
  '<Link href="/register" className="btn-primary text-lg">',
  '<Link href="/register?type=school_wholesale" className="btn-primary text-lg">'
);
fs.writeFileSync('src/app/schools/page.tsx', schoolsPage, 'utf8');

// 2. Update /register/page.tsx
let registerPage = fs.readFileSync('src/app/register/page.tsx', 'utf8');
registerPage = registerPage.replace(
  "const [accountType, setAccountType] = useState<'individual' | 'school_wholesale' | null>(null);",
  "const [accountType, setAccountType] = useState<'individual' | 'school_wholesale' | null>(null);"
);
// Wait, useSearchParams is used later in the component. We can just set it in a useEffect.
registerPage = registerPage.replace(
  "const next = searchParams.get('next') || '/my-orders';",
  "const next = searchParams.get('next') || '/my-orders';\n  const typeParam = searchParams.get('type');\n  \n  import('react').then(React => {\n    React.useEffect(() => {\n      if (typeParam === 'school_wholesale' && !accountType) {\n        setAccountType('school_wholesale');\n      }\n    }, [typeParam]);\n  });"
);
// Actually a cleaner way is just use useEffect directly since React is imported
registerPage = registerPage.replace(
  "import { useState, Suspense } from 'react';",
  "import { useState, Suspense, useEffect } from 'react';"
);
// Undo the messy replace above and do it properly
let cleanRegisterPage = fs.readFileSync('src/app/register/page.tsx', 'utf8');
cleanRegisterPage = cleanRegisterPage.replace(
  "import { useState, Suspense } from 'react';",
  "import { useState, Suspense, useEffect } from 'react';"
);
cleanRegisterPage = cleanRegisterPage.replace(
  "const next = searchParams.get('next') || '/my-orders';",
  "const next = searchParams.get('next') || '/my-orders';\n  const typeParam = searchParams.get('type');\n  \n  useEffect(() => {\n    if (typeParam === 'school_wholesale' && !accountType) {\n      setAccountType('school_wholesale');\n    }\n  }, [typeParam]);"
);
fs.writeFileSync('src/app/register/page.tsx', cleanRegisterPage, 'utf8');

console.log("Updated schools link and register page initialization.");
