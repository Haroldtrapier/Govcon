import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not found');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: `You are GovCon AI Assistant. Help with government contracting questions. Be concise.

About GovCon AI:
- Monitors SAM.gov 24/7 for contracts
- Tracks FEMA & State EMA opportunities  
- Delivers alerts to Slack/email
- Pricing: $49/month, 14-day free trial`,
      messages: [{
        role: 'user',
        content: message
      }]
    });

    return res.status(200).json({
      content: response.content[0].text,
      model: 'claude-3-5-sonnet'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'AI error',
      details: error.message
    });
  }
}
