
-- Create payment_methods table
CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method_name text NOT NULL,
  account_number text NOT NULL,
  payment_type text NOT NULL DEFAULT 'send_money',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active payment methods"
ON public.payment_methods FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage payment methods"
ON public.payment_methods FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add new columns to payments table
ALTER TABLE public.payments ADD COLUMN sender_number text;
ALTER TABLE public.payments ADD COLUMN sender_transaction_id text;
ALTER TABLE public.payments ADD COLUMN payment_method_id uuid REFERENCES public.payment_methods(id);
