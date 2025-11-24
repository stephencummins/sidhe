-- Allow anon key to read active subscribers
-- This is needed for the n8n workflow to fetch subscribers

CREATE POLICY "Anyone can read active subscribers"
ON public.subscribers
FOR SELECT
USING (is_active = true);
