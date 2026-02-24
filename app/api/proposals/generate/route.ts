import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, opportunityId, sectionName, requirements, opportunity, companyProfile, winThemes } = body;

    const authHeader = request.headers.get('authorization');

    if (authHeader) {
      try {
        const backendRes = await fetch(`${BACKEND_URL}/api/proposals/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(30000),
        });

        if (backendRes.ok) {
          const data = await backendRes.json();
          return NextResponse.json(data);
        }
      } catch {
        // Backend unavailable, fall through to local generation
      }
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI generation requires OPENAI_API_KEY to be configured' },
        { status: 500 }
      );
    }

    const openai = getOpenAI();

    switch (action) {
      case 'generate_section':
        return await generateSection(openai, sectionName, requirements, opportunity, companyProfile);
      case 'generate_full':
        return await generateFullProposal(openai, opportunity, requirements, companyProfile, winThemes);
      case 'generate_win_themes':
        return await generateWinThemes(openai, opportunity, companyProfile);
      case 'generate_compliance_matrix':
        return await generateComplianceMatrix(openai, requirements, opportunity);
      default:
        return NextResponse.json({ error: 'Invalid action. Use: generate_section, generate_full, generate_win_themes, generate_compliance_matrix' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Proposals Generate] Error:', error);
    return NextResponse.json(
      { error: 'Proposal generation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generateSection(
  openai: OpenAI,
  sectionName: string,
  requirements: any[],
  opportunity: any,
  companyProfile: any
) {
  const reqText = requirements?.length
    ? requirements.map((r: any) => `- [${r.section_ref || 'N/A'}] ${r.requirement || ''}`).join('\n')
    : '(No specific requirements)';

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert government proposal writer with 15+ years winning federal contracts. Write compliant, professional proposal sections using markdown formatting.',
      },
      {
        role: 'user',
        content: `Write the "${sectionName}" section for a government proposal.

OPPORTUNITY: ${opportunity?.title || 'Federal Opportunity'} (${opportunity?.agency || 'Federal Agency'})
NAICS: ${opportunity?.naics || 'N/A'}

REQUIREMENTS:
${reqText}

COMPANY: ${companyProfile?.name || 'Our Company'}

Write 400-600 words. Address every requirement. Use professional tone, active voice, and specific metrics.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  return NextResponse.json({
    success: true,
    section: sectionName,
    content: completion.choices[0]?.message?.content || '',
  });
}

async function generateFullProposal(
  openai: OpenAI,
  opportunity: any,
  requirements: any[],
  companyProfile: any,
  winThemes: string[]
) {
  const sections = [
    'Executive Summary',
    'Technical Approach',
    'Management Plan',
    'Past Performance',
    'Staffing Plan',
    'Quality Assurance',
  ];

  const results: { name: string; content: string; status: string }[] = [];

  for (const section of sections) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert government proposal writer. Write the "${section}" section. Be compliant, professional, specific. Use markdown. 300-500 words.`,
          },
          {
            role: 'user',
            content: `Opportunity: ${opportunity?.title || 'Federal Opportunity'} | Agency: ${opportunity?.agency || 'Federal Agency'}
Company: ${companyProfile?.name || 'Our Company'}
${winThemes?.length ? 'Win Themes: ' + winThemes.join(', ') : ''}
Requirements: ${requirements?.slice(0, 5).map((r: any) => r.requirement || '').join('; ') || 'See solicitation'}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      });

      results.push({
        name: section,
        content: completion.choices[0]?.message?.content || '',
        status: 'generated',
      });
    } catch (error) {
      results.push({
        name: section,
        content: `## ${section}\n\n*Generation failed. Please write manually.*`,
        status: 'error',
      });
    }
  }

  return NextResponse.json({
    success: true,
    sections: results,
    metadata: {
      opportunity_title: opportunity?.title,
      total_sections: results.length,
      successful: results.filter((s) => s.status === 'generated').length,
    },
  });
}

async function generateWinThemes(openai: OpenAI, opportunity: any, companyProfile: any) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a capture management expert. Generate 4-6 win themes as a JSON array of strings.',
      },
      {
        role: 'user',
        content: `Generate win themes for: ${opportunity?.title || 'Federal Opportunity'} (${opportunity?.agency || 'Federal Agency'})
Company: ${companyProfile?.name || 'Our Company'}
Capabilities: ${companyProfile?.capabilities || 'Full-service contractor'}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0]?.message?.content || '{"themes":[]}');

  return NextResponse.json({
    success: true,
    winThemes: result.themes || result.win_themes || [],
  });
}

async function generateComplianceMatrix(openai: OpenAI, requirements: any[], opportunity: any) {
  if (!requirements?.length) {
    return NextResponse.json({
      success: true,
      matrix: '## Compliance Matrix\n\nNo requirements provided for matrix generation.',
    });
  }

  const reqList = requirements
    .slice(0, 25)
    .map((r: any) => `- [${r.section_ref || 'N/A'}] ${r.requirement || ''}`)
    .join('\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a compliance specialist. Create a detailed compliance matrix in markdown table format.',
      },
      {
        role: 'user',
        content: `Create a compliance matrix for: ${opportunity?.title || 'Federal Opportunity'}

Requirements:
${reqList}

Format as a markdown table with columns: Ref | Requirement | Status | Proposal Section | Compliance Notes`,
      },
    ],
    temperature: 0.5,
    max_tokens: 2000,
  });

  return NextResponse.json({
    success: true,
    matrix: completion.choices[0]?.message?.content || '',
  });
}
