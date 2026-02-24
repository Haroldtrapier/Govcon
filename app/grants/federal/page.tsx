'use client';

import { useState } from 'react';
import Link from 'next/link';

const FEDERAL_AGENCIES = [
  { name: 'Department of Defense (DoD)', grants: 342, icon: '🛡️' },
  { name: 'Department of Energy (DOE)', grants: 189, icon: '⚡' },
  { name: 'National Science Foundation (NSF)', grants: 256, icon: '🔬' },
  { name: 'National Institutes of Health (NIH)', grants: 478, icon: '🏥' },
  { name: 'USDA', grants: 167, icon: '🌾' },
  { name: 'Department of Homeland Security', grants: 94, icon: '🏛️' },
  { name: 'Department of Education', grants: 132, icon: '📚' },
  { name: 'EPA', grants: 88, icon: '🌿' },
  { name: 'Department of Commerce', grants: 76, icon: '💼' },
  { name: 'HUD', grants: 112, icon: '🏠' },
  { name: 'Department of Transportation', grants: 145, icon: '🚗' },
  { name: 'Department of Labor', grants: 67, icon: '👷' },
];

const FEATURED_PROGRAMS = [
  {
    name: 'SBIR/STTR Program',
    description: 'Small Business Innovation Research and Small Business Technology Transfer programs across 11 federal agencies',
    totalFunding: '$4.2B annually',
    agencies: 'DoD, NIH, NSF, DOE, NASA, and more',
    link: '/grants/sbir',
  },
  {
    name: 'Grants.gov',
    description: 'Central clearinghouse for all federal grant opportunities with over 1,000 grant programs',
    totalFunding: '$500B+ available',
    agencies: 'All federal agencies',
    link: '/grants/search',
  },
  {
    name: 'Community Development Financial Institutions (CDFI)',
    description: 'Funding for organizations providing financial services in underserved communities',
    totalFunding: '$324M annually',
    agencies: 'Department of Treasury',
    link: '/grants/search?q=CDFI',
  },
];

export default function FederalGrants() {
  const [searchAgency, setSearchAgency] = useState('');

  const filteredAgencies = FEDERAL_AGENCIES.filter((a) =>
    a.name.toLowerCase().includes(searchAgency.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Federal Grants</h1>
            <p className="text-slate-400 mt-1">Browse grants from federal agencies including Grants.gov, SBIR/STTR, and agency-specific programs</p>
          </div>
          <Link href="/grants" className="text-sm text-slate-400 hover:text-white transition-colors">
            &larr; Grants Hub
          </Link>
        </div>

        {/* Featured Programs */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Featured Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURED_PROGRAMS.map((program) => (
              <Link
                key={program.name}
                href={program.link}
                className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700 hover:border-emerald-600/50 rounded-xl p-6 transition-all group"
              >
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">{program.name}</h3>
                <p className="text-sm text-slate-400 mt-2">{program.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs">
                  <span className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded">{program.totalFunding}</span>
                  <span className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded">{program.agencies}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Browse by Agency */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Browse by Agency</h2>
            <input
              type="text"
              value={searchAgency}
              onChange={(e) => setSearchAgency(e.target.value)}
              placeholder="Filter agencies..."
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgencies.map((agency) => (
              <Link
                key={agency.name}
                href={`/grants/search?agency=${encodeURIComponent(agency.name)}`}
                className="bg-slate-800/50 border border-slate-700 hover:border-emerald-600/30 rounded-xl p-5 flex items-center gap-4 transition-all group"
              >
                <span className="text-3xl">{agency.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{agency.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{agency.grants} active grant programs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How to Apply */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">How to Apply for Federal Grants</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Register', desc: 'Register at SAM.gov and Grants.gov. Obtain a UEI number.' },
              { step: '2', title: 'Search', desc: 'Find grants matching your organization and capabilities.' },
              { step: '3', title: 'Prepare', desc: 'Draft your proposal, budget narrative, and supporting docs.' },
              { step: '4', title: 'Submit', desc: 'Submit through Grants.gov or agency-specific portals.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 mx-auto bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
