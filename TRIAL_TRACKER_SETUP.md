# 🚀 Trial Conversion Tracker - Complete Setup Guide

## 🎉 What You Have Now

Your trial tracking system now includes **3 powerful features**:

1. ✅ **Slack Notifications** - Real-time alerts for trial events
2. ✅ **Conversion Dashboard** - Analytics with charts and metrics
3. ✅ **Automated Emails** - Personalized follow-ups at key moments

---

## 📋 Setup Instructions

### **Feature 1: Slack Notifications** 🔔

**What It Does:**
- Sends Slack messages when:
  - 🎯 New trial starts
  - ⚠️ Trial ending soon (3 days)
  - ❌ Trial canceled

**Setup Steps:**

1. **Create Slack Incoming Webhook:**
   - Go to: https://api.slack.com/apps
   - Click "Create New App" → "From scratch"
   - Name: "Trial Tracker"
   - Select your workspace
   - Go to "Incoming Webhooks" → Toggle ON
   - Click "Add New Webhook to Workspace"
   - Select channel (e.g., #sales)
   - Copy the Webhook URL (starts with `https://hooks.slack.com/services/...`)

2. **Add to Vercel Environment Variables:**
   ```
   Key: SLACK_WEBHOOK_URL
   Value: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

3. **Redeploy Vercel** (auto-deploys when you push to GitHub)

✅ **Done!** You'll now get Slack notifications for all trial events!

---

### **Feature 2: Conversion Dashboard** 📊

**What It Shows:**
- Total trials, active, converted, canceled
- Conversion rate & cancel rate
- Monthly Recurring Revenue (MRR)
- Average days to convert
- Breakdown by plan
- Trials ending soon

**How to Run:**

```bash
# Local testing
cd scripts
node conversion-dashboard.js
```

**Example Output:**
```json
{
  "overview": {
    "total_trials": 50,
    "active_trials": 12,
    "converted": 30,
    "canceled": 8,
    "conversion_rate": "60.0%",
    "cancel_rate": "16.0%"
  },
  "revenue": {
    "monthly_recurring_revenue": "$5,940",
    "potential_mrr": "$2,376",
    "total_potential": "$8,316"
  },
  "metrics": {
    "avg_days_to_convert": "7.3",
    "ending_soon_count": 3
  },
  "by_plan": [
    {
      "plan": "Professional ($197)",
      "total": 20,
      "converted": 15,
      "conversion_rate": "75.0%"
    }
  ],
  "trials_ending_soon": [
    {
      "email": "john@example.com",
      "name": "John Doe",
      "plan": "Starter ($97)",
      "days_remaining": 2,
      "amount": "$97"
    }
  ]
}
```

**Schedule Daily Dashboard:**

Add to Vercel Cron Jobs or use GitHub Actions:

```yaml
# .github/workflows/daily-dashboard.yml
name: Daily Dashboard
on:
  schedule:
    - cron: '0 9 * * *' # 9 AM UTC daily
jobs:
  dashboard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: node scripts/conversion-dashboard.js
```

---

### **Feature 3: Automated Email Follow-Ups** 📧

**Email Types:**

1. **Welcome Email** - Day 0 (trial starts)
   - Subject: "Welcome to GovCon AI - Your Trial Has Started! 🚀"
   - Includes: Setup steps, resources, support

2. **Mid-Trial Email** - Day 7 (halfway)
   - Subject: "Getting the Most Out of Your GovCon AI Trial"
   - Includes: Pro tips, progress check, schedule call

3. **Ending Soon Email** - Day 11 (3 days left)
   - Subject: "⏰ Your GovCon AI Trial Ends Soon - Special Offer Inside!"
   - Includes: 20% off offer, value proposition, upgrade CTA

4. **Last Day Email** - Day 13 (1 day left)
   - Subject: "🚨 Last Day of Your GovCon AI Trial!"
   - Includes: Urgent CTA, last chance offer, consequences

**Setup Options:**

**Option A: Vercel Cron (Recommended)**

Create `api/send-trial-emails.js`:
```javascript
const { sendFollowUpEmails } = require('../scripts/email-automation');
const { google } = require('googleapis');

module.exports = async (req, res) => {
  // Authenticate & send emails
  const emails = await sendFollowUpEmails();
  
  // Send via Gmail API
  for (const email of emails) {
    // Send email logic here
  }
  
  res.json({ sent: emails.length });
};
```

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/send-trial-emails",
    "schedule": "0 10 * * *"
  }]
}
```

**Option B: GitHub Actions**

```yaml
# .github/workflows/trial-emails.yml
name: Send Trial Emails
on:
  schedule:
    - cron: '0 10 * * *' # 10 AM UTC daily
jobs:
  send-emails:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          node scripts/email-automation.js | \
          # Process and send via Gmail API
```

---

## 🔐 Required Environment Variables

**Vercel Environment Variables:**

```bash
# Already configured:
NOTION_API_KEY=ntn_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_TRIAL_WEBHOOK_SECRET=whsec_xxx

# New (for Slack notifications):
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx

# Optional (for Gmail automation):
GMAIL_CLIENT_ID=xxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=xxx
GMAIL_REFRESH_TOKEN=xxx
```

---

## 📊 Usage Examples

### View Dashboard Anytime
```bash
NOTION_API_KEY=your_key node scripts/conversion-dashboard.js
```

### Test Email Templates
```bash
NOTION_API_KEY=your_key node scripts/email-automation.js
```

### Monitor Trial Health
Check Notion dashboard daily:
https://www.notion.so/Trial-Conversion-Tracker-3080492672788189be45fb7c792c063b

---

## 🎯 Next Steps

**Immediate:**
1. ✅ Set up Slack webhook
2. ✅ Test dashboard script locally
3. ✅ Review email templates

**This Week:**
1. Schedule daily dashboard reports
2. Set up automated email sending
3. Monitor first trial conversions

**This Month:**
1. Analyze conversion metrics
2. A/B test email templates
3. Optimize trial length based on data

---

## 📈 Success Metrics to Track

- **Conversion Rate:** Target 40%+
- **Days to Convert:** Target <10 days
- **Email Open Rates:** Track which emails perform best
- **MRR Growth:** Month-over-month
- **Churn Prevention:** Act on "ending soon" notifications

---

## 🆘 Troubleshooting

**Slack notifications not working?**
- Verify SLACK_WEBHOOK_URL is correct
- Check Vercel deployment logs
- Test webhook manually: `curl -X POST -H 'Content-type: application/json' --data '{"text":"Test"}' YOUR_WEBHOOK_URL`

**Dashboard showing 0 trials?**
- Verify NOTION_API_KEY has access to database
- Check DATABASE_ID is correct
- Ensure Notion integration is connected

**Emails not sending?**
- Verify Gmail API credentials
- Check daily cron is running
- Review script output for errors

---

## 🚀 Links

- **Notion Dashboard:** https://www.notion.so/Trial-Conversion-Tracker-3080492672788189be45fb7c792c063b
- **Webhook Code:** https://github.com/Haroldtrapier/Govcon/blob/main/api/stripe-webhook.js
- **Dashboard Script:** https://github.com/Haroldtrapier/Govcon/blob/main/scripts/conversion-dashboard.js
- **Email Automation:** https://github.com/Haroldtrapier/Govcon/blob/main/scripts/email-automation.js

---

**Built with ❤️ using Composio AI**
