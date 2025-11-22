# SIDHE TAROT - CODEBASE DOCUMENTATION

## Project Overview
Sidhe is a Celtic-themed tarot reading web application that combines traditional tarot with Celtic mythology and seasonal festivals. Built with React, TypeScript, Vite, and Supabase, it offers personal readings, daily readings, saved readings with analytics, and email subscriptions.

---

## 🚀 Current Status (Updated: Nov 22, 2024)

### Production Environment
- **Live URL**: https://sidhe.netlify.app
- **Supabase Project**: ktjbtkkltvkmdwzkcwij
- **Stripe Mode**: TEST MODE (ready for test transactions)
- **Status**: ✅ Fully deployed and operational

### Recent Updates (Nov 22, 2024)

#### 1. Celtic Cross Layout Improvements
- **Challenge Card Positioning**: Now properly positioned to form a cross
  - Offset: `-translate-y-[52px] -translate-x-[52px]` in `ReadingDisplay.tsx:185`
  - Forms perfect cross over Present Situation card
  - Maintains clickability with z-index layering (z-10 for crossing card)

#### 2. Card Sizing Enhancements
- **Main Display Cards**: Upgraded from medium → large (w-48 / 192px)
  - File: `src/components/ReadingDisplay.tsx:192`
- **Modal Cards**: Upgraded from large → xlarge (responsive: 192px → 256px → 320px)
  - File: `src/components/ReadingDisplay.tsx:365`
- **Card Selection Grid**: Upgraded from small → medium (w-32 / 128px)
  - File: `src/components/CardSelection.tsx:143`

#### 3. Routing Fix
- Removed conflicting `/reading/:id` route from `App.tsx`
- Kept `/r/:id` for shared daily readings
- Fixed navigation conflicts between reading wizard and shared readings

#### 4. Stripe Payment Integration (COMPLETE)
- ✅ **3 Subscription Tiers**: Free, Subscriber (£4.99/mo), VIP (£9.99/mo)
- ✅ **One-off Purchase**: Celtic Cross reading (£4.99)
- ✅ **5 Edge Functions**: Deployed to Supabase
- ✅ **Database Tables**: Migrated and ready
- ✅ **Frontend UI**: PricingPage, SuccessPage, SubscriptionContext
- ✅ **Feature Gating**: Celtic Cross locked for non-subscribers
- **Mode**: Currently in TEST MODE (see Stripe section for details)

### Quick Start (Resume Development)

```bash
# Clone and setup
cd /Users/stephen/Projects/sidhe
npm install

# Start dev server
npm run dev  # → http://localhost:5173 or 5174

# View logs
tail -f supabase/.temp/cli-latest

# Deploy changes
git add . && git commit -m "Your message" && git push origin main
npx supabase functions deploy <function-name>  # If edge functions changed
npx supabase db push  # If migrations changed
```

### Environment Variables

**Local (.env) - Test Mode:**
```
VITE_SUPABASE_URL=https://ktjbtkkltvkmdwzkcwij.supabase.co
VITE_SUPABASE_ANON_KEY=[in .env file]
VITE_ANTHROPIC_API_KEY=[in .env file]
VITE_STRIPE_SUBSCRIBER_PRICE_ID=price_1SWHGWP3mUc1W0ak5mpc0tyE (TEST)
VITE_STRIPE_VIP_PRICE_ID=price_1SWHGuP3mUc1W0akxlVOJT0K (TEST)
VITE_STRIPE_CELTIC_CROSS_PRICE_ID=price_1SWHHKP3mUc1W0akqEpFR0TH (TEST)
```

**Supabase Secrets (check with: `npx supabase secrets list`):**
```
STRIPE_SECRET_KEY=sk_test_... (TEST MODE)
STRIPE_WEBHOOK_SECRET=whsec_r1CQyDfhJmJgGSVyzhUNtST4ri2fLQgd (TEST)
ANTHROPIC_API_KEY=[configured]
```

**Netlify Environment Variables:**
- Check: https://app.netlify.com/sites/sidhe/settings/env
- Currently using build-time .env values (test mode)

### Testing Stripe Integration

1. **Visit**: https://sidhe.netlify.app/pricing
2. **Test Card**: 4242 4242 4242 4242 (any future expiry, any CVC)
3. **Monitor**: https://dashboard.stripe.com/test/payments
4. **Verify**:
   - User gets VIP/Subscriber tier
   - Celtic Cross unlocks (for VIP or credit purchase)
   - Database tables updated (`user_subscriptions`, `stripe_purchases`)

### Known Issues / TODOs
- None currently - system is stable and operational
- Stripe is in TEST MODE - switch to LIVE when ready for production payments

### Switching to Stripe LIVE Mode (When Ready)

**Netlify Environment Variables:**
```
VITE_STRIPE_SUBSCRIBER_PRICE_ID=price_1SUuMTP3mUc1W0akNGmyGGzz
VITE_STRIPE_VIP_PRICE_ID=price_1SUuNPP3mUc1W0akW081YmCD
VITE_STRIPE_CELTIC_CROSS_PRICE_ID=price_1SW39sP3mUc1W0akxtIx9aPy
```

**Supabase Secrets:**
```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_KEY
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_SECRET
# Then redeploy all Stripe functions
```

**Stripe Dashboard:**
- Configure live mode webhook: https://dashboard.stripe.com/webhooks
- Same endpoint URL, different signing secret

---

## Common Commands

### Development
```bash
npm run dev              # Start development server (Vite)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking
```

### Database & Supabase
```bash
npx supabase db push                           # Apply migrations
npx supabase functions deploy <function-name>  # Deploy edge function
npx supabase link --project-ref ktjbtkkltvkmdwzkcwij
```

### Deployment
- **Netlify**: Automatic deployment from `main` branch
- **Production URL**: https://sidhe.netlify.app

---

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom Celtic color palette
- **Routing**: React Router v7
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI**: Anthropic Claude (Sonnet 4.5) for tarot interpretations
- **Charts**: Recharts + D3.js for analytics visualizations
- **Markdown**: react-markdown for rendering interpretations

### Project Structure
```
sidhe/
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React contexts (AuthContext, SubscriptionContext)
│   ├── data/              # Static data (spreads, tarot deck)
│   ├── hooks/             # Custom hooks (useTarotDeck)
│   ├── lib/               # Utilities (supabase, celticCalendar, powerScoreCalculator)
│   ├── services/          # API services (savedReadings, readingAnalytics)
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions (imageUtils)
├── supabase/
│   ├── migrations/        # Database schema migrations
│   └── functions/         # Edge functions (serverless)
├── public/                # Static assets (images, icons)
└── [config files]         # tailwind.config.js, vite.config.ts, etc.
```

---

## Key Application Features

### 1. Tarot Reading Flow
The main user journey follows a wizard-like flow managed by `TarotFlow.tsx`:

**Flow Steps**:
1. **Spread Selection** (`/reading/`) - Choose spread type (single, three-card, celtic-cross)
2. **Question Input** (`/reading/question`) - Optional question for context
3. **Card Selection** (`/reading/cards`) - Interactive card selection with shuffle animation
4. **Reading Display** (`/reading/display`) - Reveals cards with AI-generated interpretation

**Key Components**:
- `SpreadSelection.tsx` - Spread type chooser with visual cards
- `QuestionInput.tsx` - Question entry form
- `CardSelection.tsx` - Interactive deck with shuffle mechanics
- `ReadingDisplay.tsx` - Card reveal with traditional/Celtic meaning toggle
- `TarotCardVisual.tsx` - Reusable card display component with flip animation

### 2. Daily Reading System
- **Daily 3-Card Reading**: Automated daily reading generation
- **Component**: `DailyThreeCardReading.tsx`
- **Database**: `daily_readings` table stores one reading per day
- **N8N Integration**: Automated workflow generates and emails daily readings
- **Subscription**: Users can subscribe via `DailyReadingSubscription.tsx`

### 3. Saved Readings & Analytics
- **Save Readings**: Users can save personal and daily readings
- **Rating System**: Track accuracy, sentiment, outcome notes
- **Power Score**: Calculated metrics (Major Arcana count, court cards, suit patterns, reversals)
- **Analytics Dashboard**: `ReadingAnalytics.tsx` with visualizations
  - Monthly reading distribution
  - Celtic festival correlation
  - Card frequency analysis
  - Spread type distribution
  - Average accuracy and power scores

### 4. Shared Readings
- Public sharing via unique URLs: `/r/:id` or `/reading/:id`
- `SharedReading.tsx` component displays public readings
- RLS policies allow viewing public readings without auth

### 5. Admin Panel
- **Route**: `/admin`
- **Component**: `AdminPanel.tsx`
- **Features**:
  - Subscriber management
  - Deck management (upload cards, set meanings)
  - View/manage daily readings
- **Authentication**: Google OAuth via Supabase Auth

---

## Database Schema

### Core Tables

#### `tarot_decks`
```sql
id              UUID PRIMARY KEY
name            TEXT NOT NULL
description     TEXT
is_active       BOOLEAN DEFAULT false
created_by      UUID REFERENCES auth.users(id)
card_back_url   TEXT
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

#### `tarot_cards`
```sql
id                        UUID PRIMARY KEY
deck_id                   UUID REFERENCES tarot_decks(id)
name                      TEXT NOT NULL
arcana                    TEXT ('major' | 'minor')
suit                      TEXT ('wands' | 'cups' | 'swords' | 'pentacles')
meaning_upright           TEXT
meaning_reversed          TEXT
image_url                 TEXT
thumbnail_url             TEXT
keywords                  TEXT[]
celtic_meaning_upright    TEXT
celtic_meaning_reversed   TEXT
celtic_keywords           TEXT[]
celtic_mythology          TEXT
created_at                TIMESTAMPTZ
```

#### `saved_readings`
```sql
id                    UUID PRIMARY KEY
user_id               UUID REFERENCES auth.users(id)
title                 TEXT
spread_type           TEXT ('single' | 'three-card' | 'celtic-cross')
question              TEXT
cards                 JSONB (SelectedCard[])
interpretation        TEXT
is_public             BOOLEAN DEFAULT false
reading_source        TEXT ('personal' | 'daily')
notes                 TEXT
-- Analytics fields
accuracy_rating       INTEGER (1-5)
sentiment             TEXT ('positive' | 'neutral' | 'negative')
outcome_notes         TEXT
reviewed_at           TIMESTAMPTZ
power_score           NUMERIC
major_arcana_count    INTEGER
court_card_count      INTEGER
suit_pattern_score    INTEGER
reversal_percentage   NUMERIC
tags                  TEXT[]
created_at            TIMESTAMPTZ
updated_at            TIMESTAMPTZ
```

#### `daily_readings`
```sql
id              UUID PRIMARY KEY
reading_date    DATE UNIQUE NOT NULL
spread_name     TEXT
meaning_type    TEXT DEFAULT 'celtic'
question        TEXT
cards           JSONB
interpretation  TEXT
created_at      TIMESTAMPTZ
```

#### `subscribers`
```sql
id                UUID PRIMARY KEY
email             TEXT UNIQUE NOT NULL
is_active         BOOLEAN DEFAULT true
subscribed_at     TIMESTAMPTZ
unsubscribed_at   TIMESTAMPTZ
created_at        TIMESTAMPTZ
updated_at        TIMESTAMPTZ
```

### Row Level Security (RLS)
- All tables have RLS enabled
- Public read access for active decks and cards
- Public read access for daily readings and public saved readings
- Users can only modify their own saved readings
- Subscribers table allows public insert (subscribe) and update (unsubscribe)

---

## Supabase Edge Functions

### `generate-tarot-interpretation`
- **Purpose**: Generates AI interpretations using Claude
- **Input**: cards[], question, spreadName, meaningType ('traditional' | 'celtic')
- **Output**: Markdown-formatted interpretation
- **Model**: claude-sonnet-4-5-20250929
- **CORS**: Enabled for all origins

### `generate-daily-reading`
- **Purpose**: Creates automated daily 3-card reading
- **Trigger**: N8N workflow (scheduled)
- **Saves to**: `daily_readings` table

### `subscribe`
- **Purpose**: Add/reactivate email subscription
- **Input**: email
- **Output**: Success/error status

### `unsubscribe`
- **Purpose**: Deactivate email subscription
- **Input**: email
- **Output**: Success/error status

### `get-subscribers`
- **Purpose**: Fetch active subscribers for email workflow
- **Output**: Array of subscriber emails
- **Used by**: N8N workflow

---

## Stripe Payment Integration

### Overview
Sidhe uses Stripe for monetization with three product tiers:
- **Free**: Yes/No single-card readings
- **Subscriber** (£4.99/month): Daily 3-card email readings
- **VIP** (£9.99/month): Full access (save readings, analytics, Winds of Change, unlimited Celtic Cross)
- **Celtic Cross One-off** (£4.99): Single Celtic Cross reading credit

### Configuration (✅ Completed Nov 22, 2024)

**Status**: ✅ Fully integrated, tested, and working

**Stripe Test Mode Products**:
- Subscriber: `price_1SWHGWP3mUc1W0ak5mpc0tyE` (£4.99/month)
- VIP: `price_1SWHGuP3mUc1W0akxlVOJT0K` (£9.99/month)
- Celtic Cross: `price_1SWHHKP3mUc1W0akqEpFR0TH` (£4.99 one-off)

**Stripe Live Mode Products** (for production):
- Subscriber: `price_1SUuMTP3mUc1W0akNGmyGGzz`
- VIP: `price_1SUuNPP3mUc1W0akW081YmCD`
- Celtic Cross: `price_1SW39sP3mUc1W0akxtIx9aPy`

**Webhook Endpoint**: `https://ktjbtkkltvkmdwzkcwij.supabase.co/functions/v1/stripe-webhook`
- ✅ Configured in Stripe Dashboard (test mode)
- ✅ Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- ✅ Webhook secret: `whsec_r1CQyDfhJmJgGSVyzhUNtST4ri2fLQgd` (test mode)

**Supabase Secrets** (✅ Set):
- `STRIPE_SECRET_KEY` - Stripe test API key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret

**Critical Configuration** (`supabase/config.toml`):
```toml
[functions.stripe-webhook]
verify_jwt = false  # REQUIRED - webhooks don't use JWT auth
```

**Database Migration**: ✅ Applied
- File: `supabase/migrations/20251118000001_stripe_tables_idempotent.sql`
- Tables: `user_subscriptions`, `celtic_cross_credits`, `stripe_purchases`

**Edge Functions**: ✅ All deployed and tested
- `create-checkout` - Creates Stripe checkout sessions
- `stripe-webhook` - Processes webhook events (uses `constructEventAsync` for Deno compatibility)
- `customer-portal` - Stripe customer portal access
- `check-access` - Checks user subscription tier and features
- `use-celtic-credit` - Consumes Celtic Cross reading credits

**Frontend Components**: ✅ Implemented
- `PricingPage.tsx` - Pricing page (fixed: `gap-16` for Celtic border spacing, z-20 for "MOST POPULAR" badge)
- `SuccessPage.tsx` - Post-checkout success page (navigates to `/reading` for Celtic Cross purchases)
- `SubscriptionContext.tsx` - Global subscription state management

### Important Implementation Notes

**Stripe Library Version**:
- Use `npm:stripe@^13.0.0` (NOT esm.sh versions)
- Deno Edge Functions require async webhook verification: `await stripe.webhooks.constructEventAsync()`

**Common Issues & Solutions**:
1. **401 Unauthorized on webhook**: Add `verify_jwt = false` to `supabase/config.toml`
2. **Invalid signature**: Use `constructEventAsync` instead of `constructEvent` in Deno
3. **Price not found**: Ensure using test mode price IDs with test mode secret key
4. **Deno.core.runMicrotasks error**: Update to `npm:stripe@^13.0.0` import

### Database Tables

#### `user_subscriptions`
```sql
id                      UUID PRIMARY KEY
user_id                 UUID REFERENCES auth.users(id) UNIQUE
email                   TEXT NOT NULL
stripe_customer_id      TEXT UNIQUE
stripe_subscription_id  TEXT UNIQUE
tier                    TEXT ('free' | 'subscriber' | 'vip')
status                  TEXT ('active' | 'cancelled' | 'past_due' | 'trialing')
current_period_start    TIMESTAMPTZ
current_period_end      TIMESTAMPTZ
cancel_at_period_end    BOOLEAN
created_at              TIMESTAMPTZ
updated_at              TIMESTAMPTZ
```

#### `celtic_cross_credits`
```sql
id                 UUID PRIMARY KEY
user_id            UUID REFERENCES auth.users(id)
email              TEXT NOT NULL
credits_remaining  INTEGER (>= 0)
total_purchased    INTEGER (>= 0)
total_used         INTEGER (>= 0)
created_at         TIMESTAMPTZ
updated_at         TIMESTAMPTZ
```

#### `stripe_purchases`
```sql
id                        UUID PRIMARY KEY
user_id                   UUID REFERENCES auth.users(id)
email                     TEXT NOT NULL
stripe_session_id         TEXT UNIQUE NOT NULL
stripe_customer_id        TEXT
stripe_payment_intent_id  TEXT
product_type              TEXT ('subscription' | 'celtic_cross')
product_name              TEXT NOT NULL
amount_pence              INTEGER
currency                  TEXT DEFAULT 'gbp'
status                    TEXT ('pending' | 'completed' | 'failed' | 'refunded')
created_at                TIMESTAMPTZ
```

### Stripe Edge Functions (Deployed)

#### `create-checkout`
- **Purpose**: Create Stripe checkout session for subscriptions or one-off purchases
- **Auth**: Requires authenticated user (JWT)
- **Input**:
  ```typescript
  {
    priceId: string,
    productType: 'subscription' | 'celtic_cross',
    successUrl: string,
    cancelUrl: string
  }
  ```
- **Output**: `{ sessionId, url }` - Redirect user to session.url
- **Behavior**:
  - Creates or retrieves Stripe customer
  - Logs purchase attempt to `stripe_purchases`
  - Returns checkout session URL

#### `stripe-webhook`
- **Purpose**: Handle Stripe webhook events
- **Auth**: Stripe signature verification
- **Events Handled**:
  - **checkout.session.completed**:
    - Subscription: Creates/updates `user_subscriptions` record, determines tier from price (£9.99 = VIP, £4.99 = Subscriber)
    - Celtic Cross: Adds 1 credit to `celtic_cross_credits`
    - Updates purchase status to 'completed'
  - **customer.subscription.updated**: Updates subscription status and period dates
  - **customer.subscription.deleted**: Sets tier to 'free', status to 'cancelled'
  - **invoice.payment_failed**: Sets status to 'past_due'

#### `customer-portal`
- **Purpose**: Create Stripe customer portal session
- **Auth**: Requires authenticated user
- **Input**: `{ returnUrl: string }`
- **Output**: `{ url }` - Redirect to portal
- **Features**: Cancel subscription, update payment method, view invoices

#### `check-access`
- **Purpose**: Check user's current subscription tier and feature access
- **Auth**: Requires authenticated user
- **Output**:
  ```typescript
  {
    tier: 'free' | 'subscriber' | 'vip',
    hasAccess: {
      dailyEmail: boolean,
      celticCross: boolean,
      saveReadings: boolean,
      analytics: boolean,
      windsOfChange: boolean
    },
    celticCredits: number
  }
  ```

#### `use-celtic-credit`
- **Purpose**: Consume a Celtic Cross reading credit
- **Auth**: Requires authenticated user
- **Output**: `{ success: boolean, creditsRemaining: number }`
- **Behavior**: Decrements `credits_remaining`, increments `total_used`

### Frontend Integration Pattern

#### Check User Access
```typescript
const { data } = await fetch(
  `${SUPABASE_URL}/functions/v1/check-access`,
  { headers: { Authorization: `Bearer ${token}` } }
).then(r => r.json());

if (data.hasAccess.celticCross) {
  // Show Celtic Cross reading
}
```

#### Create Checkout Session
```typescript
async function subscribe(tier: 'subscriber' | 'vip') {
  const priceId = tier === 'vip'
    ? import.meta.env.VITE_STRIPE_VIP_PRICE_ID
    : import.meta.env.VITE_STRIPE_SUBSCRIBER_PRICE_ID;

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/create-checkout`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
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
  window.location.href = url; // Redirect to Stripe Checkout
}
```

#### Buy Celtic Cross Credit
```typescript
async function buyCelticCross() {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/create-checkout`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
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

#### Manage Subscription (Customer Portal)
```typescript
async function openBillingPortal() {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/customer-portal`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
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

#### Use Celtic Cross Credit
```typescript
async function useCelticCredit() {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/use-celtic-credit`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result; // { success: true, creditsRemaining: number }
}
```

### Feature Access Matrix

| Feature | Free | Subscriber (£4.99/mo) | VIP (£9.99/mo) | Celtic Cross One-off (£4.99) |
|---------|------|----------------------|----------------|------------------------------|
| Yes/No single-card | ✓ | ✓ | ✓ | - |
| Daily 3-card email | - | ✓ | ✓ | - |
| Celtic Cross reading | - | - | ✓ (unlimited) | ✓ (1 credit) |
| Save readings | - | - | ✓ | - |
| Analytics dashboard | - | - | ✓ | - |
| Winds of Change | - | - | ✓ | - |

### Testing

#### Test Cards (Stripe Test Mode)
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

#### Local Webhook Testing
```bash
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
# Use the webhook signing secret from CLI output in .env
```

### Monitoring Queries

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

### Stripe Dashboard Links
- [Payments](https://dashboard.stripe.com/payments)
- [Customers](https://dashboard.stripe.com/customers)
- [Subscriptions](https://dashboard.stripe.com/subscriptions)
- [Webhooks](https://dashboard.stripe.com/webhooks)
- [Customer Portal Settings](https://dashboard.stripe.com/settings/billing/portal)

---

## Key Patterns & Conventions

### 1. Celtic Theme & Styling
**Color Palette** (defined in `tailwind.config.js`):
```javascript
'sidhe-navy': '#1a2f4a'          // Primary dark blue
'sidhe-deep-blue': '#0d1b2a'     // Background dark
'sidhe-gold': '#d4af37'          // Primary accent (headings, borders)
'sidhe-bright-gold': '#f4c542'   // Hover states
'sidhe-orange': '#d35f3a'        // Secondary accent
'sidhe-coral': '#e07856'         // Tertiary accent
'sidhe-teal': '#4a7c7e'          // Cool accent
'sidhe-sage': '#6b8e8f'          // Muted green
'sidhe-cream': '#f5f1e8'         // Text color
'sidhe-moon': '#e8e4d9'          // Light background
```

**Typography**:
- Headings: `Cinzel` (serif, Celtic feel)
- Body: `Crimson Text` (serif, readable)

**Visual Elements**:
- `CelticBorder.tsx` - Reusable Celtic knot border component
  - Features decorative Celtic knot medallions positioned at edges (top, bottom, left, right)
  - Medallions extend beyond card boundaries (translate-x/y-1/2)
  - ⚠️ **Important**: When using CelticBorder in grid layouts, use minimum `gap-16` to prevent medallion overlap
  - Example: PricingPage.tsx uses `gap-16` for 3-column grid
- `RunicSymbol.tsx` - Decorative runic symbols
- Custom patterns using SVG for backgrounds
- Gradient overlays for depth

**Z-Index Management**:
- Celtic knot medallions: `z-10`
- Important badges/labels that should appear above medallions: `z-20` or higher
- Example: "MOST POPULAR" badge on PricingPage uses `z-20`

### 2. Data Loading Pattern
**Custom Hook**: `useTarotDeck()`
- Loads active deck from Supabase
- Falls back to default deck if no active deck
- Returns: `{ deck, loading, cardBackUrl }`
- Used throughout app for consistent deck data

### 3. Authentication & Subscription Pattern
**AuthContext**:
- Provides: `{ user, loading, signInWithGoogle, signOut }`
- Google OAuth integration
- `ProtectedRoute` wrapper component for admin pages
- Session persistence via Supabase Auth

**SubscriptionContext**:
- Provides: `{ tier, status, celticCrossCredits, features, loading, refreshSubscription, subscribe, buyCelticCross, useCelticCredit, openBillingPortal }`
- Manages Stripe subscription state globally
- Automatically refreshes on user auth state change
- Feature flags based on subscription tier:
  - `yesNoReading`: Always true (free feature)
  - `dailyReading`: Subscriber + VIP
  - `saveReadings`: VIP only
  - `analysisTool`: VIP only
  - `windsOfChange`: VIP only
  - `celticCross`: VIP unlimited, or users with credits > 0

### 4. Service Layer
**Services** (in `src/services/`):
- `savedReadings.ts`: CRUD operations for saved readings
- `readingAnalytics.ts`: Analytics queries and aggregations
- All return `{ data, error }` pattern for consistent error handling

### 5. Power Score Calculation
**Module**: `lib/powerScoreCalculator.ts`

**Algorithm**:
- Major Arcana: +10 points each
- Court Cards: +5 points each
- Suit Trines (3+ same suit): +15 points per trine
- Reversals: -2 points each
- Normalized to 0-100 scale

**Insights**:
- Tracks elemental patterns
- Identifies significant life events (Major Arcana)
- Measures energy flow (reversals)

### 6. Celtic Calendar Integration
**Module**: `lib/celticCalendar.ts`

**8 Celtic Festivals**:
1. Samhain (Oct 31) - Celtic New Year
2. Winter Solstice (Dec 21) - Yule
3. Imbolc (Feb 1) - Spring awakening
4. Spring Equinox (Mar 20) - Ostara
5. Beltane (May 1) - Summer beginning
6. Summer Solstice (Jun 21) - Litha
7. Lughnasadh (Aug 1) - First harvest
8. Autumn Equinox (Sep 22) - Mabon

**Functions**:
- `getCelticFestivals(year)` - Get all 8 festivals for year
- `getNearestCelticFestival(date)` - Find nearest festival
- `getSeasonForDate(date)` - Determine Celtic season
- `getCircularPosition(date)` - Convert to 0-360° for calendar visualization

**Visualization**: `CircularYearCalendar.tsx` displays festivals and readings on circular calendar

### 7. Card Reversal Logic
- 50% random chance during selection (`CardSelection.tsx`)
- Affects interpretation (uses `meaning_reversed` or `celtic_meaning_reversed`)
- Impacts power score (negative modifier)
- Displayed with rotation in `TarotCardVisual.tsx`

### 8. Markdown Rendering
- AI interpretations returned in Markdown format
- Rendered with `react-markdown` component
- Custom styling for headings, lists, emphasis
- Supports links, bold, italic, bullet points

---

## Type System

### Core Types (from `src/types/index.ts`)

```typescript
type SpreadType = 'single' | 'three-card' | 'celtic-cross';

interface SelectedCard {
  card: TarotCard;
  position: string;
  positionIndex: number;
  isReversed: boolean;
}

interface Reading {
  spread: SpreadType;
  question?: string;
  cards: SelectedCard[];
  interpretation?: string;
  timestamp: number;
}

interface SavedReading {
  id: string;
  user_id: string;
  title?: string;
  spread_type: SpreadType;
  question?: string;
  cards: SelectedCard[];
  interpretation?: string;
  is_public: boolean;
  reading_source: 'personal' | 'daily';
  // Analytics fields
  accuracy_rating?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  power_score?: number;
  major_arcana_count?: number;
  court_card_count?: number;
  suit_pattern_score?: number;
  reversal_percentage?: number;
  tags?: string[];
  // Timestamps
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
}
```

---

## Environment Variables

### Required (`.env`)
```bash
VITE_SUPABASE_URL=https://ktjbtkkltvkmdwzkcwij.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
VITE_ANTHROPIC_API_KEY=[your-api-key]
```

### Supabase Function Secrets
```bash
ANTHROPIC_API_KEY=[set in Supabase dashboard]
SUPABASE_URL=[auto-provided]
SUPABASE_SERVICE_ROLE_KEY=[auto-provided]
```

---

## External Integrations

### N8N Workflows
- **Daily Reading Generation**: Scheduled workflow generates reading, saves to DB, sends emails
- **Workflow Files**: `n8n-daily-reading-*.json` (multiple versions)
- **Email Provider**: Resend (for transactional emails)
- **Subscriber Fetching**: Calls `get-subscribers` edge function

### Netlify Deployment
- **Config**: `_redirects` file for SPA routing
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Auto-deploy**: On push to `main` branch

---

## Development Guidelines

### Component Organization
- One component per file
- Co-locate related components (e.g., modals with parent)
- Use TypeScript interfaces for props
- Export default for main component

### State Management
- React Context for global state (Auth)
- Local state with useState for component-specific
- Supabase real-time subscriptions for live updates (if needed)
- No Redux or external state library

### Error Handling
- Try-catch in async functions
- Service layer returns `{ data, error }` pattern
- Display user-friendly error messages
- Log errors to console for debugging

### Styling Conventions
- Use Tailwind utility classes
- Custom Celtic classes prefixed with `calan-`
- Inline styles for dynamic colors (gradients, shadows)
- Font families defined inline for Celtic typography

### API Calls
- Supabase client for database queries
- Edge functions for AI and business logic
- CORS headers on all edge functions
- Bearer token authentication

---

## Deployment & Migration Workflow

### Database Changes
1. Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_description.sql`
2. Test locally with `npx supabase db reset` (if applicable)
3. Deploy: `npx supabase db push`
4. Verify in Supabase dashboard

### Edge Function Deployment
1. Develop function in `supabase/functions/<name>/index.ts`
2. Test locally: `npx supabase functions serve`
3. Deploy: `npx supabase functions deploy <name>`
4. Set secrets via Supabase dashboard if needed
5. Update `supabase/config.toml` if JWT verification needed

### Frontend Deployment
1. Commit and push to `main` branch
2. Netlify auto-deploys
3. Monitor build logs in Netlify dashboard
4. Test on production URL

---

## Testing the Application

### Manual Testing Checklist
- [ ] Landing page loads with all sections
- [ ] Can start a new reading (spread selection → cards → interpretation)
- [ ] Can switch between traditional/Celtic meanings
- [ ] Can save a reading (requires auth)
- [ ] Can view saved readings
- [ ] Can rate and add notes to saved readings
- [ ] Analytics dashboard shows correct data
- [ ] Daily reading displays today's reading
- [ ] Can subscribe/unsubscribe to emails
- [ ] Admin panel accessible (with auth)
- [ ] Shared reading links work publicly

### Common Issues
- **Images not loading**: Check Supabase storage URLs and CORS
- **Auth not working**: Verify Google OAuth config in Supabase
- **Interpretations failing**: Check Anthropic API key and function deployment
- **Analytics empty**: Ensure saved readings exist with metrics

---

## Key Files Reference

### Configuration
- `vite.config.ts` - Vite bundler config
- `tailwind.config.js` - TailwindCSS with Celtic colors
- `tsconfig.json` - TypeScript compiler options
- `supabase/config.toml` - Supabase project config
- `.env` - Environment variables (not in git)

### Entry Points
- `index.html` - HTML entry point
- `src/main.tsx` - React app mount point
- `src/App.tsx` - Root component with routing

### Core Components
- `src/components/Layout.tsx` - App shell with navigation
- `src/components/LandingPage.tsx` - Homepage
- `src/components/TarotFlow.tsx` - Main reading wizard
- `src/components/AdminPanel.tsx` - Admin dashboard
- `src/components/PricingPage.tsx` - Stripe subscription pricing page
- `src/components/SuccessPage.tsx` - Post-checkout success page

### Contexts
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/contexts/SubscriptionContext.tsx` - Stripe subscription state management

### Utilities
- `src/lib/supabase.ts` - Supabase client initialization
- `src/lib/celticCalendar.ts` - Celtic festival calculations
- `src/lib/powerScoreCalculator.ts` - Reading power metrics

---

## Future Enhancement Ideas
- Mobile app (React Native or PWA)
- More spread types (Horseshoe, Tree of Life)
- User profiles with reading history
- Social sharing with custom card images
- Meditation timer with card focus
- Journal integration for reflection
- Community features (share interpretations)
- Multi-language support (Irish Gaelic?)

---

## Resources & Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [React Router v7](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Celtic Calendar](https://en.wikipedia.org/wiki/Wheel_of_the_Year)
- [Tarot Card Meanings](https://www.biddytarot.com/)

---

## Project Maintainer Notes

This is a personal project with a focus on:
1. **User Experience** - Smooth animations, beautiful UI, mystical aesthetic
2. **Accuracy** - Authentic tarot meanings with Celtic cultural integration
3. **Privacy** - User readings are private by default, public sharing opt-in
4. **Simplicity** - No ads, no tracking, no upsells - just tarot

The codebase prioritizes readability and maintainability over premature optimization.
