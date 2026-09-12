CREATE TABLE IF NOT EXISTS public.enquiries (
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
