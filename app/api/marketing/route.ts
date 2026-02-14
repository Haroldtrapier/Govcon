import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'generate_post':
        return await generateLinkedInPost(data);

      case 'schedule_post':
        return await schedulePost(data);

      case 'analyze_performance':
        return await analyzePerformance(data);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Marketing Agent Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function generateLinkedInPost(data: { topic?: string; tone?: string }) {
  const { topic = 'government contracting', tone = 'professional' } = data;

  // Call OpenAI/Anthropic to generate LinkedIn post
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('AI API key not configured');
  }

  // Use OpenAI if available
  if (process.env.OPENAI_API_KEY) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a LinkedIn marketing expert for government contracting. Generate engaging, professional posts that drive engagement. Tone: ${tone}`,
          },
          {
            role: 'user',
            content: `Create a LinkedIn post about ${topic} for a government contracting audience. Include relevant hashtags and ALWAYS end with a call-to-action and this link: https://www.govconcommandcenter.com/ Max 1300 characters.`,
          },
        ],
        temperature: 0.8,
      }),
    });

    const result = await response.json();
    const postText = result.choices[0].message.content;

    return NextResponse.json({ 
      success: true, 
      post: postText,
      characterCount: postText.length,
      hashtags: extractHashtags(postText)
    });
  }

  // Fallback to Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are a LinkedIn marketing expert for government contracting. Generate an engaging, ${tone} post about ${topic}. Include relevant hashtags and ALWAYS end with a call-to-action and this link: https://www.govconcommandcenter.com/ Max 1300 characters.`,
          },
        ],
      }),
    });

    const result = await response.json();
    const postText = result.content[0].text;

    return NextResponse.json({ 
      success: true, 
      post: postText,
      characterCount: postText.length,
      hashtags: extractHashtags(postText)
    });
  }

  throw new Error('No AI API configured');
}

async function schedulePost(data: { post: string; scheduleTime?: string }) {
  const { post, scheduleTime } = data;

  // TODO: Integrate with a scheduling service (e.g., Buffer, Hootsuite)
  // For now, return success with mock data

  return NextResponse.json({
    success: true,
    message: 'Post scheduled successfully',
    scheduledFor: scheduleTime || new Date(Date.now() + 3600000).toISOString(),
    postPreview: post.slice(0, 100) + '...',
  });
}

async function analyzePerformance(data: { period?: string }) {
  const { period = '7d' } = data;

  // Mock performance data
  // TODO: Integrate with LinkedIn Analytics API

  return NextResponse.json({
    success: true,
    period,
    metrics: {
      posts: 12,
      impressions: 8450,
      engagements: 342,
      clickThroughRate: 4.05,
      topPerformingPost: {
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        impressions: 1250,
        engagements: 89,
      },
    },
  });
}

function extractHashtags(text: string): string[] {
  const regex = /#[a-zA-Z0-9_]+/g;
  return text.match(regex) || [];
}
