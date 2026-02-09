# DEPLOYMENT GUIDE

## GovCon AI - Landing Page

This repository contains the **GovCon AI** landing page - the AI-powered government contracting intelligence product.

### Pricing Tiers
- **Starter**: $97/month
- **Professional**: $197/month (Most Popular)
- **Enterprise**: $397/month

### Deploy to Vercel

1. Connect the GitHub repo (`Haroldtrapier/Govcon`) to Vercel
2. Auto-deploys on push to `main`
3. Or manually: `vercel --prod`

### Vercel Configuration

The `vercel.json` handles:
- **Clean URLs**: `/privacy` serves `privacy.html`, `/terms` serves `terms.html`, etc.
- **Security headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy
- **URL rewrites**: Clean path routing for legal pages

### Files
- `index.html` - AI Landing page (navbar, hero, features, pricing $97/$197/$397, FAQ, footer)
- `terms.html` - Terms of Service
- `privacy.html` - Privacy Policy
- `acceptable-use.html` - Acceptable Use Policy
- `vercel.json` - Vercel deployment configuration

### Stripe Payment Links
- Starter ($97/mo): https://buy.stripe.com/bJe7sM0sQ39M7Yn6FD38407
- Professional ($197/mo): https://buy.stripe.com/4gMbJ28Zm39M6UjbZX38406
- Enterprise ($397/mo): https://buy.stripe.com/7sYfZi3F24dQceDggd38408

---

## Command Center (Separate Deployment)

Command Center is a **separate product** with its own deployment and pricing.
It will be deployed to a different Vercel project/domain.

- GovCon AI = Contract intelligence & monitoring (this repo)
- Command Center = Operations dashboard (separate repo/deployment)
