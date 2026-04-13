
CREATE OR REPLACE FUNCTION public.increment_used_unlocks(p_purchase_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE unlock_purchases
  SET used_unlocks = used_unlocks + 1
  WHERE id = p_purchase_id
    AND user_id = auth.uid()
    AND status = 'active'
    AND used_unlocks < total_unlocks;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cannot increment: purchase not found, not active, or limit reached';
  END IF;
END;
$$;
