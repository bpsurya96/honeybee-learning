require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateImages() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, type')
    .eq('type', 'return-gift');
  
  if (error) {
    console.error("Fetch Error:", error);
    return;
  }
  
  console.log(`Found ${products.length} return gifts.`);

  for (const product of products) {
    let newImage = '/images/mini_fun_pack.jpg'; // default

    const titleLower = product.title.toLowerCase();
    
    if (titleLower.includes('premium') || titleLower.includes('celebration') || titleLower.includes('high value') || titleLower.includes('combo')) {
      newImage = '/images/premium_celebration_pack.jpg';
    } else if (titleLower.includes('colour') || titleLower.includes('creative')) {
      newImage = '/images/colour_creative_pack.jpg';
    } else if (titleLower.includes('activity') || titleLower.includes('worksheet') || titleLower.includes('learner') || titleLower.includes('practice')) {
      newImage = '/images/activity_book_pack.jpg';
    } else if (titleLower.includes('mini') || titleLower.includes('little')) {
      newImage = '/images/mini_fun_pack.jpg';
    }

    console.log(`Updating ${product.title} -> ${newImage}`);
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: newImage })
      .eq('id', product.id);

    if (updateError) {
      console.error(`Failed to update ${product.title}:`, updateError);
    }
  }

  console.log("Finished updating return gift images!");
}

migrateImages();
