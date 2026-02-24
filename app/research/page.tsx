'use client';

import { useState } from 'react';
import Link from 'next/link';

const RESEARCH_TOOLS = [
  {
    name: 'Market Research',
    href: '/research/market-research',
    icon: '📊',
    description: 'Analyze market size, trends, and competition for government sectors',
  },
  {
    name: 'NAICS Code Lookup',
    href: '/research/naics',
    icon: '🔢',
    description: 'Find and validate NAICS codes for your products and services',
  },
  {
    name: 'Competitor Analysis',
    href: '/research/competitor',
    icon: '🎯',
    description: 'Research competitor past performance, pricing, and teaming arrangements',
  },
  {
    name: 'Agency Spending',
    href: '/research/agency-spending',
    icon: '💰',
    description: 'Analyze federal agency spending patterns and budget allocations',
  },
  {
    name: 'Past Performance',
    href: '/research/past-performance',
    icon: '📋',
    description: 'Research contract past performance data from FPDS and USAspending',
  },
  {
    name: 'Pricing Research',
    href: '/research/pricing',
    icon: '💲',
    description: 'Analyze competitive pricing data and labor rate benchmarks',
  },
  {
    name: 'Set-Aside Research',
    href: '/research/set-aside',
    icon: '🏷️',
    description: 'Research 8(a), HUBZone, SDVOSB, WOSB, and other set-aside categories',
  },
  {
    name: 'Decision Tools',
    href: '/research/decision-tools',
    icon: '⚖️',
    description: 'Go/No-Go decision matrices and bid analysis tools',
  },
  {
    name: 'Reports',
    href: '/research/reports',
    icon: '📑',
    description: 'Generate custom research reports and market intelligence briefings',
  },
  {
    name: 'Analytics',
    href: '/research/analytics',
    icon: '📈',
    description: 'Historical trend analysis and predictive insights',
  },
];

export default function ResearchHub() {
  const [search, setSearch] = useState('');

  const filtered = RESEARCH_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Research Center</h1>
            <p className="text-slate-400 mt-1">
              Tools and data for government contracting research, competitive analysis, and market intelligence
            </p>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <p className="text-sm text-slate-400">Agencies Tracked</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">47</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <p className="text-sm text-slate-400">NAICS Codes</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">1,065</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <p className="text-sm text-slate-400">Contract Records</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">2.4M+</p>
          </div>
        </div>

        {/* Research Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="bg-slate-800/50 border border-slate-700 hover:border-emerald-600/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-emerald-900/10 group"
            >
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-slate-400 mt-2">{tool.description}</p>
            </Link>
          ))}
        </div>

        {/* AI Research Assistant */}
        <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/5 border border-emerald-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">AI Research Assistant</h2>
              <p className="text-sm text-slate-300 mt-1">
                Ask natural language questions about government spending, agencies, competitors, and market trends
              </p>
            </div>
            <Link
              href="/chat"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Open AI Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
