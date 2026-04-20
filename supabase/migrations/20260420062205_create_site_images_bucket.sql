/*
  # Create site-images storage bucket

  1. New Storage
    - Creates `site-images` bucket for website image uploads from admin panel
    - Bucket is public so images can be served directly via URL
  2. Security
    - Public read access for all users (images are displayed on the website)
    - Insert/update/delete restricted to authenticated users only
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for site images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated users can upload site images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Authenticated users can update site images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-images')
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Authenticated users can delete site images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-images');

CREATE POLICY "Anon users can upload site images"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Anon users can update site images"
  ON storage.objects FOR UPDATE
  TO anon
  USING (bucket_id = 'site-images')
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Anon users can delete site images"
  ON storage.objects FOR DELETE
  TO anon
  USING (bucket_id = 'site-images');