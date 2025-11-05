# Personal Reading Subscription Deployment Steps

## What Was Created

I've added a complete personal reading subscription system to your SÍDHE Tarot application. Here's what's included:

### 1. Database
- **Migration**: `supabase/migrations/20251105000000_create_subscribers_table.sql`
- Creates a `subscribers` table with email management and RLS policies

### 2. Supabase Edge Functions
- **subscribe** - Handles new subscriptions and reactivations
- **unsubscribe** - Handles unsubscriptions
- **get-subscribers** - Fetches all active subscribers (for n8n)

### 3. UI Component
- **DailyReadingSubscription** - Beautiful subscription form on the landing page
- Allows users to subscribe/unsubscribe with toggle
- Matches your Celtic theme design

### 4. Website
- ✅ Already deployed to https://sidhe.netlify.app
- Subscription form is now visible on the homepage

## Steps to Complete Setup

### Step 1: Apply Database Migration

Run this command to create the subscribers table:

```bash
npx supabase db push
```

If you don't have Supabase CLI linked, you can manually run the SQL in the Supabase dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Copy and paste the contents of `supabase/migrations/20251105000000_create_subscribers_table.sql`
5. Click Run

### Step 2: Deploy Supabase Edge Functions

Deploy all three functions:

```bash
# Make sure you're logged in to Supabase CLI
npx supabase login

# Link to your project (if not already linked)
npx supabase link --project-ref ktjbtkkltvkmdwzkcwij

# Deploy functions
npx supabase functions deploy subscribe
npx supabase functions deploy unsubscribe
npx supabase functions deploy get-subscribers
```

### Step 3: Test the Subscription Feature

1. Visit https://sidhe.netlify.app
2. Scroll down to the "Personal Tarot Reading" section
3. Enter your email address
4. Click "Subscribe to Daily Readings"
5. You should see a success message

Test unsubscribe:
1. Enter the same email
2. Switch to "Unsubscribe" mode
3. Click "Unsubscribe from Daily Readings"
4. Verify you see a success message

### Step 4: Update Your n8n Workflow

You need to modify your existing daily reading workflow to send to subscribers. Here's how:

#### Add Three New Nodes to Your Workflow:

1. **HTTP Request Node: "Get Active Subscribers"**
   - Position: After daily reading is generated
   - Method: GET
   - URL: `https://ktjbtkkltvkmdwzkcwij.supabase.co/functions/v1/get-subscribers`
   - Authentication: Header Auth
     - Name: `Authorization`
     - Value: `Bearer [your-supabase-anon-key]`

2. **Split Out Node: "Split Subscribers"**
   - Connect from: Get Active Subscribers
   - Field to Split: `subscribers`

3. **Email Node: "Send to Each Subscriber"** (modify existing or create new)
   - Connect from: Split Subscribers
   - To: `{{ $json.email }}`
   - Subject: Your existing subject
   - Body: Your existing email template with the reading

#### Workflow Structure:
```
Schedule Trigger
    ↓
Generate Daily Reading
    ↓
Save to Database
    ↓
Get Active Subscribers (NEW)
    ↓
Split Subscribers (NEW)
    ↓
Send Email to Each (MODIFIED)
```

### Step 5: Verify Everything Works

1. **Check Database**:
   ```sql
   SELECT * FROM subscribers WHERE is_active = true;
   ```

2. **Test n8n Workflow**:
   - Manually trigger the workflow
   - Verify it sends to all active subscribers

3. **Check Emails**:
   - Verify subscribers receive the daily reading
   - Verify the reading URL works

## Files Created/Modified

### New Files:
- `supabase/migrations/20251105000000_create_subscribers_table.sql`
- `supabase/functions/subscribe/index.ts`
- `supabase/functions/unsubscribe/index.ts`
- `supabase/functions/get-subscribers/index.ts`
- `src/components/DailyReadingSubscription.tsx`
- `SUBSCRIPTION-SETUP.md` (comprehensive guide)
- `DEPLOYMENT-STEPS.md` (this file)

### Modified Files:
- `src/components/LandingPage.tsx` - Added subscription component

## Environment Variables

Make sure these are set in your environment:

**Netlify** (already set):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Supabase Functions** (automatically available):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

**n8n** (you need to add):
- `SUPABASE_URL` (if not already set)
- `SUPABASE_ANON_KEY` (if not already set)

## Troubleshooting

### Function deployment fails
```bash
# Make sure you're logged in and linked
npx supabase login
npx supabase link --project-ref ktjbtkkltvkmdwzkcwij
```

### Migration fails
- Check if table already exists
- Try running the SQL manually in Supabase dashboard

### Subscription form doesn't work
- Check browser console for errors
- Verify Supabase functions are deployed
- Check Supabase function logs

### n8n workflow doesn't get subscribers
- Verify get-subscribers function is deployed
- Check the Authorization header is correct
- Look at n8n execution logs

## Support

For detailed information, see `SUBSCRIPTION-SETUP.md`.

For questions about the existing workflow, see:
- `DAILY-TAROT-SETUP.md`
- `RESEND-EMAIL-GUIDE.md`
- `n8n-daily-tarot-workflow-resend.json`
