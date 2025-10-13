# Using Resend.com for Email Sending in n8n

Resend is a modern email API that's faster and more reliable than traditional SMTP. Here's how to use it with your daily tarot workflow.

## Benefits of Resend

- ✅ No SMTP configuration needed
- ✅ Fast and reliable delivery
- ✅ Better deliverability than traditional SMTP
- ✅ Free tier: 100 emails/day, 3,000/month
- ✅ Modern API with great documentation
- ✅ Built-in email analytics

## Setup Steps

### 1. Create Resend Account

1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. In Resend dashboard, click **API Keys**
2. Click **Create API Key**
3. Name it: `n8n Daily Tarot`
4. Copy the API key (starts with `re_...`)
5. **Save it immediately** - you can't view it again!

### 3. Configure Sending Domain

#### Quick Start (Testing):
- Use Resend's test domain: `onboarding@resend.dev`
- Can only send to your verified email
- No setup required!

#### Production (Your Domain):
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `mysticalreadings.com`)
4. Add these DNS records to your domain:
   - TXT record for domain verification
   - MX, TXT (SPF), TXT (DKIM) records for sending
5. Wait for verification (usually 5-15 minutes)
6. Once verified, you can send from `noreply@yourdomain.com`

## n8n Configuration

### Option A: Replace Send Email Node with HTTP Request (Recommended)

1. **Delete** the existing "Send Email" node from your workflow
2. **Add** a new **HTTP Request** node after "Format Email"
3. Configure it as follows:

#### HTTP Request Node Configuration:

**Method**: `POST`

**URL**: `https://api.resend.com/emails`

**Authentication**: `Generic Credential Type` → `Header Auth`

**Create Credential**:
- **Name**: `Authorization`
- **Value**: `Bearer YOUR_RESEND_API_KEY` (replace with your actual key)

**Send Body**: ✓ Enabled

**Body Content Type**: `JSON`

**JSON Body**:
```json
{
  "from": "SÍDHE Tarot <noreply@yourdomain.com>",
  "to": ["your-email@example.com"],
  "subject": "={{ $json.subject }}",
  "html": "={{ $json.html }}"
}
```

**For testing with Resend's test domain**:
```json
{
  "from": "onboarding@resend.dev",
  "to": ["your-verified-email@example.com"],
  "subject": "={{ $json.subject }}",
  "html": "={{ $json.html }}"
}
```

**Headers** (if not using credential):
- `Authorization`: `Bearer re_YOUR_API_KEY`
- `Content-Type`: `application/json`

### Option B: Use Environment Variables

Set these in your n8n environment:
```env
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=SÍDHE Tarot <noreply@yourdomain.com>
TO_EMAIL=your-email@example.com
```

Then in the HTTP Request node, use:
```json
{
  "from": "={{ $env.FROM_EMAIL }}",
  "to": ["={{ $env.TO_EMAIL }}"],
  "subject": "={{ $json.subject }}",
  "html": "={{ $json.html }}"
}
```

## Updated Workflow Configuration

Here's the complete node setup:

### Node 1: Schedule Trigger
- (No changes needed)

### Node 2: HTTP Request - Generate Daily Reading
- (No changes needed)

### Node 3: Code - Format Email
- (No changes needed)

### Node 4: HTTP Request - Send Email via Resend
**Replace the old Email Send node with this:**

```
Node Type: HTTP Request
Name: Send Email via Resend

METHOD: POST
URL: https://api.resend.com/emails

AUTHENTICATION: Generic Credential Type → Header Auth
CREDENTIAL:
  Name: Authorization
  Value: Bearer re_YOUR_API_KEY

SEND BODY: ✓ Enabled
BODY CONTENT TYPE: JSON

JSON:
{
  "from": "SÍDHE Tarot <noreply@yourdomain.com>",
  "to": ["your-email@example.com"],
  "subject": "={{ $json.subject }}",
  "html": "={{ $json.html }}"
}
```

## Testing Your Setup

### Test in n8n

1. Click **Execute Workflow**
2. Check the HTTP Request (Resend) node output
3. You should see:
   ```json
   {
     "id": "abc123...",
     "from": "noreply@yourdomain.com",
     "to": ["your-email@example.com"],
     "created_at": "2025-01-13T..."
   }
   ```
4. Check your email inbox!

### Test with curl

```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": ["your-email@example.com"],
    "subject": "Test Email",
    "html": "<h1>Hello World</h1>"
  }'
```

## Advanced Features

### Send to Multiple Recipients

```json
{
  "from": "SÍDHE Tarot <noreply@yourdomain.com>",
  "to": ["email1@example.com", "email2@example.com", "email3@example.com"],
  "subject": "={{ $json.subject }}",
  "html": "={{ $json.html }}"
}
```

### Add CC/BCC

```json
{
  "from": "SÍDHE Tarot <noreply@yourdomain.com>",
  "to": ["primary@example.com"],
  "cc": ["copy@example.com"],
  "bcc": ["hidden@example.com"],
  "subject": "={{ $json.subject }}",
  "html": "={{ $json.html }}"
}
```

### Add Reply-To

```json
{
  "from": "SÍDHE Tarot <noreply@yourdomain.com>",
  "reply_to": "hello@yourdomain.com",
  "to": ["your-email@example.com"],
  "subject": "={{ $json.subject }}",
  "html": "={{ $json.html }}"
}
```

### Include Plain Text Version

```json
{
  "from": "SÍDHE Tarot <noreply@yourdomain.com>",
  "to": ["your-email@example.com"],
  "subject": "={{ $json.subject }}",
  "html": "={{ $json.html }}",
  "text": "={{ $json.text }}"
}
```

(Good news: The Format Email node already creates both!)

### Add Tags for Analytics

```json
{
  "from": "SÍDHE Tarot <noreply@yourdomain.com>",
  "to": ["your-email@example.com"],
  "subject": "={{ $json.subject }}",
  "html": "={{ $json.html }}",
  "tags": [
    {
      "name": "category",
      "value": "daily-reading"
    }
  ]
}
```

## Troubleshooting

### Error: "API key is invalid"
- **Fix**: Check your API key starts with `re_` and includes `Bearer ` prefix
- Make sure you're using the Authorization header, not an API key field

### Error: "from address not verified"
- **Fix**: Use `onboarding@resend.dev` for testing, or verify your domain
- Check domain verification status in Resend dashboard

### Error: "to address not allowed"
- **Fix**: With test domain, you can only send to your Resend account email
- Verify your domain to send to anyone

### Email goes to spam
- **Fix**: Verify your domain with all DNS records (SPF, DKIM, DMARC)
- Use a custom domain, not the test domain
- Warm up your domain by sending gradually increasing volumes

### Rate limit exceeded
- **Free tier**: 100 emails/day, 3,000/month
- **Fix**: Upgrade to paid plan if needed ($20/month for 50k emails)

## Resend Dashboard Features

Once emails are sending:
- **Emails tab**: View all sent emails
- **Analytics**: See open rates, click rates (if you add tracking)
- **Logs**: Debug delivery issues
- **Webhooks**: Get notified of bounces, complaints, etc.

## Comparison: SMTP vs Resend

| Feature | SMTP (Gmail, etc.) | Resend API |
|---------|-------------------|------------|
| Setup | Complex (credentials, ports) | Simple (API key) |
| Speed | Slower | Faster |
| Reliability | Can fail | More reliable |
| Deliverability | Lower | Higher |
| Analytics | None | Built-in |
| Free Tier | 100-500/day | 3,000/month |
| Configuration | Multiple fields | JSON body |

## Pricing

**Free Tier:**
- 3,000 emails/month
- 100 emails/day
- Perfect for daily tarot readings!

**Pro ($20/month):**
- 50,000 emails/month
- Custom sending domains
- Priority support

**Enterprise:**
- Custom pricing
- Dedicated IPs
- Advanced features

## Complete Updated Workflow

Your final workflow should look like:

1. **Schedule Trigger** (7 AM daily)
   ↓
2. **HTTP Request** → Supabase (Generate Reading)
   ↓
3. **Code** → Format Email (HTML + Text)
   ↓
4. **HTTP Request** → Resend (Send Email)

## Next Steps

1. ✅ Sign up for Resend.com
2. ✅ Get your API key
3. ✅ Replace Email Send node with HTTP Request
4. ✅ Configure with your API key
5. ✅ Test with `onboarding@resend.dev`
6. ✅ (Optional) Verify your domain for production
7. ✅ Activate workflow and enjoy daily readings!

## Resources

- **Resend Docs**: https://resend.com/docs
- **API Reference**: https://resend.com/docs/api-reference/emails/send-email
- **n8n HTTP Request**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/

Happy automating with Resend! 🚀📧
