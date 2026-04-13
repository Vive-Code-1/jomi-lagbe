
-- Create unlock_packages table
CREATE TABLE public.unlock_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bn text NOT NULL,
  name_en text NOT NULL,
  price numeric NOT NULL DEFAULT 499,
  unlock_count integer NOT NULL DEFAULT 10,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.unlock_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active unlock packages"
ON public.unlock_packages FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage unlock packages"
ON public.unlock_packages FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create unlock_purchases table
CREATE TABLE public.unlock_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  package_id uuid REFERENCES public.unlock_packages(id),
  total_unlocks integer NOT NULL DEFAULT 10,
  used_unlocks integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_method_id uuid REFERENCES public.payment_methods(id),
  sender_number text,
  sender_transaction_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.unlock_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own unlock purchases"
ON public.unlock_purchases FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own unlock purchases"
ON public.unlock_purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all unlock purchases"
ON public.unlock_purchases FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update unlock purchases"
ON public.unlock_purchases FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Add purchase_id to contact_unlocks
ALTER TABLE public.contact_unlocks ADD COLUMN purchase_id uuid REFERENCES public.unlock_purchases(id);

-- Insert default package
INSERT INTO public.unlock_packages (name_bn, name_en, price, unlock_count)
VALUES ('মালিকের তথ্য প্যাকেজ', 'Owner Info Package', 499, 10);
