# GovCon AI

AI-powered government contracting intelligence platform.

## Live Site

Deployed on Vercel via GitHub integration. Auto-deploys on push to `main`.

## Product

GovCon AI monitors SAM.gov 24/7, tracks FEMA & State EMA opportunities across 13 NAICS codes, and delivers prioritized intelligence to Slack and email.

## Pricing

| Plan | Price | Stripe Link |
|------|-------|-------------|
| Starter | $97/month | [Payment](https://buy.stripe.com/bJe7sM0sQ39M7Yn6FD38407) |
| Professional | $197/month | [Payment](https://buy.stripe.com/4gMbJ28Zm39M6UjbZX38406) |
| Enterprise | $397/month | [Payment](https://buy.stripe.com/7sYfZi3F24dQceDggd38408) |

## Tech Stack

- **Frontend:** HTML/CSS/JS (static site)
- **Hosting:** Vercel
- **Payments:** Stripe
- **CRM:** HubSpot
- **Email:** Gmail API

## Files

| File | Description |
|------|-------------|
| `index.html` | AI landing page (hero, features, pricing, FAQ, footer) |
| `privacy.html` | Privacy Policy |
| `terms.html` | Terms of Service |
| `acceptable-use.html` | Acceptable Use Policy |
| `vercel.json` | Vercel config (rewrites, security headers) |

## Deployment

1. Connect `Haroldtrapier/Govcon` repo to Vercel
2. Framework: Other (static HTML)
3. Root directory: `/`
4. Auto-deploys on push to `main`

## Note: Command Center

Command Center is a **separate product** with its own repo and deployment.
- **GovCon AI** = Contract intelligence & monitoring (this repo)
- **Command Center** = Operations dashboard (separate)

## Company

Trapier Management LLC  
Contact: info@trapiermanagement.com
