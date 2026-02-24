'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ActiveGrant {
  id: string;
  title: string;
  agency: string;
  awardAmount: string;
  startDate: string;
  endDate: string;
  fundsSpent: number;
  totalBudget: number;
  nextReport: string;
  reportType: string;
  status: 'active' | 'closeout' | 'completed';
  milestones: { name: string; due: string; complete: boolean }[];
}

const ACTIVE_GRANTS: ActiveGrant[] = [
  {
    id: 'AWD-001',
    title: 'Rural Business Development Grant',
    agency: 'USDA',
    awardAmount: '$100,000',
    startDate: '2026-03-01',
    endDate: '2027-02-28',
    fundsSpent: 15000,
    totalBudget: 100000,
    nextReport: '2026-06-30',
    reportType: 'Quarterly Financial Report',
    status: 'active',
    milestones: [
      { name: 'Kickoff Meeting', due: '2026-03-15', complete: true },
      { name: 'Q1 Progress Report', due: '2026-06-30', complete: false },
      { name: 'Mid-year Review', due: '2026-09-01', complete: false },
      { name: 'Q3 Progress Report', due: '2026-12-31', complete: false },
      { name: 'Final Report', due: '2027-02-28', complete: false },
    ],
  },
  {
    id: 'AWD-002',
    title: 'SBIR Phase I - AI Defense Analytics',
    agency: 'Department of Defense',
    awardAmount: '$150,000',
    startDate: '2025-09-01',
    endDate: '2026-08-31',
    fundsSpent: 95000,
    totalBudget: 150000,
    nextReport: '2026-03-31',
    reportType: 'Technical Progress Report',
    status: 'active',
    milestones: [
      { name: 'Kickoff', due: '2025-09-15', complete: true },
      { name: 'Prototype v1', due: '2026-01-15', complete: true },
      { name: 'User Testing', due: '2026-04-01', complete: false },
      { name: 'Final Deliverable', due: '2026-08-15', complete: false },
      { name: 'Final Report', due: '2026-08-31', complete: false },
    ],
  },
];

export default function GrantTracking() {
  const [grants] = useState<ActiveGrant[]>(ACTIVE_GRANTS);
  const [selectedGrant, setSelectedGrant] = useState<ActiveGrant | null>(null);

  const totalAwarded = grants.reduce((sum, g) => sum + g.totalBudget, 0);
  const totalSpent = grants.reduce((sum, g) => sum + g.fundsSpent, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Grant Tracking</h1>
            <p className="text-slate-400 mt-1">Monitor active grants, budgets, and reporting deadlines</p>
          </div>
          <Link href="/grants" className="text-sm text-slate-400 hover:text-white transition-colors">
            &larr; Grants Hub
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <p className="text-sm text-slate-400">Active Grants</p>
            <p className="text-2xl font-bold text-white mt-1">{grants.filter(g => g.status === 'active').length}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <p className="text-sm text-slate-400">Total Awarded</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">${totalAwarded.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <p className="text-sm text-slate-400">Funds Expended</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">${totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <p className="text-sm text-slate-400">Remaining</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">${(totalAwarded - totalSpent).toLocaleString()}</p>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Reporting Deadlines</h2>
          <div className="space-y-3">
            {grants.map((grant) => (
              <div key={grant.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">{grant.title}</p>
                  <p className="text-xs text-slate-400">{grant.reportType}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-400 font-medium">{grant.nextReport}</p>
                  <p className="text-xs text-slate-500">{grant.agency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grant Details */}
        <div className="space-y-6">
          {grants.map((grant) => (
            <div key={grant.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{grant.title}</h3>
                  <div className="flex gap-4 text-sm mt-1">
                    <span className="text-slate-400">{grant.agency}</span>
                    <span className="text-emerald-400 font-medium">{grant.awardAmount}</span>
                    <span className="text-slate-400">{grant.startDate} &mdash; {grant.endDate}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-900/30 text-green-400">
                  {grant.status === 'active' ? 'Active' : grant.status === 'closeout' ? 'Closeout' : 'Completed'}
                </span>
              </div>

              {/* Budget Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Budget Utilization</span>
                  <span className="text-emerald-400">{Math.round((grant.fundsSpent / grant.totalBudget) * 100)}% spent</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all"
                    style={{ width: `${(grant.fundsSpent / grant.totalBudget) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1 text-slate-500">
                  <span>${grant.fundsSpent.toLocaleString()} spent</span>
                  <span>${(grant.totalBudget - grant.fundsSpent).toLocaleString()} remaining</span>
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3">Milestones</h4>
                <div className="space-y-2">
                  {grant.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        m.complete
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {m.complete ? '✓' : (i + 1)}
                      </div>
                      <span className={`flex-1 text-sm ${m.complete ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                        {m.name}
                      </span>
                      <span className={`text-xs ${m.complete ? 'text-slate-600' : 'text-slate-400'}`}>
                        {m.due}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
