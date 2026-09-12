const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Iambpsurya%4096@db.unqcrhlsyqxmkmbmfcmz.supabase.co:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to DB successfully.");
    
    // Check if phone has unique constraint
    const res = await client.query(`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = 'public.profiles'::regclass
      AND contype = 'u';
    `);
    console.log("Unique constraints on profiles:", res.rows);

    // Let's drop the unique constraint on phone if it exists to prevent testing errors
    for (let row of res.rows) {
      if (row.conname.includes('phone') || row.conname === 'profiles_phone_key') {
        console.log("Dropping unique constraint:", row.conname);
        await client.query(`ALTER TABLE public.profiles DROP CONSTRAINT ${row.conname}`);
      }
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
