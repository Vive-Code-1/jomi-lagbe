
-- Add user_id column to lands table
ALTER TABLE public.lands ADD COLUMN user_id uuid;

-- RLS: Authenticated users can insert their own lands
CREATE POLICY "Users can insert own lands"
ON public.lands
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS: Users can update their own lands
CREATE POLICY "Users can update own lands"
ON public.lands
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS: Users can delete their own lands
CREATE POLICY "Users can delete own lands"
ON public.lands
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
