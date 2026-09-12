const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function fetchLogs() {
  const { data, error } = await supabase.from("debug_logs").select("*").order("created_at", { ascending: false }).limit(5);
  console.log("Error:", error);
  console.log("Data:", data);
}
fetchLogs();
