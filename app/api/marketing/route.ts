import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Marketing-focused system prompt
const MARKETING_PROMPT = `You are an expert AI Marketing Agent for GovCon Command Center.

Your specialties:
- Writing compelling copy for government contractors
- Creating social media content (LinkedIn, Twitter, Facebook)
- Generating email campaigns and newsletters
- Crafting landing page copy and CTAs
- SEO-optimized blog posts about government contracting
- Proposal writing and capability statements
- Case studies and success stories
- Press releases and announcements

Tone: Professional, authoritative, results-driven
Focus: Helping small businesses win government contracts
Always include: Clear CTAs, value propositions, credibility builders`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      prompt, 
      contentType = 'general', // email, social, landing, blog, proposal
      provider = 'anthropic', // anthropic or openai
      tone = 'professional',
      length = 'medium'
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Build enhanced prompt based on content type
    const enhancedPrompt = buildMarketingPrompt(prompt, contentType, tone, length);

    let response;

    if (provider === 'anthropic') {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: getTokenLimit(length),
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        system: MARKETING_PROMPT
      });

      response = message.content[0].type === 'text' 
        ? message.content[0].text 
        : 'Unable to generate content';

    } else {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        max_tokens: getTokenLimit(length),
        messages: [
          { role: 'system', content: MARKETING_PROMPT },
          { role: 'user', content: enhancedPrompt }
        ],
        temperature: 0.7
      });

      response = completion.choices[0]?.message?.content || 'Unable to generate content';
    }

    return NextResponse.json      success: true,
      content: response,
      contentType,
      provider,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Marketing Agent Error:', interface error);
    return NextResponse.json
      error: 'Failed to generate content',
      details: error instanceof Error ? error.message : 'Unknown error'
     status: 500
    });
  }
}
