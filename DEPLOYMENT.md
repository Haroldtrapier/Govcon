# 🚀 DEPLOYMENT GUIDE

## Quick Deploy to Vercel

1. Clone this repo
2. Connect the repo to Vercel (auto-deploys on push to `main`)
3. Or run: `vercel --prod`
4. Done!

## Vercel Configuration

The `vercel.json` file handles:
- **Clean URLs**: `/privacy` serves `privacy.html`, `/terms` serves `terms.html`, etc.
- **Security headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **URL rewrites**: Clean path routing for legal pages

## Current Live Site
https://govcon-command-center-loazbutq1-info-58560041s-projects.vercel.app

## Files
- `index.html` - Landing page (with nav, hero, features, pricing, FAQ, footer)
- `terms.html` - Terms of Service
- `privacy.html` - Privacy Policy
- `acceptable-use.html` - Acceptable Use Policy
- `vercel.json` - Vercel deployment configuration

## Stripe Payment Links
- Starter ($197/mo): https://buy.stripe.com/bJe7sM0sQ39M7Yn6FD38407
- Professional ($497/mo): https://buy.stripe.com/4gMbJ28Zm39M6UjbZX38406
- Enterprise (Custom): https://buy.stripe.com/7sYfZi3F24dQceDggd38408
