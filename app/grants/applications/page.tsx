'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Application {
  id: string;
  grantTitle: string;
  agency: string;
  amount: string;
  submittedDate: string | null;
  deadline: string;
  status: 'draft' | 'in_review' | 'submitted' | 'awarded' | 'rejected' | 'pending';
  completionPercent: number;
  notes: string;
}

const SAMPLE_APPLICATIONS: Application[] = [
  {
    id: 'APP-001',
    grantTitle: 'SBIR Phase I - Defense Technology',
    agency: 'Department of Defense',
    amount: '$150,000',
    submittedDate: null,
    deadline: '2026-04-15',
    status: 'draft',
    completionPercent: 35,
    notes: 'Technical narrative in progress. Budget justification needed.',
  },
  {
    id: 'APP-002',
    grantTitle: 'Cybersecurity Infrastructure Grant',
    agency: 'CISA / DHS',
    amount: '$300,000',
    submittedDate: '2026-02-10',
    deadline: '2026-03-01',
    status: 'submitted',
    completionPercent: 100,
    notes: 'Submitted. Awaiting review panel decision.',
  },
  {
    id: 'APP-003',
    grantTitle: 'Rural Business Development',
    agency: 'USDA',
    amount: '$100,000',
    submittedDate: '2026-01-15',
    deadline: '2026-02-01',
    status: 'awarded',
    completionPercent: 100,
    notes: 'Award received! Performance period starts March 2026.',
  },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  draft: { label: 'Draft', bg: 'bg-slate-700/50', text: 'text-slate-300' },
  in_review: { label: 'In Review', bg: 'bg-amber-900/30', text: 'text-amber-400' },
  submitted: { label: 'Submitted', bg: 'bg-blue-900/30', text: 'text-blue-400' },
  awarded: { label: 'Awarded', bg: 'bg-green-900/30', text: 'text-green-400' },
  rejected: { label: 'Not Selected', bg: 'bg-red-900/30', text: 'text-red-400' },
  pending: { label: 'Pending', bg: 'bg-purple-900/30', text: 'text-purple-400' },
};

export default function GrantApplications() {
  const [applications, setApplications] = useState<Application[]>(SAMPLE_APPLICATIONS);
  const [filter, setFilter] = useState('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newApp, setNewApp] = useState({ grantTitle: '', agency: '', amount: '', deadline: '', notes: '' });

  const filtered = filter === 'all'
    ? applications
    : applications.filter((a) => a.status === filter);

  const handleCreate = () => {
    const app: Application = {
      id: `APP-${String(applications.length + 1).padStart(3, '0')}`,
      grantTitle: newApp.grantTitle,
      agency: newApp.agency,
      amount: newApp.amount,
      submittedDate: null,
      deadline: newApp.deadline,
      status: 'draft',
      completionPercent: 0,
      notes: newApp.notes,
    };
    setApplications([app, ...applications]);
    setShowNewForm(false);
    setNewApp({ grantTitle: '', agency: '', amount: '', deadline: '', notes: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Grant Applications</h1>
            <p className="text-slate-400 mt-1">Track and manage your grant applications</p>
          </div>
          <div className="flex gap-3">
            <Link href="/grants" className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors">
              &larr; Grants Hub
            </Link>
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              + New Application
            </button>
          </div>
        </div>

        {/* New Application Form */}
        {showNewForm && (
          <div className="bg-slate-800/50 border border-emerald-700/50 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">New Grant Application</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Grant Title</label>
                <input
                  type="text"
                  value={newApp.grantTitle}
                  onChange={(e) => setNewApp({ ...newApp, grantTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter grant title"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Agency</label>
                <input
                  type="text"
                  value={newApp.agency}
                  onChange={(e) => setNewApp({ ...newApp, agency: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Funding agency"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Amount</label>
                <input
                  type="text"
                  value={newApp.amount}
                  onChange={(e) => setNewApp({ ...newApp, amount: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="$0"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Deadline</label>
                <input
                  type="date"
                  value={newApp.deadline}
                  onChange={(e) => setNewApp({ ...newApp, deadline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Notes</label>
              <textarea
                value={newApp.notes}
                onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={3}
                placeholder="Application notes..."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                Create Application
              </button>
              <button onClick={() => setShowNewForm(false)} className="px-6 py-2 text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'draft', 'submitted', 'in_review', 'awarded', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label || f}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filtered.map((app) => {
            const statusCfg = STATUS_CONFIG[app.status];
            return (
              <div key={app.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{app.grantTitle}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-slate-300"><span className="text-slate-500">Agency:</span> {app.agency}</span>
                      <span className="text-emerald-400 font-medium">{app.amount}</span>
                      <span className="text-slate-300"><span className="text-slate-500">Deadline:</span> {app.deadline}</span>
                      {app.submittedDate && (
                        <span className="text-slate-300"><span className="text-slate-500">Submitted:</span> {app.submittedDate}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{app.notes}</p>

                    {/* Progress Bar */}
                    {app.status === 'draft' && (
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-400">Completion</span>
                          <span className="text-emerald-400">{app.completionPercent}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${app.completionPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {app.status === 'draft' && (
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        Continue
                      </button>
                    )}
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No applications found</p>
              <p className="text-slate-500 text-sm mt-2">Create a new application or adjust your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
