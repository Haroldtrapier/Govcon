# 🚀 Daily Automation System Setup Guide

## Overviow

This automation system fetches customer data from Google Sheets, searches SAM.gov for relevant government contracting opportunities, and sends personalized daily email briefs to onboarded customers.

---

## 📁 System Architecture

### API Routes

1. **`/api/sam-gov/search`** - SAM.gov API Integration
   - Searches for opportunities by NAICS codes and keywords
   - Filters by date range for live data
   - Returns top opportunities

2. **`/api/email/send`** - Email Service (Resend)
   - Sends HTML emails via Resend
   - Branded from `info@trapiermanagement.com`

3. **`/api/daily-brief`** - Daily Orchestrator (Cron Target)
   - Fetches customers from Google Sheets
   - Processes each onboarded customer
   - Searches SAM.gov for their criteria
   - Generates and sends personalized email

### Cron Schedule

- **Schedule:** Every day at **8:00 AM EST (1:00 PM UTC)**
- **Configuration:** `vercel.json`

---

## 🔐 Environment Variables

Add these in your Vercel project settings:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SAM_GOV_API_KEY` | SAM.gov API key | `SAM-xxxxx-xxxx` |
| `RESEND_API_KEY` | Resend API key | `re_xxxxxxxx` |
| `GOOGLE_SHEETS_URL` | Google Apps Script endpoint | `https://script.google.com/macros/s/.../exec` |
| `CRON_SECRET` | Secret token for cron authentication | `gc-cron-2026-secure-xyz` |

---

## 📧 Email Setup (Resend)

### 1. Verify Your Domain

1. Go to [Resend Domains](https://resend.com/domains)
2. Add domain: `trapiermanagement.com`
3. Add DNS records provided by Resend:
   - SPF Record (TXT)
   - DKIM Record (TXT)
   - DMARC Record (TXT)
4. Wait for verification (green checkmark)

### 2. Test Email Sending

Once verified, emails will be sent from:
- **From:** `GovCon Command Center <info@trapiermanagement.com>`

---

## 🗂️ Google Sheets Integration

### Expected Data Format

Your Google Apps Script must return JSON in this format:

```json
{
  "customers": [
    {
      "email": "customer@example.com",
      "name": "John Doe",
      "onboardingCompleted": true,
      "naicsCodes": ["541511", "541512"],
      "keywords": ["cybersecurity", "IT services"]
    }
  ]
}
```

### Required Fields

- `email` (string): Customer email address
- `name` (string): Customer name
- `onboardingCompleted` (boolean): Only `true` customers receive emails
- `naicsCodes` (array): List of NAICS codes
- `keywords` (array): Search keywords

---

## 🚀 Deployment

### Automatic Deployment

Vercel will auto-deploy when you push to GitHub. The cron job will automatically activate.

### Manual Testing

Test the daily brief manually:

```bash
curl https://your-app.vercel.app/api/daily-brief \
  -H "Authorization: Bearer your-cron-secret"
```

---

## 📊 Monitoring

### Check Cron Logs

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Click **Logs** tab
4. Filter by `/api/daily-brief`

### Email Delivery

Monitor email delivery in [Resend Dashboard](https://resend.com/emails)

---

## 🐛 Troubleshooting

### No Emails Sent

1. **Check environment variables** in Vercel
2. **Verify Resend domain** is active (green checkmark)
3. **Check cron logs** for errors
4. **Test Google Sheets URL** returns valid JSON

### SAM.gov API Errors

1. **Verify API key** is valid
2. **Check rate limits** (SAM.gov has usage limits)
3. **Review NAICS codes** (must be valid 6-digit codes)

### Cron Not Running

1. **Verify `vercel.json`** exists in root
2. **Check cron secret** matches environment variable
3. **Review deployment logs** for errors

---

## 📅 Daily Workflow

**8:00 AM EST Daily:**

1. ✅ Vercel triggers `/api/daily-brief`
2. ✅ Fetches all customers from Google Sheets
3. ✅ Filters for `onboardingCompleted: true`
4. ✅ For each customer:
   - Searches SAM.gov with their NAICS + keywords
   - Gets TODAY'S opportunities only
   - Generates personalized email
   - Sends via Resend
5. ✅ Logs results (success/failure per customer)

---

## 🎯 What Customers Receive

### Email Format

- **Subject:** "GovCon Command Center - Daily Brief [Date]"
- **From:** info@trapiermanagement.com
- **Content:**
  - Personalized greeting
  - Top 10 opportunities (LIVE from SAM.gov)
  - Each opportunity includes:
    - Title
    - Agency
    - Type
    - Posted Date
    - Deadline
    - NAICS Code
    - Description snippet
    - Link to full opportunity

---

## 🔒 Security

- **Cron authentication:** Bearer token required
- **Environment variables:** Stored securely in Vercel
- **API keys:** Never committed to Git
- **HTTPS:** All requests encrypted

---

## 📝 Next Steps

1. ✅ Add environment variables to Vercel
2. ✅ Verify Resend domain
3. ✅ Test Google Sheets endpoint
4. ✅ Wait for first automated run (8AM EST tomorrow)
5. ✅ Monitor logs and email delivery

---

**Need help?** Check Vercel logs or Resend dashboard for detailed error messages.
