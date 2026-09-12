const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const sql = fs.readFileSync('supabase/migrations/0000_schema.sql', 'utf8');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(sql);
  console.log('Migration completed successfully.');
  await client.end();
}
run().catch(console.error);
