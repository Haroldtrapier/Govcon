'use client';

import { useState } from 'react';
import Link from 'next/link';

const STATES = [
  { name: 'Alabama', abbr: 'AL', programs: 23 }, { name: 'Alaska', abbr: 'AK', programs: 12 },
  { name: 'Arizona', abbr: 'AZ', programs: 34 }, { name: 'Arkansas', abbr: 'AR', programs: 18 },
  { name: 'California', abbr: 'CA', programs: 87 }, { name: 'Colorado', abbr: 'CO', programs: 45 },
  { name: 'Connecticut', abbr: 'CT', programs: 28 }, { name: 'Delaware', abbr: 'DE', programs: 15 },
  { name: 'Florida', abbr: 'FL', programs: 56 }, { name: 'Georgia', abbr: 'GA', programs: 38 },
  { name: 'Hawaii', abbr: 'HI', programs: 14 }, { name: 'Idaho', abbr: 'ID', programs: 16 },
  { name: 'Illinois', abbr: 'IL', programs: 52 }, { name: 'Indiana', abbr: 'IN', programs: 29 },
  { name: 'Iowa', abbr: 'IA', programs: 22 }, { name: 'Kansas', abbr: 'KS', programs: 19 },
  { name: 'Kentucky', abbr: 'KY', programs: 24 }, { name: 'Louisiana', abbr: 'LA', programs: 21 },
  { name: 'Maine', abbr: 'ME', programs: 17 }, { name: 'Maryland', abbr: 'MD', programs: 42 },
  { name: 'Massachusetts', abbr: 'MA', programs: 48 }, { name: 'Michigan', abbr: 'MI', programs: 35 },
  { name: 'Minnesota', abbr: 'MN', programs: 31 }, { name: 'Mississippi', abbr: 'MS', programs: 16 },
  { name: 'Missouri', abbr: 'MO', programs: 27 }, { name: 'Montana', abbr: 'MT', programs: 14 },
  { name: 'Nebraska', abbr: 'NE', programs: 18 }, { name: 'Nevada', abbr: 'NV', programs: 20 },
  { name: 'New Hampshire', abbr: 'NH', programs: 13 }, { name: 'New Jersey', abbr: 'NJ', programs: 39 },
  { name: 'New Mexico', abbr: 'NM', programs: 22 }, { name: 'New York', abbr: 'NY', programs: 72 },
  { name: 'North Carolina', abbr: 'NC', programs: 36 }, { name: 'North Dakota', abbr: 'ND', programs: 12 },
  { name: 'Ohio', abbr: 'OH', programs: 41 }, { name: 'Oklahoma', abbr: 'OK', programs: 19 },
  { name: 'Oregon', abbr: 'OR', programs: 33 }, { name: 'Pennsylvania', abbr: 'PA', programs: 47 },
  { name: 'Rhode Island', abbr: 'RI', programs: 15 }, { name: 'South Carolina', abbr: 'SC', programs: 23 },
  { name: 'South Dakota', abbr: 'SD', programs: 11 }, { name: 'Tennessee', abbr: 'TN', programs: 28 },
  { name: 'Texas', abbr: 'TX', programs: 65 }, { name: 'Utah', abbr: 'UT', programs: 24 },
  { name: 'Vermont', abbr: 'VT', programs: 13 }, { name: 'Virginia', abbr: 'VA', programs: 44 },
  { name: 'Washington', abbr: 'WA', programs: 38 }, { name: 'West Virginia', abbr: 'WV', programs: 17 },
  { name: 'Wisconsin', abbr: 'WI', programs: 26 }, { name: 'Wyoming', abbr: 'WY', programs: 10 },
];

const CATEGORIES = [
  { name: 'Economic Development', count: 423, icon: '💼' },
  { name: 'Small Business', count: 312, icon: '🏪' },
  { name: 'Technology & Innovation', count: 198, icon: '💻' },
  { name: 'Workforce Development', count: 267, icon: '👷' },
  { name: 'Infrastructure', count: 156, icon: '🏗️' },
  { name: 'Environment & Energy', count: 134, icon: '🌿' },
];

export default function StateGrants() {
  const [search, setSearch] = useState('');

  const filtered = STATES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.abbr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">State &amp; Local Grants</h1>
            <p className="text-slate-400 mt-1">Discover grants from state, county, and municipal programs</p>
          </div>
          <Link href="/grants" className="text-sm text-slate-400 hover:text-white transition-colors">
            &larr; Grants Hub
          </Link>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Grant Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/grants/search?category=${encodeURIComponent(cat.name)}`}
                className="bg-slate-800/50 border border-slate-700 hover:border-emerald-600/30 rounded-xl p-4 text-center transition-all group"
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <h3 className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{cat.count} programs</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Browse by State */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Browse by State</h2>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search states..."
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filtered.map((state) => (
              <Link
                key={state.abbr}
                href={`/grants/search?state=${state.abbr}`}
                className="bg-slate-800/50 border border-slate-700 hover:border-emerald-600/30 rounded-lg p-3 text-center transition-all group"
              >
                <p className="text-lg font-bold text-emerald-400">{state.abbr}</p>
                <p className="text-xs text-slate-400 group-hover:text-white transition-colors truncate">{state.name}</p>
                <p className="text-xs text-slate-500 mt-1">{state.programs} programs</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
