-- Reset schema if needed (optional if you want to drop existing)
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.notifications_log CASCADE;
DROP TABLE IF EXISTS public.alerts CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.order_activity CASCADE;
DROP TABLE IF EXISTS public.order_modification_requests CASCADE;
DROP TABLE IF EXISTS public.order_files CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.carts CASCADE;
DROP TABLE IF EXISTS public.organisations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS account_type CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS alert_severity CASCADE;
DROP TYPE IF EXISTS alert_status CASCADE;
DROP TYPE IF EXISTS notification_status CASCADE;
DROP TYPE IF EXISTS file_status CASCADE;
DROP TYPE IF EXISTS modification_status CASCADE;

-- Enums
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
CREATE TYPE account_type AS ENUM ('individual', 'school_wholesale');
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'ebook_ready', 
  'awaiting_customer_approval', 'modification_requested', 
  'approved', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'
);
CREATE TYPE payment_status AS ENUM ('initiated', 'pending', 'successful', 'failed', 'refunded');
CREATE TYPE file_status AS ENUM ('uploaded', 'available', 'superseded');
CREATE TYPE modification_status AS ENUM ('requested', 'in_review', 'accepted', 'in_progress', 'completed', 'rejected', 'cancelled');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE alert_status AS ENUM ('open', 'acknowledged', 'resolved');
CREATE TYPE notification_status AS ENUM ('queued', 'sent', 'delivered', 'failed');

-- Profiles Table (Extends Supabase Auth users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  auth_user_id UUID, -- For easy reference if needed
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  account_type account_type DEFAULT 'individual'::account_type NOT NULL,
  role user_role DEFAULT 'customer'::user_role NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organisations Table (For School/Wholesale)
CREATE TABLE public.organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  organisation_name TEXT NOT NULL,
  organisation_type TEXT,
  gst_number TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Carts Table
CREATE TABLE public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  organisation_id UUID REFERENCES public.organisations(id),
  order_type TEXT DEFAULT 'standard',
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'initiated',
  subtotal DECIMAL(10, 2),
  discount DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2),
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name_snapshot TEXT,
  unit_price DECIMAL(10, 2),
  quantity INT,
  total DECIMAL(10, 2),
  personalisation_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Files Table (For Ebooks/PDFs)
CREATE TABLE public.order_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
  file_type TEXT DEFAULT 'personalised_ebook',
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  version INT DEFAULT 1,
  status file_status DEFAULT 'uploaded',
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Modification Requests Table
CREATE TABLE public.order_modification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES public.profiles(id),
  modification_number INT NOT NULL, -- 1 or 2
  request_text TEXT NOT NULL,
  status modification_status DEFAULT 'requested',
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Constraint: Maximum 2 modifications per order
ALTER TABLE public.order_modification_requests 
ADD CONSTRAINT max_2_modifications CHECK (modification_number IN (1, 2));

-- Unique Constraint: Prevent duplicate modification numbers per order
ALTER TABLE public.order_modification_requests 
ADD CONSTRAINT unique_modification_number UNIQUE (order_id, modification_number);

-- Order Activity (Audit Trail)
CREATE TABLE public.order_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  actor_type TEXT, -- 'customer', 'admin', 'system'
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments Table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id),
  user_id UUID REFERENCES public.profiles(id),
  payment_provider TEXT DEFAULT 'phonepe',
  provider_transaction_id TEXT,
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'INR',
  status payment_status DEFAULT 'initiated',
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_organisations_updated_at BEFORE UPDATE ON public.organisations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_order_files_updated_at BEFORE UPDATE ON public.order_files FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_order_modification_requests_updated_at BEFORE UPDATE ON public.order_modification_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security (RLS) setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_modification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Organisations Policies
CREATE POLICY "Users can view own organisation" ON public.organisations FOR SELECT USING (
  profile_id = auth.uid()
);
CREATE POLICY "Admins can view all organisations" ON public.organisations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Users can insert own organisation" ON public.organisations FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Users can update own organisation" ON public.organisations FOR UPDATE USING (profile_id = auth.uid());

-- Orders Policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all orders" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Order Items Policies
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON public.order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Order Files Policies
CREATE POLICY "Users can view own order files" ON public.order_files FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_files.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can view and insert order files" ON public.order_files FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Order Modification Requests Policies
CREATE POLICY "Users can view own modification requests" ON public.order_modification_requests FOR SELECT USING (
  requested_by = auth.uid()
);
CREATE POLICY "Users can insert own modification requests" ON public.order_modification_requests FOR INSERT WITH CHECK (
  requested_by = auth.uid()
);
CREATE POLICY "Admins can view and update modification requests" ON public.order_modification_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Order Activity Policies
CREATE POLICY "Users can view own order activity" ON public.order_activity FOR SELECT USING (
  user_id = auth.uid()
);
CREATE POLICY "System can insert order activity" ON public.order_activity FOR INSERT WITH CHECK (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can view all order activity" ON public.order_activity FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, auth_user_id, email, full_name, phone, account_type)
  VALUES (
    new.id, 
    new.id,
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'phone',
    COALESCE((new.raw_user_meta_data->>'account_type')::account_type, 'individual'::account_type)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create Storage bucket for order files (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('order-files', 'order-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for order-files bucket
CREATE POLICY "Users can view their own order files" ON storage.objects FOR SELECT USING (
  bucket_id = 'order-files' AND 
  auth.uid() = (
    SELECT user_id FROM public.orders WHERE id = (storage.objects.metadata->>'order_id')::uuid
  )
);
CREATE POLICY "Admins can manage order files" ON storage.objects FOR ALL USING (
  bucket_id = 'order-files' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
