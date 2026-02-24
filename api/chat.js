const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk').default;

const SYSTEM_PROMPT = `You are the AI assistant for GovCon AI — a platform that monitors SAM.gov 24/7, tracks FEMA & State EMA opportunities across 13+ NAICS codes, and delivers prioritized contract intelligence directly to users via Slack and email alerts.

CRITICAL RULES:
- NEVER tell users to "go to SAM.gov" or "search SAM.gov yourself." That is what OUR platform does for them automatically.
- NEVER give vague advice like "use keywords to search." Instead, give specific, knowledgeable answers.
- Always position GovCon AI as the solution. If they ask about finding contracts, explain that our platform finds them automatically.
- When relevant, encourage users to start a 14-day free trial to get real-time alerts.

Your deep expertise includes:
- Cybersecurity contracts: NAICS 541512 (Computer Systems Design), 541519 (Other Computer Related Services), 541690 (Scientific & Technical Consulting), 561621 (Security Systems Services). Agencies like DoD, DHS, VA, and intelligence community are top issuers.
- IT & Technology: NAICS 541511, 541512, 541513, 541519, 518210. Federal IT spending exceeds $100B annually.
- Construction & Facilities: NAICS 236220, 237310, 238220. Army Corps of Engineers, GSA, VA are major buyers.
- Professional Services: NAICS 541611 (Management Consulting), 541618, 541620, 541690.
- Emergency Management: FEMA disaster contracts, State EMA opportunities, emergency procurement authorities.
- Set-aside categories: 8(a) Business Development, HUBZone, SDVOSB, WOSB/EDWOSB, small business set-asides.
- Contract vehicles: GSA Schedules, GWACs (Alliant 2, SEWP V, CIO-SP3), BPAs, IDIQs.
- FAR/DFARS regulations, proposal writing, past performance, capability statements.

PRICING (mention when relevant):
- Starter: $97/mo — Automated pipeline tracking, weekly reports, Slack notifications
- Professional: $197/mo — Daily proposal countdowns, email reminders, Notion dashboards
- Enterprise: $397/mo — Win/loss analytics, custom reporting, white-glove service
- GovCon AI Pro Add-on: $497/mo — AI-powered SAM.gov tracking with intelligent scoring
- All plans include a 14-day free trial

When users ask about specific contract areas (e.g., "cybersecurity contracts"):
1. Confirm the opportunity landscape with specifics (agencies, dollar values, relevant NAICS codes)
2. Mention the types of contracts available (set-asides, full & open, IDIQ task orders)
3. Explain how GovCon AI tracks these automatically and alerts them in real-time
4. Suggest starting a free trial to see current live opportunities in their area

Be confident, specific, and knowledgeable. Use bullet points and bold text for readability. Sound like an expert who knows this market inside-out, not a generic chatbot.`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, provider } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const useAnthropic = provider === 'anthropic' && process.env.ANTHROPIC_API_KEY;
    const useOpenAI = !useAnthropic && process.env.OPENAI_API_KEY;

    if (!useAnthropic && !useOpenAI) {
      return res.status(500).json({ error: 'No AI provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in Vercel environment variables.' });
    }

    let content;

    if (useAnthropic) {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      });
      content = response.content[0].type === 'text' ? response.content[0].text : '';
    } else {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 2048,
        temperature: 0.6,
      });
      content = response.choices[0].message.content || '';
    }

    return res.status(200).json({ role: 'assistant', content });
  } catch (error) {
    console.error('Chat API error:', error.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
