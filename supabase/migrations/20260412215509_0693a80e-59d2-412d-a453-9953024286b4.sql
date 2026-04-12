
INSERT INTO storage.buckets (id, name, public)
VALUES ('land-images', 'land-images', true);

CREATE POLICY "Anyone can view land images"
ON storage.objects FOR SELECT
USING (bucket_id = 'land-images');

CREATE POLICY "Authenticated users can upload land images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'land-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own land images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'land-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own land images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'land-images' AND auth.uid()::text = (storage.foldername(name))[1]);
