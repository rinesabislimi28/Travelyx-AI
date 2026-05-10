-- ==========================================
-- TRAVELYX-AI: FULL SUPABASE DATABASE SCHEMA
-- Execute this entirely in your Supabase SQL Editor if you need to recreate the database.
-- ==========================================

-- 1. FSHIJ TË VJETRËN PLOTËSISHT (Fshin tabelën dhe lejet e vjetra)
DROP TABLE IF EXISTS public.trips CASCADE;

-- 2. KRIJO TË RENË NGA FILLIMI TË PASTËR
CREATE TABLE public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    destination TEXT NOT NULL,
    budget TEXT,
    itinerary_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Aktivizo Sigurinë RLS
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- 4. KRIJIMI I TË 4 PËRDITËSIMEVE TË SIGURISË (SELECT, INSERT, DELETE, UPDATE)
CREATE POLICY "Users can view their own trips" 
ON public.trips FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips" 
ON public.trips FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" 
ON public.trips FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" 
ON public.trips FOR UPDATE 
USING (auth.uid() = user_id);


-- 1. Fshi lidhjen e vjetër kufizuese (Foreign Key)
ALTER TABLE public.trips 
DROP CONSTRAINT trips_user_id_fkey;

-- 2. Krijo lidhjen e re që fshin automatikisht udhëtimet kur fshihet useri
ALTER TABLE public.trips 
ADD CONSTRAINT trips_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users (id) 
ON DELETE CASCADE;


ALTER TABLE public.trips 
ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;


-- 1. Create the 'avatars' storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view the avatars (SELECT)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

-- 3. Allow authenticated users to upload new avatars (INSERT)
CREATE POLICY "Auth Users Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'avatars' );

-- 4. Allow authenticated users to update their own avatars (UPDATE)
CREATE POLICY "Auth Users Update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'avatars' );

-- 5. Allow authenticated users to delete their own avatars (DELETE)
CREATE POLICY "Auth Users Delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'avatars' );
