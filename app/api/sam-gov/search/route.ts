import { NextRequest, NextResponse } from 'next/server';

interface SearchParams {
  naicsCodes?: string[];
  keywords?: string[];
  postedFrom?: string;
  postedTo?: string;
  limit?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchParams = await request.json();
    const { naicsCodes, keywords, postedFrom, postedTo, limit = 10 } = body;

    if (!naicsCodes || naicsCodes.length === 0) {
      return NextResponse.json(
        { error: 'At least one NAICS code is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SAM_GOV_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'SAM.gov API key not configured' },
        { status: 500 }
      );
    }

    // Build query string
    const params = new URLSearchParams();
    params.append('api_key', apiKey);
    params.append('limit', limit.toString());
    params.append('ptype', 'o'); // Opportunities only

    // Add NAICS codes
    naicsCodes.forEach(code => params.append('ncode', code));

    // Add keywords if provided
    if (keywords && keywords.length > 0) {
      keywords.forEach(keyword => params.append('qterms', keyword));
    }

    // Add date filters
    if (postedFrom) params.append('postedFrom', postedFrom);
    if (postedTo) params.append('postedTo', postedTo);

    const url = `https://api.sam.gov/opportunities/v2/search?${params.toString()}`;

    console.log('[SAM.gov] Searching opportunities:', {
      naicsCodes,
      keywords,
      postedFrom,
      postedTo,
      limit
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[SAM.gov] API Error:', response.status, errorText);
      return NextResponse.json(
        { error: 'SAM.gov API request failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      count: data.opportunitiesData?.length || 0,
      opportunities: data.opportunitiesData || []
    });

  } catch (error) {
    console.error('[SAM.gov] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
