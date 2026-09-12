const fs = require('fs');
const triggerSql = `

-- Handle new user registration (Google OAuth, Email Signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, auth_user_id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;

let content = fs.readFileSync('supabase/migrations/0000_schema.sql', 'utf8');
if (!content.includes('handle_new_user')) {
    fs.appendFileSync('supabase/migrations/0000_schema.sql', triggerSql);
    console.log("Trigger added to schema.sql");
} else {
    console.log("Trigger already exists.");
}
