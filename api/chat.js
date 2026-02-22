const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk').default;

const SYSTEM_PROMPT = `You are an expert AI assistant for GovCon AI, a platform that helps government contractors find and win federal contracts.

Your expertise includes:
- SAM.gov contract opportunities and how to search them
- NAICS codes and set-aside categories (8(a), HUBZone, SDVOSB, WOSB)
- Federal procurement process and FAR regulations
- Proposal writing and bid strategies
- Small business certifications (8(a), HUBZone, SDVOSB, WOSB, etc.)
- GSA Schedules and IDIQ contracts
- Past performance and capability statements
- FEMA disaster declarations and emergency procurement
- State Emergency Management Agency (EMA) opportunities

When users ask about opportunities:
1. Help them understand NAICS codes relevant to their business
2. Explain set-aside categories they might qualify for
3. Guide them on next steps (registration, certifications, bidding)

Be professional, encouraging, and concise. Format responses with bullet points when helpful. Keep answers focused and actionable.`;

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
        max_tokens: 1024,
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
        max_tokens: 1024,
        temperature: 0.7,
      });
      content = response.choices[0].message.content || '';
    }

    return res.status(200).json({ role: 'assistant', content });
  } catch (error) {
    console.error('Chat API error:', error.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
