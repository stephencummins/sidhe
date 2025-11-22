-- Create user_subscriptions table for tracking Stripe subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'subscriber', 'vip')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false
);

-- Create celtic_cross_credits table for one-off purchases
CREATE TABLE IF NOT EXISTS public.celtic_cross_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  credits_remaining INTEGER NOT NULL DEFAULT 0 CHECK (credits_remaining >= 0),
  total_purchased INTEGER NOT NULL DEFAULT 0 CHECK (total_purchased >= 0),
  total_used INTEGER NOT NULL DEFAULT 0 CHECK (total_used >= 0)
);

-- Create unique index on user_id for celtic_cross_credits (one record per user)
CREATE UNIQUE INDEX idx_celtic_cross_credits_user_id ON public.celtic_cross_credits(user_id);

-- Create stripe_purchases table for tracking all purchases (for audit trail)
CREATE TABLE IF NOT EXISTS public.stripe_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  product_type TEXT NOT NULL CHECK (product_type IN ('subscription', 'celtic_cross')),
  product_name TEXT NOT NULL,
  amount_pence INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'gbp',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

-- Add indexes for faster lookups
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer_id ON public.user_subscriptions(stripe_customer_id);
CREATE INDEX idx_user_subscriptions_tier ON public.user_subscriptions(tier);
CREATE INDEX idx_stripe_purchases_user_id ON public.stripe_purchases(user_id);
CREATE INDEX idx_stripe_purchases_email ON public.stripe_purchases(email);
CREATE INDEX idx_stripe_purchases_stripe_session_id ON public.stripe_purchases(stripe_session_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.celtic_cross_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_purchases ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscription
CREATE POLICY "Users can view their own subscription"
  ON public.user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Service role can manage all subscriptions (for webhooks)
CREATE POLICY "Service role can manage subscriptions"
  ON public.user_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Users can view their own credits
CREATE POLICY "Users can view their own credits"
  ON public.celtic_cross_credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Service role can manage all credits (for webhooks)
CREATE POLICY "Service role can manage credits"
  ON public.celtic_cross_credits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Users can view their own purchases
CREATE POLICY "Users can view their own purchases"
  ON public.stripe_purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Service role can manage all purchases (for webhooks)
CREATE POLICY "Service role can manage purchases"
  ON public.stripe_purchases
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();

CREATE TRIGGER set_celtic_cross_credits_updated_at
  BEFORE UPDATE ON public.celtic_cross_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.user_subscriptions IS 'Tracks user subscription tiers and Stripe subscription details';
COMMENT ON COLUMN public.user_subscriptions.tier IS 'Subscription tier: free, subscriber (£4.99/mo), or vip (£9.99/mo)';
COMMENT ON COLUMN public.user_subscriptions.status IS 'Stripe subscription status: active, cancelled, past_due, trialing';

COMMENT ON TABLE public.celtic_cross_credits IS 'Tracks Celtic Cross reading credits for one-off purchases';
COMMENT ON COLUMN public.celtic_cross_credits.credits_remaining IS 'Number of Celtic Cross readings available to use';

COMMENT ON TABLE public.stripe_purchases IS 'Audit trail of all Stripe purchases';
