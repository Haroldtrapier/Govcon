'use client';

import { useState } from 'react';
import Link from 'next/link';

const SBIR_AGENCIES = [
  { name: 'Department of Defense (DoD)', budget: '$1.8B', topics: 156, icon: '🛡️', phases: ['I', 'II', 'III'] },
  { name: 'National Institutes of Health (NIH)', budget: '$1.2B', topics: 234, icon: '🏥', phases: ['I', 'II'] },
  { name: 'National Science Foundation (NSF)', budget: '$250M', topics: 89, icon: '🔬', phases: ['I', 'II'] },
  { name: 'Department of Energy (DOE)', budget: '$320M', topics: 67, icon: '⚡', phases: ['I', 'II', 'III'] },
  { name: 'NASA', budget: '$210M', topics: 45, icon: '🚀', phases: ['I', 'II'] },
  { name: 'Department of Education', budget: '$85M', topics: 23, icon: '📚', phases: ['I', 'II'] },
  { name: 'USDA', budget: '$45M', topics: 18, icon: '🌾', phases: ['I', 'II'] },
  { name: 'Department of Commerce (NIST)', budget: '$55M', topics: 28, icon: '📊', phases: ['I', 'II'] },
  { name: 'Department of Transportation', budget: '$30M', topics: 14, icon: '🚗', phases: ['I', 'II'] },
  { name: 'EPA', budget: '$20M', topics: 12, icon: '🌿', phases: ['I', 'II'] },
  { name: 'Department of Homeland Security', budget: '$40M', topics: 19, icon: '🏛️', phases: ['I', 'II'] },
];

const PHASES = [
  {
    phase: 'Phase I',
    subtitle: 'Feasibility Study',
    amount: '$50K - $275K',
    duration: '6-12 months',
    description: 'Prove the scientific and technical feasibility of your proposed innovation.',
    color: 'from-blue-600 to-blue-800',
  },
  {
    phase: 'Phase II',
    subtitle: 'Full R&D',
    amount: '$500K - $1.5M',
    duration: '24 months',
    description: 'Continue R&D based on Phase I results. Develop prototype and demonstrate viability.',
    color: 'from-purple-600 to-purple-800',
  },
  {
    phase: 'Phase III',
    subtitle: 'Commercialization',
    amount: 'Varies',
    duration: 'Ongoing',
    description: 'Commercialize the technology. No SBIR/STTR funding - uses other federal or private funding.',
    color: 'from-emerald-600 to-emerald-800',
  },
];

const TECH_AREAS = [
  'Artificial Intelligence / Machine Learning',
  'Cybersecurity',
  'Autonomous Systems',
  'Biotechnology',
  'Advanced Materials',
  'Quantum Computing',
  'Space Technology',
  'Clean Energy',
  'Medical Devices',
  'Advanced Manufacturing',
  'Sensors & Electronics',
  'Communications & Networking',
];

export default function SBIRPage() {
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [searchTech, setSearchTech] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">SBIR / STTR Navigator</h1>
            <p className="text-slate-400 mt-1">
              Small Business Innovation Research &amp; Technology Transfer programs
            </p>
          </div>
          <Link href="/grants" className="text-sm text-slate-400 hover:text-white transition-colors">
            &larr; Grants Hub
          </Link>
        </div>

        {/* Phase Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PHASES.map((p) => (
            <div key={p.phase} className={`bg-gradient-to-br ${p.color} rounded-xl p-6 text-white`}>
              <h3 className="text-xl font-bold">{p.phase}</h3>
              <p className="text-sm opacity-80 mt-1">{p.subtitle}</p>
              <div className="mt-4 space-y-2">
                <p className="text-2xl font-bold">{p.amount}</p>
                <p className="text-sm opacity-80">Duration: {p.duration}</p>
              </div>
              <p className="text-sm mt-3 opacity-90">{p.description}</p>
            </div>
          ))}
        </div>

        {/* Eligibility */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Eligibility Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="font-semibold text-emerald-400">Size</p>
              <p className="text-slate-300 mt-1">500 or fewer employees</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="font-semibold text-emerald-400">Ownership</p>
              <p className="text-slate-300 mt-1">51%+ owned by US citizens or permanent residents</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="font-semibold text-emerald-400">For-Profit</p>
              <p className="text-slate-300 mt-1">Must be a for-profit business organized in the US</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="font-semibold text-emerald-400">PI Requirement</p>
              <p className="text-slate-300 mt-1">Principal Investigator must be primarily employed by your firm</p>
            </div>
          </div>
        </div>

        {/* Technology Areas */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Technology Focus Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {TECH_AREAS.map((tech) => (
              <Link
                key={tech}
                href={`/grants/search?q=${encodeURIComponent(tech)}&category=SBIR`}
                className="bg-slate-800/50 border border-slate-700 hover:border-emerald-600/30 rounded-lg p-4 text-sm text-slate-300 hover:text-emerald-400 transition-all"
              >
                {tech}
              </Link>
            ))}
          </div>
        </div>

        {/* Participating Agencies */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Participating Agencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SBIR_AGENCIES.map((agency) => (
              <Link
                key={agency.name}
                href={`/grants/search?agency=${encodeURIComponent(agency.name)}&category=SBIR`}
                className="bg-slate-800/50 border border-slate-700 hover:border-emerald-600/30 rounded-xl p-5 flex items-center gap-4 transition-all group"
              >
                <span className="text-3xl">{agency.icon}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{agency.name}</h3>
                  <div className="flex gap-3 text-xs text-slate-400 mt-1">
                    <span>Budget: {agency.budget}</span>
                    <span>{agency.topics} topics</span>
                    <span>Phases: {agency.phases.join(', ')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
