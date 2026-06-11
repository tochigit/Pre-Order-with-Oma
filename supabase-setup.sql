-- ═══════════════════════════════════════════════════════════════
-- SUPABASE SETUP SCRIPT FOR "PREORDER WITH OMA"
-- ═══════════════════════════════════════════════════════════════
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- This creates the storage bucket and sets up public access.
-- Prisma will handle the Product table automatically via `prisma db push`.
-- ═══════════════════════════════════════════════════════════════

-- 1. Create the product-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 2. Allow anyone to VIEW product images (public reads)
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 3. Allow admin (service role) to UPLOAD images
CREATE POLICY "Admin can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- 4. Allow admin (service role) to DELETE images
CREATE POLICY "Admin can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- 5. Allow admin (service role) to UPDATE images
CREATE POLICY "Admin can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');
