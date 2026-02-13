import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Prospect targeting criteria for GovCon Command Center
const PROSPECT_CRITERIA = {
  keywords: [
    'government contracting',
    'small business',
    'federal contracts',
    '8(a) certified',
    'SDVOSB',
    'HUBZone',
    'WOSB',
    'GSA Schedule',
    'SAM.gov',
    'government procurement'
  ],
  titles: [
    'CEO',
    'Founder',
    'Owner',
    'President',
    'Business Development',
    'Contracts Manager',
    'Proposal Manager'
  ],
  industries: [
    'Government Contracting',
    'Defense',
    'IT Services',
    'Professional Services',
    'Construction',
    'Consulting'
  ]
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'generate_prospect_post':
        return await generateProspectPost(data);

      case 'generate_daily_posts':
        return await generateDailyPosts(data);

      case 'analyze_prospects':
        return await analyzeProspects(data);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[LinkedIn Automation] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generateProspectPost(data: { contentType?: string; hook?: string }) {
  const { contentType = 'value_post', hook } = data;

  const postTypes = {
    value_post: `Create a LinkedIn post that provides VALUE to small business owners interested in government contracting:
- Lead with a compelling statistic or insight about federal contracts
- Share 3-5 actionable tips
- End with a soft CTA mentioning GovCon Command Center (without being salesy)
- Include 5-7 relevant hashtags
- Max 1300 characters
- Tone: Helpful, authoritative, approachable

Hook: ${hook || 'Did you know 23% of federal contracts are set aside for small businesses?'}`,

    problem_agitation: `Create a LinkedIn post using Problem-Agitation-Solution for government contractors:
- Start with a common pain point (missing opportunities, complex SAM.gov searches)
- Agitate by showing the cost of this problem
- Introduce GovCon Command Center as the solution
- Include social proof if possible
- 5-7 hashtags
- Max 1300 characters

Hook: ${hook || 'Are you missing out on government contracts because SAM.gov is overwhelming?'}`,

    success_story: `Create a LinkedIn post sharing a success story:
- Brief customer story (anonymized if needed)
- The challenge they faced
- How they solved it (hint at GovCon Command Center)
- Impressive results/metrics
- CTA: "Want similar results?"
- 5-7 hashtags
- Max 1300 characters

Hook: ${hook || 'A small IT firm just won their first $500K federal contract...'}`,

    educational: `Create an educational LinkedIn post about government contracting:
- Explain a complex topic simply (8(a), HUBZone, GSA Schedules, etc.)
- Break it into easy steps
- Add "Pro tip" section
- Mention GovCon Command Center for more resources
- 5-7 hashtags
- Max 1300 characters

Topic: ${hook || 'Understanding 8(a) Set-Aside Contracts'}`,

    engagement: `Create an engagement-driving LinkedIn post:
- Ask a thought-provoking question about government contracting
- Share your perspective
- Encourage comments
- Mention GovCon Command Center casually
- 5-7 hashtags
- Max 1000 characters

Question: ${hook || 'What's the biggest challenge you face with government contracting?'}`
  };

  const systemPrompt = `You are a LinkedIn marketing expert for GovCon Command Center - a SaaS platform that helps small businesses win government contracts.

Target audience: Small business owners, CEOs, founders interested in federal contracts
Goal: Generate leads and signups through valuable, non-salesy content
Style: Professional but approachable, data-driven, helpful
Always include: Clear value, credibility, subtle CTA`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: postTypes[contentType as keyof typeof postTypes] || postTypes.value_post }
    ],
    temperature: 0.8,
    max_tokens: 800
  });

  const post = completion.choices[0]?.message?.content || '';

  return NextResponse.json({
    success: true,
    post,
    contentType,
    characterCount: post.length,
    hashtags: extractHashtags(post),
    readyToPost: post.length <= 3000
  });
}

async function generateDailyPosts(data: { count?: number }) {
  const { count = 7 } = data;

  const systemPrompt = `Generate ${count} LinkedIn posts for GovCon Command Center - a SaaS platform helping small businesses win government contracts.

Create a variety:
- 2 value posts (tips/insights)
- 2 educational posts (explain complex topics)
- 1 engagement post (ask questions)
- 1 success story
- 1 news/trend post

Each post should:
- Be 800-1300 characters
- Include 5-7 hashtags
- Provide clear value
- Have subtle CTA
- Target small business owners

Return as JSON array of objects with: { day, contentType, post, hashtags }`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate the weekly content calendar' }
    ],
    temperature: 0.8,
    max_tokens: 4000,
    response_format: { type: 'json_object' }
  });

  const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

  return NextResponse.json({
    success: true,
    posts: result.posts || [],
    weeklyPlan: true
  });
}

async function analyzeProspects(data: any) {
  // Return ideal customer profile for targeting
  return NextResponse.json({
    success: true,
    targetAudience: {
      keywords: PROSPECT_CRITERIA.keywords,
      titles: PROSPECT_CRITERIA.titles,
      industries: PROSPECT_CRITERIA.industries,
      description: 'Small business owners and decision-makers interested in government contracting'
    },
    contentStrategy: {
      postFrequency: 'Daily at 9AM EST',
      contentMix: {
        value: '30%',
        educational: '30%',
        engagement: '20%',
        success: '10%',
        news: '10%'
      }
    }
  });
}

function extractHashtags(text: string): string[] {
  const regex = /#[a-zA-Z0-9_]+/g;
  return text.match(regex) || [];
}
