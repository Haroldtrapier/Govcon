'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Grant {
  id: string;
  title: string;
  agency: string;
  fundingAmount: string;
  deadline: string;
  category: string;
  eligibility: string;
  status: string;
  cfda: string;
  matchRequired: boolean;
  description: string;
}

const SAMPLE_GRANTS: Grant[] = [
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
    description: 'Funding for transformational energy technologies that reduce dependence on foreign energy imports.',
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
    description: 'Support for health-related research and development based on the mission of the NIH.',
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
    description: 'Phase II funding for continued R&D of technologies proven feasible in Phase I.',
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
    description: 'Funding for workforce development programs and job training initiatives.',
  },
];

const CATEGORIES = [
  'All Categories',
  'Research & Development',
  'Community Development',
  'Cybersecurity',
  'Economic Development',
  'Energy & Environment',
  'Health & Medical Research',
  'Education & Workforce',
];

const AGENCIES = [
  'All Agencies',
  'Department of Defense',
  'Department of Energy',
  'HUD',
  'USDA',
  'NSF',
  'NIH',
  'CISA / DHS',
  'Department of Labor',
];

export default function GrantSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [agency, setAgency] = useState('All Agencies');
  const [status, setStatus] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [results, setResults] = useState<Grant[]>(SAMPLE_GRANTS);
  const [loading, setLoading] = useState(false);
  const [savedGrants, setSavedGrants] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/grants/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category, agency, status, minAmount, maxAmount }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.grants?.length) setResults(data.grants);
      }
    } catch {
      // Use sample data on error
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (id: string) => {
    setSavedGrants((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = results.filter((g) => {
    if (query && !g.title.toLowerCase().includes(query.toLowerCase()) && !g.description.toLowerCase().includes(query.toLowerCase())) return false;
    if (category !== 'All Categories' && g.category !== category) return false;
    if (agency !== 'All Agencies' && g.agency !== agency) return false;
    if (status !== 'all' && g.status.toLowerCase() !== status) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Search Grants</h1>
            <p className="text-slate-400 mt-1">Search federal, state, and SBIR/STTR grant opportunities</p>
          </div>
          <Link href="/grants" className="text-sm text-slate-400 hover:text-white transition-colors">
            &larr; Back to Grants
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by keyword, CFDA number, agency..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {AGENCIES.map((a) => <option key={a}>{a}</option>)}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="forecasted">Forecasted</option>
              <option value="closed">Closed</option>
            </select>
            <div className="flex gap-2">
              <input
                type="text"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="Min $"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="Max $"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">{filtered.length} grants found</p>
          <div className="flex gap-2">
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <option>Sort by Deadline</option>
              <option>Sort by Amount</option>
              <option>Sort by Relevance</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((grant) => (
            <div
              key={grant.id}
              className="bg-slate-800/50 border border-slate-700 hover:border-emerald-600/30 rounded-xl p-6 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{grant.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      grant.status === 'Open'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-blue-900/30 text-blue-400'
                    }`}>
                      {grant.status}
                    </span>
                    {grant.matchRequired && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-900/30 text-amber-400">
                        Match Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{grant.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-slate-300"><span className="text-slate-500">Agency:</span> {grant.agency}</span>
                    <span className="text-emerald-400 font-medium"><span className="text-slate-500">Amount:</span> {grant.fundingAmount}</span>
                    <span className="text-slate-300"><span className="text-slate-500">Deadline:</span> {grant.deadline}</span>
                    <span className="text-slate-300"><span className="text-slate-500">CFDA:</span> {grant.cfda}</span>
                    <span className="text-slate-300"><span className="text-slate-500">Category:</span> {grant.category}</span>
                  </div>
                  <p className="text-xs text-slate-500">Eligibility: {grant.eligibility}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleSave(grant.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      savedGrants.has(grant.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {savedGrants.has(grant.id) ? 'Saved' : 'Save'}
                  </button>
                  <Link
                    href={`/grants/applications?grant=${grant.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium text-center transition-colors"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
