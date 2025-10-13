# Supabase Authentication for n8n - Quick Guide

## Finding Your Supabase Credentials

### 1. Get Your Supabase URL
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Project Settings** (gear icon in the left sidebar)
4. Click on **API**
5. Copy the **Project URL**
   - Example: `https://abcdefghijklmnop.supabase.co`

### 2. Get Your Supabase Anon Key
1. In the same **API** settings page
2. Under **Project API keys**, find `anon` `public`
3. Click **Reveal** and copy the key
   - It starts with `eyJ...` and is quite long
   - This is safe to use in client-side applications

## Setting Up n8n HTTP Request Authentication

The workflow I provided uses **environment variables**, but here are all methods:

### Method 1: Using Environment Variables (Recommended)

**If using n8n Cloud or Docker:**

Add to your environment configuration:
```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The workflow will automatically use `{{ $env.SUPABASE_URL }}` and `{{ $env.SUPABASE_ANON_KEY }}`

### Method 2: Direct Values in HTTP Request Node (Easiest for Testing)

In the **HTTP Request** node "Generate Daily Reading":

1. **URL**:
   ```
   https://YOUR_PROJECT.supabase.co/functions/v1/generate-daily-reading
   ```
   Replace `YOUR_PROJECT` with your actual project reference

2. **Authentication**: Select `None`

3. **Headers** section:
   - Enable **"Send Headers"**
   - Add two headers:

     **Header 1:**
     - Name: `Authorization`
     - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your actual anon key)

     **Header 2:**
     - Name: `Content-Type`
     - Value: `application/json`

### Method 3: Using n8n HTTP Header Auth Credential

1. In the **HTTP Request** node
2. **Authentication**: Select `Generic Credential Type`
3. **Generic Auth Type**: Select `Header Auth`
4. Click **Create New Credential**
5. Configure the credential:
   - **Credential Name**: `Supabase Auth`
   - **Name**: `Authorization`
   - **Value**: `Bearer YOUR_SUPABASE_ANON_KEY`
6. Save the credential
7. Select it in the HTTP Request node

## Testing Your Setup

### Test in n8n

1. Open the workflow in n8n
2. Click the **Execute Workflow** button (play icon)
3. Check the **HTTP Request** node output
4. You should see JSON with cards and interpretation

### Test with curl

```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/generate-daily-reading' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"meaningType": "celtic"}'
```

## Common Authentication Errors

### Error: "Invalid API key"
- **Cause**: Wrong anon key or missing `Bearer` prefix
- **Fix**: Make sure the Authorization header is exactly: `Bearer YOUR_KEY` (with space after Bearer)

### Error: "Function not found" or 404
- **Cause**: Function not deployed or wrong URL
- **Fix**:
  1. Check the function is deployed in Supabase Dashboard → Edge Functions
  2. Verify the URL format: `https://PROJECT.supabase.co/functions/v1/FUNCTION_NAME`

### Error: "CORS policy"
- **Cause**: Missing headers in the edge function
- **Fix**: The edge function code already includes CORS headers, so this shouldn't happen

### Error: "Missing environment variable ANTHROPIC_API_KEY"
- **Cause**: Anthropic API key not set in Supabase
- **Fix**:
  1. Go to Supabase Dashboard → Edge Functions → Settings
  2. Add secret: `ANTHROPIC_API_KEY` with your Anthropic API key

## Complete n8n HTTP Request Configuration

Here's exactly what your HTTP Request node should look like:

```
Node: HTTP Request
Name: Generate Daily Reading

METHOD: POST

URL: {{ $env.SUPABASE_URL }}/functions/v1/generate-daily-reading
(or hardcode: https://YOUR_PROJECT.supabase.co/functions/v1/generate-daily-reading)

AUTHENTICATION: None (or Generic Credential Type with Header Auth)

SEND HEADERS: ✓ Enabled
  Authorization: Bearer {{ $env.SUPABASE_ANON_KEY }}
  (or hardcode: Bearer eyJhbGci...)
  Content-Type: application/json

SEND BODY: ✓ Enabled
BODY CONTENT TYPE: JSON
BODY:
{
  "meaningType": "celtic"
}
```

## Security Note

The **anon key** is safe to use in client-side applications and n8n workflows because:
- It only allows access based on your Row Level Security (RLS) policies
- It cannot access admin functions
- It's designed to be public-facing

For more sensitive operations, you would use the `service_role` key, but **anon key is correct for this use case**.

## Next Steps

Once authentication is working:
1. ✅ Test the workflow manually
2. ✅ Configure SMTP credentials for email sending
3. ✅ Activate the workflow for daily automation
4. ✅ Check your email inbox for the beautiful tarot reading!

Happy automating! 🌙✨
