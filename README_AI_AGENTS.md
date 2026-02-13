# 🤖 GovCon AI Agents

## 🎯 Overview

Two powerful AI agents to help government contractors succeed:

1. **AI Chatbot** - GovCon expert assistant
2. **Marketing Agent** - Content generation powerhouse

---

## 💬 AI Chatbot

**Route:** `/chat`  
**API:** `/api/chat`

### Features
- ✅ GovCon expertise (SAM.gov, NAICS, set-asides, FAR)
- ✅ Real-time SAM.gov opportunity search
- ✅ NAICS code recommendations  
- ✅ Proposal writing guidance
- ✅ Beautiful floating chat UI

### Usage
```typescript
// Access at https://your-domain.com/chat
// Or embed component:
import AIChat from '@/components/AIChat';
<AIChat />
```

---

## ✨ Marketing Agent

**Route:** `/marketing`  
**API:** `/api/marketing`

### Features
- ✅ Email campaigns with subject lines & CTAs
- ✅ Social media content (LinkedIn, Twitter, Facebook)
- ✅ Landing page copy with conversion focus
- ✅ SEO-optimized blog posts
- ✅ Proposal & capability statements
- ✅ Multiple tone options
- ✅ Copy/download generated content

### Content Types
1. **Email Campaign** - Full email with subject, body, CTA
2. **Social Media** - Multi-platform posts with hashtags
3. **Landing Page** - High-converting page copy
4. **Blog Post** - 1500-2000 word SEO articles
5. **Proposal** - Capability statements & bids
6. **General** - Any marketing copy

### API Usage
```typescript
const response = await fetch('/api/marketing', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Write an email about our SAM.gov search tool',
    contentType: 'email',
    tone: 'professional',
    length: 'medium',
    provider: 'anthropic' // or 'openai'
  })
});

const { content } = await response.json();
```

---

## 🔑 Environment Variables

Required in Vercel:

```bash
OPENAI_API_KEY=sk-...           # For GPT-4
ANTHROPIC_API_KEY=sk-ant-...    # For Claude (recommended)
```

---

## 💰 Cost Comparison

| Provider | Model | Cost per conversation |
|----------|-------|----------------------|
| Claude | 3.5 Sonnet | ~$0.005 |
| OpenAI | GPT-4 | ~$0.05 |

**Recommendation:** Use Claude (10x cheaper, same quality)

---

## 🚀 Quick Start

### 1. Set Environment Variables
Add API keys to Vercel

### 2. Deploy
Push to GitHub - Vercel auto-deploys

### 3. Access
- **Chatbot:** https://your-domain.com/chat
- **Marketing:** https://your-domain.com/marketing

---

## 🎨 Customization

### Change AI Provider
In components, update:
```typescript
provider: 'anthropic' // or 'openai'
```

### Customize Prompts
Edit system prompts in API routes:
- `/app/api/chat/route.ts` - Chatbot prompts
- `/app/api/marketing/route.ts` - Marketing prompts

---

## 📊 Features Comparison

| Feature | Chatbot | Marketing |
|---------|---------|-----------|
| Real-time conversation | ✅ | ❌ |
| SAM.gov search | ✅ | ❌ |
| Content generation | ❌ | ✅ |
| Multi-format output | ❌ | ✅ |
| Copy/download | ❌ | ✅ |
| Streaming responses | ✅ | ❌ |

---

## 🧪 Test Examples

### Chatbot
- "What NAICS codes for IT services?"
- "How to qualify for 8(a) set-aside?"
- "Search SAM.gov for cybersecurity contracts"

### Marketing Agent
- Email: "Announce our new SAM.gov dashboard"
- Social: "Celebrate a contract win for small business"
- Blog: "How to write a winning government proposal"

---

## 🔒 Security

- ✅ API keys stored in Vercel (encrypted)
- ✅ HTTPS only
- ✅ Rate limiting (via Vercel)
- ✅ No PII logged

---

## 📚 Documentation

- [AI Chatbot Details](./README_AI_CHATBOT.md)
- [API Reference](./DEPLOYMENT.md)

---

**Need help?** Check Vercel logs for errors.
