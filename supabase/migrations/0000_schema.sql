-- Create custom types if they don't exist
DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('individual', 'school_wholesale');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('initiated', 'success', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables sequentially to avoid dependency issues
DROP TABLE IF EXISTS public.debug_logs CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.notifications_log CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.order_activity CASCADE;
DROP TABLE IF EXISTS public.order_modification_requests CASCADE;
DROP TABLE IF EXISTS public.order_files CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.organisations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.carts CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.enquiries CASCADE;


-- Profiles Table (Extends Supabase Auth users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  auth_user_id UUID, -- For easy reference if needed
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  account_type account_type DEFAULT 'individual'::account_type NOT NULL,
  role user_role DEFAULT 'customer'::user_role NOT NULL,
  status TEXT DEFAULT 'active',
  is_profile_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organisations Table (For Schools & Wholesale)
CREATE TABLE public.organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  organisation_name TEXT NOT NULL,
  organisation_type TEXT NOT NULL,
  gst_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  order_number TEXT UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  status order_status DEFAULT 'pending',
  shipping_address JSONB,
  billing_address JSONB,
  payment_method TEXT,
  is_paid BOOLEAN DEFAULT false,
  notes TEXT,
    age_group TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  child_name TEXT,
  child_gender TEXT,
  child_age INTEGER,
  child_photo_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Files (PDF Delivery)
CREATE TABLE public.order_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL, 
  version INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'pending_approval', 
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modification Requests
CREATE TABLE public.order_modification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
  file_id UUID REFERENCES public.order_files(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES public.profiles(id),
  modification_number INTEGER NOT NULL, 
  request_text TEXT NOT NULL,
  status TEXT DEFAULT 'pending', 
  admin_notes TEXT,
    age_group TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure modification number is 1 or 2
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

-- Debug Logs Table (For tracking silent auth failures)
CREATE TABLE IF NOT EXISTS public.debug_logs (
  id serial primary key,
  error_message text,
  error_detail text,
  created_at timestamp default now()
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
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_order_files_updated_at BEFORE UPDATE ON public.order_files FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_order_modification_requests_updated_at BEFORE UPDATE ON public.order_modification_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Secure function to check if user is admin (Bypasses RLS to avoid infinite recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- Row Level Security (RLS) setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_modification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());

-- Organisations Policies
CREATE POLICY "Users can view own organisation" ON public.organisations FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can insert own organisation" ON public.organisations FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Users can update own organisation" ON public.organisations FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "Admins can view all organisations" ON public.organisations FOR SELECT USING (public.is_admin());

-- Orders Policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all orders" ON public.orders FOR ALL USING (public.is_admin());

-- Order Items Policies
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON public.order_items FOR ALL USING (public.is_admin());

-- Order Files Policies
CREATE POLICY "Users can view own order files" ON public.order_files FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_files.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can view and insert order files" ON public.order_files FOR ALL USING (public.is_admin());

-- Order Modification Requests Policies
CREATE POLICY "Users can view own modification requests" ON public.order_modification_requests FOR SELECT USING (
  requested_by = auth.uid()
);
CREATE POLICY "Users can insert own modification requests" ON public.order_modification_requests FOR INSERT WITH CHECK (
  requested_by = auth.uid()
);
CREATE POLICY "Admins can view and update modification requests" ON public.order_modification_requests FOR ALL USING (public.is_admin());

-- Order Activity Policies
CREATE POLICY "Users can view own order activity" ON public.order_activity FOR SELECT USING (
  user_id = auth.uid()
);
CREATE POLICY "System can insert order activity" ON public.order_activity FOR INSERT WITH CHECK (
  user_id = auth.uid() OR public.is_admin()
);
CREATE POLICY "Admins can view all order activity" ON public.order_activity FOR SELECT USING (public.is_admin());

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_is_complete BOOLEAN := false;
  v_account_type account_type := 'individual'::account_type;
BEGIN
  BEGIN
    -- Determine account type
    IF new.raw_user_meta_data->>'account_type' IS NOT NULL THEN
      v_account_type := (new.raw_user_meta_data->>'account_type')::account_type;
    END IF;

    -- Determine if signup is complete
    IF new.raw_user_meta_data->>'is_signup_complete' = 'true' THEN
      v_is_complete := true;
    END IF;

    INSERT INTO public.profiles (
      id, auth_user_id, email, full_name, avatar_url, phone, account_type, username, is_profile_complete
    )
    VALUES (
      new.id, 
      new.id,
      new.email, 
      NULLIF(COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), ''), 
      NULLIF(COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'), ''),
      NULLIF(new.raw_user_meta_data->>'phone', ''),
      v_account_type,
      NULLIF(new.raw_user_meta_data->>'username', ''),
      v_is_complete
    );

    -- If business and provided organisation details, insert into organisations table
    IF v_account_type = 'school_wholesale' AND NULLIF(new.raw_user_meta_data->>'organisation_name', '') IS NOT NULL THEN
      INSERT INTO public.organisations (
        profile_id, organisation_name, organisation_type, gst_number, address, city, state, pincode
      )
      VALUES (
        new.id,
        new.raw_user_meta_data->>'organisation_name',
        new.raw_user_meta_data->>'organisation_type',
        new.raw_user_meta_data->>'gst_number',
        new.raw_user_meta_data->>'address',
        new.raw_user_meta_data->>'city',
        new.raw_user_meta_data->>'state',
        new.raw_user_meta_data->>'pincode'
      );
    END IF;

  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.debug_logs (error_message, error_detail)
    VALUES (SQLERRM, SQLSTATE);
  END;
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
DROP POLICY IF EXISTS "Users can view their own order files" ON storage.objects;
CREATE POLICY "Users can view their own order files" ON storage.objects FOR SELECT USING (
  bucket_id = 'order-files' AND 
  auth.uid() = (
    SELECT user_id FROM public.orders WHERE id = (storage.objects.metadata->>'order_id')::uuid
  )
);

DROP POLICY IF EXISTS "Admins can manage order files" ON storage.objects;
CREATE POLICY "Admins can manage order files" ON storage.objects FOR ALL USING (
  bucket_id = 'order-files' AND public.is_admin()
);

-- ========================================================
-- Enquiries Table
-- ========================================================
CREATE TABLE public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    details JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'PENDING'
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_policies WHERE policyname = 'Anyone can insert enquiries' AND tablename = 'enquiries'
    ) THEN
        CREATE POLICY "Anyone can insert enquiries" 
            ON public.enquiries FOR INSERT 
            WITH CHECK (true);
    END IF;
END
$$;

CREATE POLICY "Admins can view enquiries" 
    ON public.enquiries FOR SELECT 
    USING (public.is_admin());

CREATE POLICY "Admins can update enquiries" 
    ON public.enquiries FOR UPDATE
    USING (public.is_admin());
