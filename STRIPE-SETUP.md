# Stripe Payment Integration Setup Guide

This guide explains how to set up Stripe payments for Sidhe Celtic Tarot subscriptions and one-off purchases.

## Overview

The payment system consists of:
- **Subscriptions**: Subscriber (£4.99/month), VIP (£9.99/month)
- **One-off purchases**: Celtic Cross readings (£4.99 each)
- **Free tier**: Yes/No one-card readings

## 1. Stripe Dashboard Setup

### Create Products and Prices

Log into your Stripe Dashboard and create these products:

#### Subscriber Tier
1. Go to Products → Add Product
2. **Name**: "Sidhe Subscriber"
3. **Description**: "Daily 3-card reading emails"
4. **Pricing**:
   - Price: £4.99
   - Billing period: Monthly
   - Currency: GBP
5. Save and note the **Price ID** (e.g., `price_xxx`)

#### VIP Tier
1. Go to Products → Add Product
2. **Name**: "Sidhe VIP"
3. **Description**: "Full access: Save readings, Analysis tool, Winds of Change, unlimited Celtic Cross"
4. **Pricing**:
   - Price: £9.99
   - Billing period: Monthly
   - Currency: GBP
5. Save and note the **Price ID**

#### Celtic Cross Reading (One-off)
1. Go to Products → Add Product
2. **Name**: "Celtic Cross Reading"
3. **Description**: "One Celtic Cross tarot reading"
4. **Pricing**:
   - Price: £4.99
   - One-time payment
   - Currency: GBP
5. Save and note the **Price ID**

### Configure Webhook

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL**: `https://[your-supabase-project].supabase.co/functions/v1/stripe-webhook`
4. **Events to listen for**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Save and note the **Webhook signing secret** (starts with `whsec_`)

### Configure Customer Portal

1. Go to Settings → Billing → Customer portal
2. Enable the portal
3. Configure allowed actions:
   - Cancel subscription
   - Update payment method
   - View invoice history
4. Save changes

## 2. Environment Variables

### Supabase Function Secrets

Set these secrets in your Supabase project:

```bash
# From Stripe Dashboard → Developers → API keys
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx

# From Stripe Dashboard → Developers → Webhooks → Your endpoint
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
```

Or via the Supabase Dashboard:
1. Go to Project Settings → Edge Functions
2. Add secrets under "Function secrets"

### Frontend Environment Variables

Add to your `.env` file for the React app:

```env
# Stripe Price IDs (from Stripe Dashboard)
VITE_STRIPE_SUBSCRIBER_PRICE_ID=price_xxx
VITE_STRIPE_VIP_PRICE_ID=price_xxx
VITE_STRIPE_CELTIC_CROSS_PRICE_ID=price_xxx
```

## 3. Deploy Edge Functions

Deploy all the Stripe-related functions:

```bash
cd /path/to/Sidhe

# Deploy all functions
npx supabase functions deploy create-checkout
npx supabase functions deploy stripe-webhook
npx supabase functions deploy customer-portal
npx supabase functions deploy check-access
npx supabase functions deploy use-celtic-credit
```

## 4. Apply Database Migration

Run the migration to create subscription tables:

```bash
npx supabase db push
```

Or apply the migration file directly: `supabase/migrations/20251118000000_create_stripe_subscriptions.sql`

## 5. Frontend Integration

### Check User Access

```typescript
import { supabase } from './lib/supabase';

async function checkAccess() {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-access`,
    {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.json();
}
```

### Create Checkout Session

```typescript
async function subscribe(tier: 'subscriber' | 'vip') {
  const { data: { session } } = await supabase.auth.getSession();

  const priceId = tier === 'vip'
    ? import.meta.env.VITE_STRIPE_VIP_PRICE_ID
    : import.meta.env.VITE_STRIPE_SUBSCRIBER_PRICE_ID;

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId,
        productType: 'subscription',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/pricing`
      })
    }
  );

  const { url } = await response.json();
  window.location.href = url;
}
```

### Buy Celtic Cross Reading

```typescript
async function buyCelticCross() {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId: import.meta.env.VITE_STRIPE_CELTIC_CROSS_PRICE_ID,
        productType: 'celtic_cross',
        successUrl: `${window.location.origin}/reading?type=celtic-cross`,
        cancelUrl: `${window.location.origin}/pricing`
      })
    }
  );

  const { url } = await response.json();
  window.location.href = url;
}
```

### Manage Subscription

```typescript
async function openBillingPortal() {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/customer-portal`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        returnUrl: window.location.origin
      })
    }
  );

  const { url } = await response.json();
  window.location.href = url;
}
```

### Use Celtic Cross Credit

```typescript
async function useCelticCredit() {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/use-celtic-credit`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
}
```

## 6. Feature Access Matrix

| Feature | Free | Subscriber | VIP | One-off |
|---------|------|------------|-----|---------|
| Yes/No one-card reading | ✓ | ✓ | ✓ | - |
| Daily 3-card email | - | ✓ | ✓ | - |
| Celtic Cross reading | - | - | ✓ | ✓ (per credit) |
| Save readings | - | - | ✓ | - |
| Analysis tool | - | - | ✓ | - |
| Winds of Change | - | - | ✓ | - |

## 7. Testing

### Test Mode

1. Use Stripe test API keys during development
2. Test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

### Local Webhook Testing

Use Stripe CLI to forward webhooks locally:

```bash
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

(Use the webhook signing secret from the CLI output)

## 8. Monitoring

### Check Subscriptions

```sql
-- Active subscribers by tier
SELECT tier, COUNT(*)
FROM user_subscriptions
WHERE status = 'active'
GROUP BY tier;

-- Recent purchases
SELECT * FROM stripe_purchases
ORDER BY created_at DESC
LIMIT 20;

-- Celtic Cross credits usage
SELECT
  SUM(total_purchased) as total_sold,
  SUM(total_used) as total_used,
  SUM(credits_remaining) as credits_outstanding
FROM celtic_cross_credits;
```

### Stripe Dashboard

Monitor in Stripe Dashboard:
- Payments → All payments
- Customers → Customer list
- Billing → Subscriptions

## 9. Going Live

1. Switch to live API keys in Supabase secrets
2. Update webhook endpoint to use live signing secret
3. Test with a real card (you can refund immediately)
4. Monitor first few transactions closely

## Support

If you encounter issues:
1. Check Supabase function logs in Dashboard → Edge Functions → Logs
2. Check Stripe webhook events in Dashboard → Developers → Webhooks
3. Verify all environment variables are set correctly
