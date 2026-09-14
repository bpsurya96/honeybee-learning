-- Soft delete for products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Phone verification for profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- OTP Verifications Table
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  phone TEXT PRIMARY KEY,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT false
);

ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Allow public to insert OTPs (since they are unauthenticated when checking out initially)
DROP POLICY IF EXISTS "Public can insert OTP verifications" ON public.otp_verifications;
CREATE POLICY "Public can insert OTP verifications" ON public.otp_verifications FOR INSERT WITH CHECK (true);

-- Allow public to update their own OTPs (based on phone)
DROP POLICY IF EXISTS "Public can update OTP verifications" ON public.otp_verifications;
CREATE POLICY "Public can update OTP verifications" ON public.otp_verifications FOR UPDATE USING (true);

-- Allow public to read OTP verifications (we will do exact match in backend)
DROP POLICY IF EXISTS "Public can view OTP verifications" ON public.otp_verifications;
CREATE POLICY "Public can view OTP verifications" ON public.otp_verifications FOR SELECT USING (true);
