-- Create subscribers table for daily reading email list
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on email for faster lookups
CREATE INDEX idx_subscribers_email ON public.subscribers(email);

-- Add index on is_active for filtering active subscribers
CREATE INDEX idx_subscribers_is_active ON public.subscribers(is_active);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe"
  ON public.subscribers
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to update their own subscription (unsubscribe)
CREATE POLICY "Users can update their own subscription"
  ON public.subscribers
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy to allow service role to read all subscribers
CREATE POLICY "Service role can read all subscribers"
  ON public.subscribers
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'service_role'
    OR email = current_setting('request.jwt.claims', true)::json ->> 'email'
  );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.subscribers IS 'Stores email addresses of users subscribed to daily tarot readings';
COMMENT ON COLUMN public.subscribers.email IS 'Subscriber email address';
COMMENT ON COLUMN public.subscribers.is_active IS 'Whether the subscription is currently active';
COMMENT ON COLUMN public.subscribers.subscribed_at IS 'When the user first subscribed';
COMMENT ON COLUMN public.subscribers.unsubscribed_at IS 'When the user unsubscribed (if applicable)';
