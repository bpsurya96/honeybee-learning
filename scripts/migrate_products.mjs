
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const filesToMigrate = [
  { path: 'src/data/products_stories.json', type: 'stories' },
  { path: 'src/data/products_activity.json', type: 'activity' },
  { path: 'src/data/products_reusable.json', type: 'reusable' },
  { path: 'src/data/products_other.json', type: 'other' },
  { path: 'src/data/return-gifts.json', type: 'return-gift' }
];

async function uploadImage(localRelativePath) {
  if (!localRelativePath) return null;
  const localImagePath = path.resolve(__dirname, '..', 'public', localRelativePath);
  
  if (!fs.existsSync(localImagePath)) {
    console.warn(`  ⚠️ Local image not found: ${localImagePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(localImagePath);
  const ext = path.extname(localImagePath); const fileName = `migrated-${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
  
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, fileBuffer, { contentType: 'image/jpeg' });

  if (error) {
    console.error(`  ❌ Failed to upload image: ${error.message}`);
    return null;
  }

  return supabase.storage.from('product-images').getPublicUrl(data.path).data.publicUrl;
}

async function migrate() {
  console.log("🚀 Starting Migration...");

  for (const fileDef of filesToMigrate) {
    console.log(`\n📂 Processing file: ${fileDef.path}`);
    const fullPath = path.resolve(__dirname, '..', fileDef.path);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ File not found: ${fileDef.path}, skipping.`);
      continue;
    }

    const products = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

    for (const item of products) {
      console.log(`\nMigrating product: ${item.title || item.name}`);
      
      // Upload Primary Image
      let primaryImageUrl = await uploadImage(item.image);

      // Upload Gallery Images
      let galleryUrls = [];
      if (item.images && Array.isArray(item.images)) {
        for (const imgPath of item.images) {
          const url = await uploadImage(imgPath);
          if (url) galleryUrls.push(url);
        }
      }

      // Extract Metadata
      const metadata = { ...item };
      // Remove known database columns from metadata payload
      delete metadata.id;
      delete metadata.title;
      delete metadata.name; // Return gifts use name instead of title sometimes
      delete metadata.price;
      delete metadata.image;
      delete metadata.images;
      delete metadata.shortDesc;
      delete metadata.fullDesc;
      delete metadata.tags;
      delete metadata.keywords;
      
      const { error: dbError } = await supabase.from('products').insert({
        title: item.title || item.name || 'Unnamed Product',
        description: item.shortDesc || '',
        full_description: item.fullDesc || '',
        price: item.price || 0,
        type: fileDef.type,
        image_url: primaryImageUrl,
        images: galleryUrls,
        tags: item.tags || [],
        keywords: item.keywords || [],
        metadata: metadata,
        is_active: true
      });

      if (dbError) {
        console.error(`  ❌ Database insertion failed: ${dbError.message}`);
      } else {
        console.log(`  ✅ Product inserted successfully.`);
      }
    }
  }
  console.log("\n🎉 Migration Complete!");
}

migrate();
