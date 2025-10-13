# Daily Tarot Reading Email Automation Setup

This guide will help you set up automated daily tarot readings sent to your email using n8n and Supabase edge functions.

## Overview

The system consists of two main components:
1. **Supabase Edge Function**: `generate-daily-reading` - Randomly selects 3 cards and generates an interpretation using Claude Sonnet 4.5
2. **n8n Workflow**: Runs daily at a scheduled time, calls the edge function, formats the result as a beautiful HTML email, and sends it

## Prerequisites

- Supabase project with edge functions enabled
- n8n instance (cloud or self-hosted)
- SMTP email account (Gmail, SendGrid, etc.)
- The following environment variables:
  - `SUPABASE_URL` - Your Supabase project URL
  - `SUPABASE_ANON_KEY` - Your Supabase anon/public key
  - `ANTHROPIC_API_KEY` - Your Anthropic API key (should already be set)

## Step 1: Deploy the Supabase Edge Function

### Option A: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. Name it: `generate-daily-reading`
5. Copy the entire contents of `/supabase/functions/generate-daily-reading/index.ts`
6. Paste it into the function editor
7. Click **Deploy**

### Option B: Via Supabase CLI

```bash
# If you have Supabase CLI installed and configured
supabase functions deploy generate-daily-reading
```

### Test the Function

You can test the function using curl:

```bash
curl -X POST 'https://YOUR_SUPABASE_URL/functions/v1/generate-daily-reading' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "meaningType": "celtic"
  }'
```

Expected response:
```json
{
  "date": "2025-01-13T...",
  "spread": "Three Card Spread",
  "meaningType": "celtic",
  "question": null,
  "cards": [
    {
      "name": "The Fool",
      "position": "Past",
      "isReversed": false,
      "keywords": ["new beginnings", "innocence", "spontaneity", "free spirit"],
      ...
    },
    ...
  ],
  "interpretation": "..."
}
```

## Step 2: Set Up n8n Workflow

### Import the Workflow

1. Open your n8n instance
2. Click **+ Add workflow** or open an existing workflow
3. Click the **three dots** menu (⋯) in the top right
4. Select **Import from File** or **Import from URL**
5. Select the file: `n8n-daily-tarot-workflow.json`
6. The workflow will be imported with 4 nodes:
   - Schedule Trigger (runs daily at 7 AM)
   - HTTP Request (calls Supabase function)
   - Code (formats the email)
   - Send Email (sends the formatted email)

### Configure Environment Variables

In n8n, you need to set up the following environment variables:

#### Method 1: Using n8n Environment Variables (Recommended)

Add these to your n8n environment configuration file or Docker environment:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
FROM_EMAIL=your-email@example.com
TO_EMAIL=your-email@example.com
```

#### Method 2: Edit Nodes Directly

If you prefer to hardcode values:

1. **HTTP Request Node** ("Generate Daily Reading"):
   - Replace `{{ $env.SUPABASE_URL }}` with your actual Supabase URL
   - Replace `{{ $env.SUPABASE_ANON_KEY }}` with your actual anon key

2. **Send Email Node**:
   - Replace `{{ $env.FROM_EMAIL }}` with the sender email
   - Replace `{{ $env.TO_EMAIL }}` with your email address

### Configure SMTP Credentials

1. Click on the **Send Email** node
2. Click **Create New Credential** under "Credentials"
3. Fill in your SMTP details:

#### For Gmail:
- **Host**: `smtp.gmail.com`
- **Port**: `465` (SSL) or `587` (TLS)
- **User**: Your Gmail address
- **Password**: Your Gmail App Password (not your regular password)
  - Generate an App Password: https://myaccount.google.com/apppasswords

#### For SendGrid:
- **Host**: `smtp.sendgrid.net`
- **Port**: `587`
- **User**: `apikey` (literally the word "apikey")
- **Password**: Your SendGrid API key

#### For Other Providers:
Consult your email provider's SMTP documentation.

### Customize the Schedule

The default schedule is **7:00 AM every day**. To change this:

1. Click on the **Schedule Trigger** node
2. Modify the **Cron Expression**: `0 7 * * *`

Common cron expressions:
- `0 8 * * *` - 8:00 AM every day
- `0 20 * * *` - 8:00 PM every day
- `0 7 * * 1` - 7:00 AM every Monday
- `0 7 * * 1,3,5` - 7:00 AM on Mon, Wed, Fri

### Activate the Workflow

1. Click **Save** to save your workflow
2. Toggle the **Active** switch in the top right corner
3. Your workflow is now live and will run on schedule!

## Step 3: Test the Workflow

### Manual Test

1. In the n8n workflow editor, click **Execute Workflow** (the play button)
2. This will run the workflow immediately
3. Check your email inbox for the tarot reading
4. If there are errors, check the execution log in n8n

### Check Execution History

- Click on **Executions** in the left sidebar
- View past workflow runs, their status, and any error messages
- Debug issues by examining the data passed between nodes

## Customization Options

### Change Reading Type

By default, the workflow uses Celtic mythology interpretations. To switch to traditional:

1. Edit the **HTTP Request** node ("Generate Daily Reading")
2. In the **Body Parameters** section, change:
   ```json
   {
     "meaningType": "traditional"
   }
   ```

### Add a Daily Question

To include a specific question in your daily reading:

1. Edit the **HTTP Request** node
2. Add to the body parameters:
   ```json
   {
     "meaningType": "celtic",
     "question": "What guidance do I need for today?"
   }
   ```

### Multiple Recipients

To send to multiple email addresses:

1. Edit the **Send Email** node
2. In the **To Email** field, use comma-separated addresses:
   ```
   email1@example.com, email2@example.com, email3@example.com
   ```

### Different Spreads for Different Days

To use different reading types on different days:

1. Add a **Code** node after the Schedule Trigger
2. Add logic like:
   ```javascript
   const day = new Date().getDay();
   const meaningType = (day === 0 || day === 6) ? 'celtic' : 'traditional';
   return { meaningType };
   ```
3. Use the output in the HTTP Request body

## Troubleshooting

### Email Not Sending

- **Check SMTP credentials**: Make sure your email credentials are correct
- **Gmail App Password**: If using Gmail, you MUST use an App Password, not your regular password
- **Firewall**: Ensure your n8n instance can reach the SMTP server (check firewall rules)
- **Spam folder**: Check your spam/junk folder

### Function Returns Error

- **Check Supabase logs**: Go to Supabase Dashboard → Edge Functions → View logs
- **Verify environment variables**: Make sure `ANTHROPIC_API_KEY` is set in Supabase
- **Test the interpretation function**: Make sure `generate-tarot-interpretation` is working correctly
- **Check API limits**: Ensure you haven't exceeded Anthropic API rate limits

### Workflow Not Running

- **Check Active status**: Make sure the workflow is toggled to "Active"
- **Verify schedule**: Double-check your cron expression is correct
- **Timezone**: Be aware of n8n's timezone settings (it may differ from your local timezone)
- **Check executions**: Look at the Executions tab for error messages

### Formatting Issues

- **HTML not rendering**: Some email clients don't support all HTML/CSS features
- **Images missing**: If you add card images, make sure they're publicly accessible URLs
- **Markdown not converting**: Check the Format Email node's JavaScript code

## Advanced Features

### Save Readings to Database

To keep a history of your readings, add a **Supabase** node after "Format Email":

1. Add a **Supabase** node
2. Operation: **Insert**
3. Table: `daily_readings` (create this table first)
4. Data to insert:
   ```json
   {
     "date": "={{ $node['Generate Daily Reading'].json.date }}",
     "cards": "={{ JSON.stringify($node['Generate Daily Reading'].json.cards) }}",
     "interpretation": "={{ $node['Generate Daily Reading'].json.interpretation }}"
   }
   ```

### Include Card Images

If your cards have images:

1. Make sure `image_url` is populated in the tarot deck
2. Modify the **Format Email** node's JavaScript
3. Add image tags in the cards HTML section:
   ```javascript
   <img src="${card.image_url}" alt="${card.name}" style="max-width: 200px; border-radius: 8px; margin-bottom: 15px;">
   ```

### Webhook Alternative

Instead of a schedule, you can trigger readings on-demand:

1. Replace the Schedule Trigger with a **Webhook** node
2. Set the webhook path (e.g., `/daily-tarot`)
3. Call the webhook URL to trigger a reading anytime

## Support

For issues or questions:
- **Supabase**: https://supabase.com/docs
- **n8n**: https://docs.n8n.io
- **Anthropic API**: https://docs.anthropic.com

## Example Email Preview

Your daily email will include:
- 🌙 **SÍDHE header** with date
- 🃏 **Three cards** (Past, Present, Future) with:
  - Card name and position
  - Orientation (Upright or ⟲ Inverted)
  - Keywords in styled badges
  - Individual card meaning
- 🔮 **Full interpretation** from Claude Sonnet 4.5 with:
  - Markdown formatting (headings, bold, italic, lists)
  - Celtic mythology references (if Celtic type selected)
  - Actionable guidance
- ✨ **Celtic-themed styling** with gold and amber colors

Enjoy your daily mystical guidance! 🌙✨
