# Personal Tarot Reading Subscription Setup Guide

This guide explains how to set up the daily tarot subscription system that sends 3-card readings to subscribers via email.

## Overview

The subscription system consists of:
1. **Subscribers Database Table** - Stores subscriber email addresses
2. **Supabase Edge Functions** - Handle subscribe/unsubscribe/get-subscribers operations
3. **Subscription UI Component** - Allows users to subscribe/unsubscribe on the website
4. **n8n Workflow** - Automated daily email sending to all subscribers

## 1. Database Setup

### Apply the Migration

Run the migration to create the subscribers table:

```bash
npx supabase db push
```

Or manually run the SQL in `supabase/migrations/20251105000000_create_subscribers_table.sql`

### Table Structure

The `subscribers` table includes:
- `id` - UUID primary key
- `email` - Unique email address (lowercase)
- `is_active` - Boolean indicating if subscription is active
- `subscribed_at` - Timestamp when user subscribed
- `unsubscribed_at` - Timestamp when user unsubscribed (if applicable)
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

### Row Level Security (RLS)

The table has RLS enabled with policies that:
- Allow anyone to subscribe (INSERT)
- Allow users to unsubscribe (UPDATE)
- Allow service role to read all subscribers

## 2. Supabase Edge Functions

Three edge functions are provided:

### Deploy Functions

Deploy all functions to Supabase:

```bash
npx supabase functions deploy subscribe
npx supabase functions deploy unsubscribe
npx supabase functions deploy get-subscribers
```

### Function Details

#### **subscribe** (`/functions/v1/subscribe`)
- **Method**: POST
- **Body**: `{ "email": "user@example.com" }`
- **Purpose**: Subscribe a new email or reactivate an existing subscription
- **Returns**: Success message with subscription details

#### **unsubscribe** (`/functions/v1/unsubscribe`)
- **Method**: POST
- **Body**: `{ "email": "user@example.com" }`
- **Purpose**: Deactivate an active subscription
- **Returns**: Success message confirming unsubscription

#### **get-subscribers** (`/functions/v1/get-subscribers`)
- **Method**: GET
- **Purpose**: Retrieve all active subscribers (requires service role key)
- **Returns**: Array of active subscriber emails
- **Note**: This is used by the n8n workflow

## 3. Website Integration

The `SubscriptionSubscription` component is added to the landing page and allows users to:
- Subscribe to daily readings
- Unsubscribe from daily readings
- Toggle between subscribe/unsubscribe modes
- See confirmation messages

The component is located at `src/components/SubscriptionSubscription.tsx`

## 4. n8n Workflow Setup

### Update Your Existing Workflow

You need to modify your existing daily reading n8n workflow to send emails to all subscribers.

#### Step 1: Add "Get Subscribers" Node

After your daily reading is generated, add an HTTP Request node:

1. **Node Name**: "Get Active Subscribers"
2. **Method**: GET
3. **URL**: `https://[your-supabase-project].supabase.co/functions/v1/get-subscribers`
4. **Authentication**: Generic Credential Type
   - **Header Auth Name**: `Authorization`
   - **Header Auth Value**: `Bearer [your-supabase-anon-key]`
5. **Options**:
   - Response Format: JSON

#### Step 2: Split Out Subscribers

Add a "Split Out" node to iterate over each subscriber:

1. **Node Name**: "Split Subscribers"
2. **Connect From**: Get Active Subscribers
3. **Field to Split Out**: `subscribers`

#### Step 3: Send Email to Each Subscriber

Modify or duplicate your existing email sending node:

1. **Node Name**: "Send to Subscriber"
2. **Connect From**: Split Subscribers
3. **Email Configuration**:
   - **To**: `{{ $json.email }}`
   - **Subject**: "Your Daily Tarot Reading - [Date]"
   - **Body**: Use the same reading content from the daily reading generation

### Complete Workflow Structure

```
1. Schedule Trigger (Daily at X time)
   ↓
2. Generate Daily Reading (Existing)
   ↓
3. Save Reading to Database (Existing)
   ↓
4. Get Active Subscribers (NEW)
   ↓
5. Split Subscribers (NEW)
   ↓
6. Send Email to Each Subscriber (MODIFIED)
```

### Example n8n HTTP Request Configuration

**Get Active Subscribers Node:**

```json
{
  "method": "GET",
  "url": "https://ktjbtkkltvkmdwzkcwij.supabase.co/functions/v1/get-subscribers",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "httpHeaderAuth": {
    "name": "Authorization",
    "value": "Bearer YOUR_SUPABASE_ANON_KEY"
  },
  "options": {
    "response": {
      "response": {
        "responseFormat": "json"
      }
    }
  }
}
```

**Email Node Configuration:**

Make sure to use the reading URL from the daily reading generation:

```
{{ $node["Generate Daily Reading"].json["shareableUrl"] }}
```

## 5. Testing

### Test Subscription Flow

1. Visit your website at https://sidhe.netlify.app
2. Scroll down to the "Personal Tarot Reading" section
3. Enter your email and click "Get My Personal Reading Daily"
4. Check that you receive a success message

### Test Database

Check that the subscriber was added:

```sql
SELECT * FROM subscribers WHERE email = 'your-test-email@example.com';
```

### Test Unsubscribe

1. Enter the same email on the website
2. Switch to "Unsubscribe" mode
3. Click "Unsubscribe from Daily Readings"
4. Verify `is_active` is now `false` in the database

### Test n8n Workflow

1. Trigger your n8n workflow manually
2. Check that:
   - The daily reading is generated
   - Subscribers are fetched
   - Emails are sent to all active subscribers

## 6. Deployment Checklist

- [ ] Database migration applied
- [ ] All three edge functions deployed
- [ ] Website rebuilt and deployed with SubscriptionSubscription component
- [ ] n8n workflow updated with subscriber fetching
- [ ] Test email subscription works
- [ ] Test email unsubscription works
- [ ] Test daily email sending works
- [ ] Verify emails contain the reading URL

## 7. Environment Variables

Ensure these environment variables are set in Netlify:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

And in your n8n workflow:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key (for get-subscribers)
- `RESEND_API_KEY` - Your Resend API key (for sending emails)

## 8. Email Template

The emails sent should include:
- Subject line with the date
- The daily reading cards with images
- Link to the full reading on the website
- Unsubscribe instructions/link

### Unsubscribe Link

In your email template, include:

```
To unsubscribe, visit: https://sidhe.netlify.app and scroll to the subscription section.
```

Or implement a one-click unsubscribe by adding a token parameter to the URL.

## 9. Privacy & Compliance

- Only collect email addresses, no other personal information
- Clearly state what subscribers will receive
- Make unsubscribe easy and accessible
- Store minimal data
- Follow GDPR/email marketing best practices

## 10. Monitoring

Monitor your subscribers with this query:

```sql
-- Active subscriber count
SELECT COUNT(*) FROM subscribers WHERE is_active = true;

-- Recent subscriptions
SELECT email, subscribed_at
FROM subscribers
WHERE is_active = true
ORDER BY subscribed_at DESC
LIMIT 10;

-- Unsubscribe rate
SELECT
  COUNT(CASE WHEN is_active = false THEN 1 END) as unsubscribed,
  COUNT(*) as total,
  ROUND(COUNT(CASE WHEN is_active = false THEN 1 END)::numeric / COUNT(*) * 100, 2) as unsubscribe_rate
FROM subscribers;
```

## Support

If you encounter issues:

1. Check Supabase function logs for errors
2. Check n8n workflow execution logs
3. Verify all environment variables are set correctly
4. Test each component individually
5. Check email deliverability (spam folder, etc.)
