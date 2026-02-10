# GovCon AI Chatbot

## 🤖 Features

✅ **AI-Powered** - Uses GPT-4 (OpenAI) or Claude (Anthropic)
✅ **GovCon Expert** - Trained on government contracting knowledge
✅ **Context-Aware** - SAM.gov, NAICS, set-asides, FAR
✅ **Beautiful UI** - Modern floating chat interface
✅ **Free** - Uses your existing API keys (no subscription)

## 📦 Installation

```bash
npm install openai @anthropic-ai/sdk lucide-react
```

## 🚀 Quick Start

1. Install dependencies (command above)
2. Environment variables already configured in Vercel:
   - ✅ `OPENAI_API_KEY`
   - ✅ `ANTHROPIC_API_KEY`
3. Files already added to your repo
4. Deploy to Vercel and test!

## 💬 What the AI Can Help With

- SAM.gov opportunity searches
- NAICS code selection
- Set-aside categories (8(a), HUBZone, SDVOSB, WOSB)
- Proposal writing strategies
- Small business certifications
- GSA Schedules and IDIQ contracts
- Past performance requirements
- FEMA disaster declarations

## 🎨 Customization

### Switch to Claude (10x cheaper)

In `components/AIChat.tsx`, change:
```typescript
provider: 'anthropic' // instead of 'openai'
```

### Change Colors

Edit `components/AIChat.tsx`:
- `bg-blue-600` → your brand color
- `from-blue-600 to-blue-700` → your gradient

## 💰 Cost Estimates

- **GPT-4**: ~$0.05 per conversation
- **Claude 3.5**: ~$0.005 per conversation (recommended)

## 🧪 Test Questions

1. "What NAICS codes for IT services?"
2. "How to qualify for 8(a) set-aside?"
3. "Difference between IDIQ and GSA Schedule?"
4. "How to write capability statement?"
5. "Past performance requirements?"

## 📚 Documentation

For advanced features (database integration, user context, function calling), see the full README in the PR description.
