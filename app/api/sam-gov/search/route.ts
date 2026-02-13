// app/api/sam-gov/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 60;

interface SearchParams {
  naicsCodes: string[];
  keywords?: string[];
  limit?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { naicsCodes, keywords = [], limit = 100 }: SearchParams = await request.json();

    if (!naicsCodes || naicsCodes.length === 0) {
      return NextResponse.json({ error: 'NAICS codes required' }, { status: 400 });
    }

    const apiKey = process.env.SAM_GOV_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SAM.gov API key not configured' }, { status: 500 });
    }

    // Build SAM.gov API query
    const naicsQuery = naicsCodes.map(code => `naicsCode:"${code}"`).join(' OR ');
    const keywordQuery = keywords.length > 0 
      ? ' AND (' + keywords.map(kw => `title:*${kw}* OR description:*${kw}*`).join(' OR ') + ')'
      : '';

    const q = `(${naicsQuery})${keywordQuery}`;

    // Call SAM.gov API v3
    const url = new URL('https://api.sam.gov/opportunities/v2/search');
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('q', q);
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('postedFrom', getDateDaysAgo(7)); // Last 7 days
    url.searchParams.set('postedTo', getTodayDate());
    url.searchParams.set('ptype', 'o,p,k,r'); // All opportunity types

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Extract and format opportunities
    const opportunities = data.opportunitiesData?.map((opp: any) => ({
      id: opp.noticeId,
      title: opp.title,
      type: opp.type,
      agency: opp.department || opp.subtierAgency || 'Unknown',
      naicsCode: opp.naicsCode,
      postedDate: opp.postedDate,
      responseDeadline: opp.responseDeadLine,
      description: opp.description?.substring(0, 500),
      link: `https://sam.gov/opp/${opp.noticeId}/view`,
      solicitationNumber: opp.solicitationNumber
    })) || [];

    return NextResponse.json({
      success: true,
      count: opportunities.length,
      opportunities,
      query: q
    });

  } catch (error: any) {
    console.error('SAM.gov search error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search SAM.gov' },
      { status: 500 }
    );
  }
}

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
