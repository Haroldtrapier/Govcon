'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GrantAnalytics() {
  const [timeRange, setTimeRange] = useState('12m');

  const stats = [
    { label: 'Applications Submitted', value: '12', change: '+3 this quarter', color: 'text-blue-400' },
    { label: 'Grants Won', value: '4', change: '33% win rate', color: 'text-emerald-400' },
    { label: 'Total Funding Secured', value: '$680,000', change: '+$150K this quarter', color: 'text-purple-400' },
    { label: 'Avg. Award Size', value: '$170,000', change: '', color: 'text-amber-400' },
  ];

  const pipelineData = [
    { stage: 'Researching', count: 8, value: '$1.2M', color: 'bg-slate-500' },
    { stage: 'Drafting', count: 3, value: '$450K', color: 'bg-blue-500' },
    { stage: 'In Review', count: 2, value: '$350K', color: 'bg-amber-500' },
    { stage: 'Submitted', count: 4, value: '$600K', color: 'bg-purple-500' },
    { stage: 'Awarded', count: 4, value: '$680K', color: 'bg-emerald-500' },
    { stage: 'Not Selected', count: 5, value: '$750K', color: 'bg-red-500' },
  ];

  const topAgencies = [
    { agency: 'Department of Defense', applied: 4, won: 2, winRate: '50%', funding: '$300K' },
    { agency: 'NSF', applied: 3, won: 1, winRate: '33%', funding: '$150K' },
    { agency: 'USDA', applied: 2, won: 1, winRate: '50%', funding: '$100K' },
    { agency: 'DOE', applied: 2, won: 0, winRate: '0%', funding: '$0' },
    { agency: 'NIH', applied: 1, won: 0, winRate: '0%', funding: '$0' },
  ];

  const recentActivity = [
    { date: '2026-02-22', event: 'Application submitted: SBIR Phase II', type: 'submit' },
    { date: '2026-02-20', event: 'Grant awarded: Rural Business Development', type: 'award' },
    { date: '2026-02-18', event: 'Draft started: Clean Energy Innovation', type: 'draft' },
    { date: '2026-02-15', event: 'Not selected: Workforce Development Grant', type: 'reject' },
    { date: '2026-02-10', event: 'Application submitted: Cybersecurity Grant', type: 'submit' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Grant Analytics</h1>
            <p className="text-slate-400 mt-1">Performance insights and funding trends</p>
          </div>
          <div className="flex gap-3 items-center">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
            >
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
            <Link href="/grants" className="text-sm text-slate-400 hover:text-white transition-colors">
              &larr; Grants Hub
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              {stat.change && <p className="text-xs text-slate-500 mt-1">{stat.change}</p>}
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Grant Pipeline</h2>
          <div className="space-y-3">
            {pipelineData.map((stage) => (
              <div key={stage.stage} className="flex items-center gap-4">
                <span className="text-sm text-slate-300 w-28">{stage.stage}</span>
                <div className="flex-1 h-8 bg-slate-700/50 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full ${stage.color} rounded-lg transition-all flex items-center px-3`}
                    style={{ width: `${Math.max((stage.count / 8) * 100, 15)}%` }}
                  >
                    <span className="text-xs font-medium text-white">{stage.count}</span>
                  </div>
                </div>
                <span className="text-sm text-slate-400 w-20 text-right">{stage.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agency Performance */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Agency Performance</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left pb-3 text-xs font-medium text-slate-400 uppercase">Agency</th>
                  <th className="text-center pb-3 text-xs font-medium text-slate-400 uppercase">Applied</th>
                  <th className="text-center pb-3 text-xs font-medium text-slate-400 uppercase">Won</th>
                  <th className="text-center pb-3 text-xs font-medium text-slate-400 uppercase">Win Rate</th>
                  <th className="text-right pb-3 text-xs font-medium text-slate-400 uppercase">Funding</th>
                </tr>
              </thead>
              <tbody>
                {topAgencies.map((a) => (
                  <tr key={a.agency} className="border-b border-slate-700/50">
                    <td className="py-3 text-sm text-white">{a.agency}</td>
                    <td className="py-3 text-sm text-center text-slate-300">{a.applied}</td>
                    <td className="py-3 text-sm text-center text-emerald-400">{a.won}</td>
                    <td className="py-3 text-sm text-center text-slate-300">{a.winRate}</td>
                    <td className="py-3 text-sm text-right text-emerald-400">{a.funding}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.type === 'award' ? 'bg-emerald-400' :
                    item.type === 'submit' ? 'bg-blue-400' :
                    item.type === 'reject' ? 'bg-red-400' : 'bg-slate-400'
                  }`} />
                  <div>
                    <p className="text-sm text-slate-200">{item.event}</p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
