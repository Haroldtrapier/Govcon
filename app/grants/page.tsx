'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GrantStats {
  totalAvailable: number;
  savedGrants: number;
  activeApplications: number;
  wonGrants: number;
  totalFunding: string;
}

const GRANT_CATEGORIES = [
  { name: 'Federal Grants', href: '/grants/federal', icon: '🏛️', desc: 'Grants.gov, SBIR/STTR, and federal agency grants', count: 'Browse' },
  { name: 'State & Local', href: '/grants/state', icon: '🗺️', desc: 'State, county, and municipal grant programs', count: 'Browse' },
  { name: 'SBIR/STTR', href: '/grants/sbir', icon: '🔬', desc: 'Small Business Innovation Research & Technology Transfer', count: 'Browse' },
  { name: 'Search Grants', href: '/grants/search', icon: '🔍', desc: 'Search across all grant databases', count: 'Search' },
  { name: 'My Applications', href: '/grants/applications', icon: '📋', desc: 'Track your grant applications and deadlines', count: 'Manage' },
  { name: 'Grant Tracking', href: '/grants/tracking', icon: '📊', desc: 'Monitor active grants and reporting requirements', count: 'Track' },
  { name: 'Saved Grants', href: '/grants/saved', icon: '⭐', desc: 'Your bookmarked and saved grant opportunities', count: 'View' },
  { name: 'Analytics', href: '/grants/analytics', icon: '📈', desc: 'Grant win rates, funding trends, and insights', count: 'View' },
];

const RECENT_GRANTS = [
  { title: 'Small Business Technology Transfer (STTR) Phase I', agency: 'Department of Defense', amount: '$150,000', deadline: '2026-04-15', status: 'Open' },
  { title: 'Community Development Block Grant', agency: 'HUD', amount: '$500,000', deadline: '2026-03-30', status: 'Open' },
  { title: 'Cybersecurity Research Grant', agency: 'NSF', amount: '$250,000', deadline: '2026-05-01', status: 'Open' },
  { title: 'Rural Business Development Grant', agency: 'USDA', amount: '$100,000', deadline: '2026-04-20', status: 'Open' },
  { title: 'Energy Efficiency Improvement Grant', agency: 'DOE', amount: '$750,000', deadline: '2026-06-15', status: 'Forecasted' },
];

export default function GrantsHub() {
  const [stats, setStats] = useState<GrantStats>({
    totalAvailable: 2847,
    savedGrants: 0,
    activeApplications: 0,
    wonGrants: 0,
    totalFunding: '$0',
  });
  const [loading, setLoading] = useState(false);

  const statCards = [
    { label: 'Available Grants', value: stats.totalAvailable.toLocaleString(), color: 'text-blue-400' },
    { label: 'Saved Grants', value: stats.savedGrants.toString(), color: 'text-emerald-400' },
    { label: 'Active Applications', value: stats.activeApplications.toString(), color: 'text-amber-400' },
    { label: 'Won Grants', value: stats.wonGrants.toString(), color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Grants Center</h1>
            <p className="text-slate-400 mt-1">
              Discover, apply for, and track government grants and funding opportunities
            </p>
          </div>
          <Link
            href="/grants/search"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            Search Grants
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Categories Grid */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Grant Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GRANT_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="bg-slate-800/50 border border-slate-700 hover:border-emerald-600/50 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-emerald-900/20 group"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors">{cat.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{cat.desc}</p>
                <span className="inline-block mt-3 text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Grant Opportunities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Grant Opportunities</h2>
            <Link href="/grants/search" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all &rarr;
            </Link>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Grant Title</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Agency</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Deadline</th>
                  <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-right p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_GRANTS.map((grant, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                      <Link href="/grants/search" className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">
                        {grant.title}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-slate-300">{grant.agency}</td>
                    <td className="p-4 text-sm text-emerald-400 font-medium">{grant.amount}</td>
                    <td className="p-4 text-sm text-slate-300">{grant.deadline}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        grant.status === 'Open'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-blue-900/30 text-blue-400'
                      }`}>
                        {grant.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-xs bg-slate-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded transition-colors">
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Grant Readiness Check</h3>
            <p className="text-sm text-slate-300 mb-4">Evaluate your organization&apos;s readiness for federal grant applications</p>
            <Link href="/grants/applications" className="text-sm text-blue-400 hover:text-blue-300">
              Start Assessment &rarr;
            </Link>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">SBIR/STTR Navigator</h3>
            <p className="text-sm text-slate-300 mb-4">Find SBIR/STTR opportunities matching your technology areas</p>
            <Link href="/grants/sbir" className="text-sm text-purple-400 hover:text-purple-300">
              Explore SBIR &rarr;
            </Link>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 border border-emerald-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">AI Grant Writer</h3>
            <p className="text-sm text-slate-300 mb-4">Use AI to help draft compelling grant proposals and narratives</p>
            <Link href="/chat/proposal-help" className="text-sm text-emerald-400 hover:text-emerald-300">
              Start Writing &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
