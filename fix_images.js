const fs = require('fs');
const path = require('path');

// A 1x1 transparent PNG buffer
const dummyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

const dataDir = path.join(__dirname, 'src', 'data');
const publicDir = path.join(__dirname, 'public');

let totalCreated = 0;

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function processJsonFile(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Some files might be arrays, some might be objects. 
    // Assuming mostly arrays based on standard product structures.
    const products = Array.isArray(data) ? data : (data.products || data.items || []);
    
    products.forEach(product => {
      const allImages = [];
      if (product.image) allImages.push(product.image);
      if (product.images && Array.isArray(product.images)) {
        allImages.push(...product.images);
      }
      
      allImages.forEach(img => {
        if (!img) return;
        
        // Remove leading slash if present
        const cleanPath = img.startsWith('/') ? img.substring(1) : img;
        const fullPath = path.join(publicDir, cleanPath);
        
        if (!fs.existsSync(fullPath)) {
          ensureDirSync(path.dirname(fullPath));
          fs.writeFileSync(fullPath, dummyPng);
          totalCreated++;
        }
      });
    });
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

if (fs.existsSync(dataDir)) {
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  files.forEach(file => {
    processJsonFile(path.join(dataDir, file));
  });
  console.log(`Successfully created ${totalCreated} missing dummy images in the public folder!`);
} else {
  console.log('Data directory not found.');
}
