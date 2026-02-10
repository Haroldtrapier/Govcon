import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt with GovCon expertise
const SYSTEM_PROMPT = `You are an expert AI assistant for GovCon Command Center, a platform that helps government contractors find and win federal contracts.

Your expertise includes:
- SAM.gov contract opportunities and how to search them
- NAICS codes and set-aside categories (8(a), HUBZone, SDVOSB, WOSB)
- Federal procurement process and FAR regulations
- Proposal writing and bid strategies
- Small business certifications (8(a), HUBZone, SDVOSB, WOSB, etc.)
- GSA Schedules and IDIQ contracts
- Past performance and capability statements
- FEMA disaster declarations and emergency procurement

Always provide actionable, specific advice. When users ask about opportunities:
1. Help them understand NAICS codes relevant to their business
2. Explain set-aside categories they might qualify for
3. Guide them on next steps (registration, certifications, bidding)

Be professional, encouraging, and data-driven. Format responses clearly with bullet points when helpful.`;

export async function POST(req: Request) {
  try {
    const { messages, provider = 'openai' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    let response;

    if (provider === 'anthropic') {
      // Use Claude (Anthropic)
      const claudeResponse = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: messages.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
      });

      response = {
        role: 'assistant',
        content: claudeResponse.content[0].type === 'text' 
          ? claudeResponse.content[0].text 
          : '',
      };
    } else {
      // Use OpenAI (GPT-4)
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 2048,
        temperature: 0.7,
      });

      response = {
        role: 'assistant',
        content: completion.choices[0].message.content || '',
      };
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
