import { NextRequest, NextResponse } from 'next/server';

interface GrantSearchParams {
  query?: string;
  category?: string;
  agency?: string;
  status?: string;
  state?: string;
  minAmount?: string;
  maxAmount?: string;
  page?: number;
  limit?: number;
}

const FALLBACK_GRANTS = [
  {
    id: 'GRANT-2026-001',
    title: 'Small Business Innovation Research (SBIR) Phase I',
    agency: 'Department of Defense',
    fundingAmount: '$50,000 - $250,000',
    deadline: '2026-04-15',
    category: 'Research & Development',
    eligibility: 'Small Business (500 or fewer employees)',
    status: 'Open',
    cfda: '12.431',
    matchRequired: false,
    description: 'Funding for feasibility studies and proof-of-concept research in defense technologies.',
  },
  {
    id: 'GRANT-2026-002',
    title: 'Community Development Block Grant (CDBG)',
    agency: 'Department of Housing and Urban Development',
    fundingAmount: '$100,000 - $1,000,000',
    deadline: '2026-03-30',
    category: 'Community Development',
    eligibility: 'State & Local Governments, Nonprofits',
    status: 'Open',
    cfda: '14.218',
    matchRequired: true,
    description: 'Grants for community development activities directed toward neighborhood revitalization.',
  },
  {
    id: 'GRANT-2026-003',
    title: 'Cybersecurity and Infrastructure Security Grant',
    agency: 'CISA / DHS',
    fundingAmount: '$100,000 - $500,000',
    deadline: '2026-05-01',
    category: 'Cybersecurity',
    eligibility: 'State & Local Governments',
    status: 'Open',
    cfda: '97.139',
    matchRequired: true,
    description: 'Funding to address cybersecurity risks and threats to information systems.',
  },
  {
    id: 'GRANT-2026-004',
    title: 'Rural Business Development Grant',
    agency: 'USDA Rural Development',
    fundingAmount: '$10,000 - $500,000',
    deadline: '2026-04-20',
    category: 'Economic Development',
    eligibility: 'Rural communities, small businesses',
    status: 'Open',
    cfda: '10.351',
    matchRequired: false,
    description: 'Grants for rural projects that finance and facilitate development of small businesses.',
  },
  {
    id: 'GRANT-2026-005',
    title: 'Advanced Research Projects Agency-Energy (ARPA-E)',
    agency: 'Department of Energy',
    fundingAmount: '$500,000 - $5,000,000',
    deadline: '2026-06-15',
    category: 'Energy & Environment',
    eligibility: 'Universities, Companies, Nonprofits',
    status: 'Forecasted',
    cfda: '81.135',
    matchRequired: false,
    description: 'Funding for transformational energy technologies.',
  },
  {
    id: 'GRANT-2026-006',
    title: 'National Institute of Health (NIH) R01 Research Grant',
    agency: 'National Institutes of Health',
    fundingAmount: '$250,000 - $500,000/year',
    deadline: '2026-05-07',
    category: 'Health & Medical Research',
    eligibility: 'Researchers, Universities, Medical Centers',
    status: 'Open',
    cfda: '93.855',
    matchRequired: false,
    description: 'Support for health-related research based on the mission of the NIH.',
  },
  {
    id: 'GRANT-2026-007',
    title: 'SBIR/STTR Phase II - Technology Maturation',
    agency: 'National Science Foundation',
    fundingAmount: '$500,000 - $1,000,000',
    deadline: '2026-07-01',
    category: 'Research & Development',
    eligibility: 'Phase I SBIR/STTR Awardees',
    status: 'Forecasted',
    cfda: '47.041',
    matchRequired: false,
    description: 'Phase II funding for continued R&D proven feasible in Phase I.',
  },
  {
    id: 'GRANT-2026-008',
    title: 'Workforce Innovation and Opportunity Act (WIOA) Grant',
    agency: 'Department of Labor',
    fundingAmount: '$50,000 - $2,000,000',
    deadline: '2026-04-10',
    category: 'Education & Workforce',
    eligibility: 'States, Workforce Development Boards',
    status: 'Open',
    cfda: '17.259',
    matchRequired: true,
    description: 'Funding for workforce development programs and job training.',
  },
];

async function searchGrantsGov(params: GrantSearchParams) {
  const apiKey = process.env.GRANTS_GOV_API_KEY || process.env.SAM_GOV_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const searchPayload: any = {
      keyword: params.query || '',
      oppStatuses: params.status === 'all' || !params.status ? 'forecasted,posted' : params.status,
      rows: params.limit || 25,
      startRecordNum: ((params.page || 1) - 1) * (params.limit || 25),
    };

    if (params.agency && params.agency !== 'All Agencies') {
      searchPayload.agency = params.agency;
    }

    if (params.category && params.category !== 'All Categories') {
      searchPayload.fundingCategories = params.category;
    }

    const response = await fetch('https://api.grants.gov/v1/api/search2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify(searchPayload),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error('[Grants.gov] API error:', response.status);
      return null;
    }

    const data = await response.json();
    const opportunities = data.oppHits || data.opportunities || [];

    return opportunities.map((opp: any, i: number) => ({
      id: opp.id || opp.oppNumber || `GG-${i}`,
      title: opp.title || opp.oppTitle || 'Untitled Grant',
      agency: opp.agency || opp.agencyName || 'Unknown Agency',
      fundingAmount: opp.awardCeiling
        ? `$${Number(opp.awardFloor || 0).toLocaleString()} - $${Number(opp.awardCeiling).toLocaleString()}`
        : 'See solicitation',
      deadline: opp.closeDate || opp.deadline || 'See solicitation',
      category: opp.fundingCategory || opp.category || 'General',
      eligibility: opp.eligibleApplicants || 'See solicitation',
      status: opp.oppStatus === 'posted' ? 'Open' : opp.oppStatus || 'Open',
      cfda: opp.cfdaNumber || opp.cfda || '',
      matchRequired: opp.costSharing === 'Yes',
      description: opp.synopsis || opp.description || '',
    }));
  } catch (error) {
    console.error('[Grants.gov] Search failed:', error);
    return null;
  }
}

function filterLocalGrants(params: GrantSearchParams) {
  let results = [...FALLBACK_GRANTS];
  const { query, category, agency, status } = params;

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.agency.toLowerCase().includes(q) ||
        g.cfda.includes(q)
    );
  }

  if (category && category !== 'All Categories') {
    results = results.filter((g) => g.category === category);
  }

  if (agency && agency !== 'All Agencies') {
    results = results.filter((g) => g.agency.includes(agency));
  }

  if (status && status !== 'all') {
    results = results.filter((g) => g.status.toLowerCase() === status.toLowerCase());
  }

  return results;
}

export async function POST(request: NextRequest) {
  try {
    const body: GrantSearchParams = await request.json();
    const { page = 1, limit = 20 } = body;

    const liveResults = await searchGrantsGov(body);

    if (liveResults && liveResults.length > 0) {
      return NextResponse.json({
        grants: liveResults.slice(0, limit),
        total: liveResults.length,
        page,
        totalPages: Math.ceil(liveResults.length / limit),
        source: 'grants.gov',
      });
    }

    const localResults = filterLocalGrants(body);
    const start = (page - 1) * limit;

    return NextResponse.json({
      grants: localResults.slice(start, start + limit),
      total: localResults.length,
      page,
      totalPages: Math.ceil(localResults.length / limit),
      source: 'local',
    });
  } catch (error) {
    console.error('[Grants Search] Error:', error);
    return NextResponse.json(
      { error: 'Failed to search grants', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const limit = parseInt(searchParams.get('limit') || '20');

  const params: GrantSearchParams = { query, category, limit };
  const liveResults = await searchGrantsGov(params);

  if (liveResults && liveResults.length > 0) {
    return NextResponse.json({
      grants: liveResults.slice(0, limit),
      total: liveResults.length,
      source: 'grants.gov',
    });
  }

  const localResults = filterLocalGrants(params);
  return NextResponse.json({
    grants: localResults.slice(0, limit),
    total: localResults.length,
    source: 'local',
  });
}
