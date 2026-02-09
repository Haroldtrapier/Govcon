# n8n Integration Guide for GovCon Command Center

This guide helps you connect n8n to automate your GovCon Command Center workflows.

## 🔗 Quick Setup

### Prerequisites
- n8n instance (self-hosted or n8n.cloud)
- Stripe account with API keys
- Gmail/SMTP credentials for email
- SAM.gov API key (free at sam.gov)

## 🔧 Required n8n Credentials

Set up these credentials in your n8n instance:

### 1. Stripe
- **Type:** Stripe API
- **API Key:** Your Stripe Secret Key (`sk_live_...` or `sk_test_...`)
- **Where to find:** Stripe Dashboard → Developers → API Keys

### 2. Gmail
- **Type:** Gmail OAuth2
- **Setup:** n8n Settings → Credentials → Gmail OAuth2
- **Requires:** Google Cloud Console OAuth credentials
- **Scopes needed:** `gmail.send`

### 3. Notion
- **Type:** Notion API (Internal Integration)
- **Setup Steps:**
  1. Go to https://www.notion.so/my-integrations
  2. Create new integration for your workspace
  3. Copy the "Internal Integration Token"
  4. In Notion, share your CRM database with the integration
- **Database Fields Needed:** Name, Email, Plan, Status, Stripe Customer ID, Signup Date

### 4. SAM.gov API
- **Type:** HTTP Header Auth
- **Header Name:** `X-Api-Key`
- **Header Value:** Your SAM.gov API key
- **Get API Key:** https://sam.gov/data-services

### 5. HubSpot (Optional)
- **Type:** HubSpot OAuth2 or API Key
- **Where to find:** HubSpot → Settings → Integrations → API Key

## 📋 Webhook URLs

Add these webhook URLs to your services:

### Stripe Webhook
```
https://your-n8n-instance.com/webhook/govcon-stripe
```

Events to subscribe:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

### Setup in Stripe:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your n8n webhook URL
4. Select the events above
5. Copy the webhook signing secret for verification

## 🔄 Core Workflows

### 1. Customer Onboarding (Stripe → Email → HubSpot)
**Trigger:** Stripe `checkout.session.completed`
**Actions:**
1. Extract customer email and plan
2. Send welcome email with Notion template link
3. Create/update HubSpot contact
4. Add to email sequence

### 2. Daily SAM.gov Monitoring
**Trigger:** Cron schedule (daily at 6 AM)
**Actions:**
1. Query SAM.gov API for new opportunities
2. Filter by NAICS codes and keywords
3. Format opportunity digest
4. Send email briefing to subscribers

### 3. Subscription Management
**Trigger:** Stripe subscription events
**Actions:**
1. Handle upgrades/downgrades
2. Process cancellations
3. Update HubSpot deal stage
4. Send appropriate emails

### 4. Payment Failed Recovery
**Trigger:** Stripe `invoice.payment_failed`
**Actions:**
1. Send payment failure notification
2. Create HubSpot task for follow-up
3. Trigger dunning email sequence

## 🌐 SAM.gov API Integration

### Base URL
```
https://api.sam.gov/opportunities/v2/search
```

### Example Query Parameters
```json
{
  "postedFrom": "{{$today.minus(1, 'day').format('MM/dd/yyyy')}}",
  "postedTo": "{{$today.format('MM/dd/yyyy')}}",
  "limit": 100,
  "naicsCodes": "541512,541519,518210",
  "keywords": "software,cloud,IT services"
}
```

### Response Fields to Extract
- `title` - Opportunity title
- `solicitationNumber` - Solicitation ID
- `postedDate` - When posted
- `responseDeadLine` - Submission deadline
- `type` - Contract type
- `setAside` - Set-aside category (8a, WOSB, etc.)
- `pointOfContact` - Contact information

## 📧 Email Templates

### Welcome Email Variables
```
{{customer_name}} - Customer's name
{{plan_name}} - Starter/Professional/Enterprise
{{template_url}} - Notion template URL
{{portal_url}} - Stripe customer portal
```

### Daily Digest Variables
```
{{opportunity_count}} - Number of new opportunities
{{opportunities}} - Array of opportunity objects
{{date}} - Today's date
```

## 🔐 Environment Variables

Set these in your n8n instance:

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SAM_GOV_API_KEY=your_api_key
HUBSPOT_API_KEY=your_api_key
NOTION_TEMPLATE_URL=https://trapiermanagement.notion.site/GovCon-Command-Center-Template
VERCEL_SITE_URL=https://govcon-command-center.vercel.app
```

## 📁 Workflow Import Files

Import these workflow JSON files into your n8n instance:

1. `n8n-workflows/customer-onboarding.json`
2. `n8n-workflows/sam-gov-monitor.json`
3. `n8n-workflows/subscription-management.json`
4. `n8n-workflows/payment-recovery.json`

## 🚀 Deployment Checklist

- [ ] n8n instance running and accessible
- [ ] Stripe credentials configured
- [ ] Stripe webhook created and verified
- [ ] SAM.gov API key obtained and tested
- [ ] Email credentials configured
- [ ] HubSpot integration set up (optional)
- [ ] All workflows imported and activated
- [ ] Test each workflow with sample data
- [ ] Monitor logs for first week

## 🔍 Troubleshooting

### Stripe Trigger not working
1. **Check webhook URL:** In n8n, click Stripe Trigger → Copy the Webhook URL
2. **Add to Stripe:** Dashboard → Developers → Webhooks → Add endpoint
3. **Select events:** `checkout.session.completed`
4. **Test:** Use Stripe CLI or test mode to send a test event

### "If Purchase Completed" node configuration
The condition should check:
```
Value 1: {{ $json.type }}
Operation: equals
Value 2: checkout.session.completed
```

### Gmail not sending
1. **OAuth2 Setup:** Ensure Gmail OAuth2 credentials are connected
2. **Expression for To field:** `{{ $json.data.object.customer_details.email }}`
3. **Check Logs:** Click "Executions" tab to see error details
4. **Google permissions:** Make sure the Gmail API is enabled in Google Cloud Console

### Notion CRM not creating pages
1. **Share database:** Your Notion database must be shared with the integration
2. **Database ID:** Right-click database → Copy link → Extract ID from URL
3. **Field mapping:** Ensure property names match exactly (case-sensitive)
4. **Check expressions:**
   - Name: `{{ $json.data.object.customer_details.name }}`
   - Email: `{{ $json.data.object.customer_details.email }}`

### Webhook not receiving events
1. Check n8n is publicly accessible (n8n.cloud handles this automatically)
2. Verify webhook URL is correct in Stripe
3. Check Stripe webhook logs for delivery attempts
4. Ensure workflow is **Published/Active** (not just saved)

### SAM.gov API errors
1. Verify API key is valid
2. Check rate limits (1000 requests/day)
3. Validate date format (MM/dd/yyyy)

### Email not sending
1. Verify Gmail OAuth2 credentials are authorized
2. Check spam folders
3. Review n8n execution logs
4. Ensure "To" field has valid email expression

## 📞 Support

For issues with this integration:
- Email: info@trapiermanagement.com
- n8n Documentation: https://docs.n8n.io
