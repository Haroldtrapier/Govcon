const Anthropic = require('@anthropic-ai/sdk');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // System prompt for GovCon AI assistant
    const systemPrompt = `You are the GovCon AI Assistant, an expert in government contracting. You help users with:
- SAM.gov contract opportunities and how to find them
- NAICS codes and their meanings
- FEMA and State EMA contract opportunities
- Government contracting strategies and proposal writing
- Set-asides (8(a), HUBZone, SDVOSB, WOSB)
- How GovCon AI monitoring works

Be helpful, professional, and concise. If asked about pricing, mention that plans start at $49/month with a 14-day free trial.`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: message
      }]
    });

    // Extract the text response
    const assistantMessage = response.content[0].text;

    return res.status(200).json({
      content: assistantMessage,
      model: 'claude-3-5-sonnet'
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({
      error: 'Failed to get response',
      message: error.message
    });
  }
}
