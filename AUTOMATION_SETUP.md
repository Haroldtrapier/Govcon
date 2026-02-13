# 🚀 GovCon Daily Automation - Setup Guide

## 📋 Environment Variables

Add these to your Vercel project:

### Required API Keys:

1. **SAM_GOV_API_KEY**
   ```
   SAM-ba00b415-fcf2-4017-8923-c07741e731b6
   ```

2. **RESEND_API_KEY**
   ```
   re_detAz1YD_4mUGzoCD5LgftuhKdT5oT1n7
   ```

3. **GOOGLE_SHEETS_URL**
   ```
   https://script.google.com/macros/s/AKfycbw29AV9v8kTsDuND3zXipKvZmxa2j0Kes-XT-1-V0LwI3rnaWn8gY4qChJWgieuulcAi/exec
   ```

4. **CRON_SECRET** (generate a random string)
   ```
   your-random-secret-here-12345
   ```

---

## 🔧 Vercel Setup Steps:

### 1. Add Environment Variables:
```bash
vercel env add SAM_GOV_API_KEY
vercel env add RESEND_API_KEY
vercel env add GOOGLE_SHEETS_URL
vercel env add CRON_SECRET
```

Or add them in Vercel Dashboard:
- Go to: https://vercel.com/[your-project]/settings/environment-variables
- Add each variable for Production, Preview, and Development

### 2. Deploy:
```bash
git add .
git commit -m "Add daily automation system"
git push
```

Vercel will auto-deploy and enable the cron job!

---

## 📧 Resend Domain Setup:

### Verify trapiermanagement.com:

1. Go to https://resend.com/domains
2. Add domain: `trapiermanagement.com`
3. Add these DNS records to your domain:

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM Record 1:**
```
Type: TXT
Name: resend._domainkey
Value: [provided by Resend]
```

**DKIM Record 2:**
```
Type: TXT  
Name: resend2._domainkey
Value: [provided by Resend]
```

**DMARC Record:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:info@trapiermanagement.com
```

Wait 10-15 minutes for DNS propagation, then verify in Resend dashboard.

---

## ⏰ Cron Schedule:

The automation runs **daily at 8:00 AM EST (1:00 PM UTC)**

- Schedule: `0 13 * * *`
- Route: `/api/daily-brief`
- Managed by: Vercel Cron Jobs

---

## 🧪 Testing:

### Test SAM.gov Search:
```bash
curl -X POST https://your-domain.vercel.app/api/sam-gov/search \
  -H "Content-Type: application/json" \
  -d '{
    "naicsCodes": ["541512", "541519"],
    "keywords": ["disaster", "FEMA"],
    "limit": 10
  }'
```

### Test Email Send:
```bash
curl -X POST https://your-domain.vercel.app/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your@email.com",
    "subject": "Test Email",
    "opportunities": [],
    "customerName": "Test User"
  }'
```

### Test Daily Brief (Manual Trigger):
```bash
curl https://your-domain.vercel.app/api/daily-brief \
  -H "Authorization: Bearer your-cron-secret"
```

---

## 📊 Monitoring:

View logs in Vercel Dashboard:
- https://vercel.com/[your-project]/logs

Each morning at 8AM EST, you'll see:
```
[Daily Brief] Starting daily brief generation...
[Daily Brief] Found X customers
[Daily Brief] ✓ Sent brief to customer@email.com (XX opps)
```

---

## 🔄 How It Works:

1. **8:00 AM EST** - Vercel cron triggers `/api/daily-brief`
2. **Fetch Customers** - Reads from Google Sheets (onboarding data)
3. **For Each Customer:**
   - Calls `/api/sam-gov/search` with their NAICS codes + keywords
   - Fetches LIVE opportunities from SAM.gov
   - Scores opportunities by deadline urgency
   - Generates HTML email
   - Sends via Resend from `info@trapiermanagement.com`
4. **Customer Receives** - Daily brief with TOP 10 opportunities

---

## ✅ Success Indicators:

- ✅ Vercel deployment successful
- ✅ Cron job shows in Vercel dashboard
- ✅ Environment variables set
- ✅ Resend domain verified (green checkmark)
- ✅ Test emails arrive in inbox
- ✅ SAM.gov returns live 2026 data

---

## 🐛 Troubleshooting:

**Emails not sending?**
- Check Resend domain verification status
- Verify RESEND_API_KEY in Vercel env vars
- Check Vercel function logs for errors

**No SAM.gov data?**
- Verify SAM_GOV_API_KEY is correct
- Check SAM.gov API status: https://open.gsa.gov/api/opportunities-api/
- Review function logs for API errors

**Cron not running?**
- Verify vercel.json is committed
- Check cron schedule format
- View cron history in Vercel dashboard

---

🎉 **Your automation is ready to deliver LIVE government opportunities daily!**
