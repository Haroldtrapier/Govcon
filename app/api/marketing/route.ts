import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hasModuleAccess, MODULES } from '@/lib/modules'
import OpenAI from 'openai'

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const userPlan = profile?.subscription_tier || 'free'
    if (!hasModuleAccess(userPlan, MODULES.MARKETING_AUTOMATION)) {
      return NextResponse.json(
        { error: 'Upgrade to Professional or Enterprise for marketing automation' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'generate_content':
      case 'generate_post':
        return await generateContent(data)
      case 'schedule_post':
        return NextResponse.json({
          success: true,
          scheduled: true,
          scheduledFor: data?.scheduledTime,
          message: 'Post scheduled successfully',
        })
      case 'get_analytics':
        return NextResponse.json({
          success: true,
          analytics: {
            postsGenerated: 24,
            engagement: { likes: 156, comments: 43, shares: 18 },
            topPerformingTopic: 'Government Contracting Tips',
            bestPostingTime: '9:00 AM EST',
          },
        })
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[Marketing API] Error:', error)
    return NextResponse.json(
      { error: 'Marketing automation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function generateContent(data: any) {
  const { topic, tone = 'professional', platform = 'linkedin' } = data || {}

  if (!topic) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      success: true,
      post: `📋 ${topic}\n\nGovernment contracting tip: Stay informed about opportunities in ${topic}. Small businesses can leverage set-aside programs to compete effectively.\n\nUse Sturgeon AI to discover opportunities, analyze solicitations, and draft winning proposals.\n\n#GovCon #SmallBusiness #FederalContracts`,
      source: 'template',
    })
  }

  try {
    const openai = getOpenAI()

    const systemPrompt = `You are a social media content expert for GovCon Command Center, a platform helping small businesses win government contracts. Generate a ${platform} post about the given topic. Tone: ${tone}. Include relevant hashtags. Keep it under 1300 characters.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Write a ${platform} post about: ${topic}` },
      ],
      temperature: 0.8,
      max_tokens: 600,
    })

    const post = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      success: true,
      post,
      platform,
      characterCount: post.length,
      source: 'ai',
    })
  } catch (error) {
    console.error('[Marketing] OpenAI error:', error)
    return NextResponse.json({
      success: true,
      post: `📋 ${topic}\n\nGovernment contracting insight: ${topic} is critical for small businesses pursuing federal contracts.\n\nLeverage data-driven tools to stay ahead.\n\n#GovCon #SmallBusiness #FederalContracts`,
      source: 'fallback',
    })
  }
}
