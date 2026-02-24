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

const GRANTS_DATABASE = [
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

export async function POST(request: NextRequest) {
  try {
    const body: GrantSearchParams = await request.json();
    const { query, category, agency, status, page = 1, limit = 20 } = body;

    let results = [...GRANTS_DATABASE];

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

    const total = results.length;
    const start = (page - 1) * limit;
    const paginatedResults = results.slice(start, start + limit);

    return NextResponse.json({
      grants: paginatedResults,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[Grants Search] Error:', error);
    return NextResponse.json(
      { error: 'Failed to search grants' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const limit = parseInt(searchParams.get('limit') || '20');

  let results = [...GRANTS_DATABASE];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.cfda.includes(q)
    );
  }

  if (category) {
    results = results.filter((g) => g.category === category);
  }

  return NextResponse.json({
    grants: results.slice(0, limit),
    total: results.length,
  });
}
