'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SavedGrant {
  id: string;
  title: string;
  agency: string;
  amount: string;
  deadline: string;
  category: string;
  savedDate: string;
  notes: string;
  status: string;
}

const SAMPLE_SAVED: SavedGrant[] = [
  {
    id: 'SG-001',
    title: 'SBIR Phase I - Defense Technology Innovation',
    agency: 'Department of Defense',
    amount: '$150,000',
    deadline: '2026-04-15',
    category: 'Research & Development',
    savedDate: '2026-02-20',
    notes: 'Good fit for our AI analytics platform',
    status: 'Open',
  },
  {
    id: 'SG-002',
    title: 'Cybersecurity Infrastructure Improvement Grant',
    agency: 'CISA / DHS',
    amount: '$300,000',
    deadline: '2026-05-01',
    category: 'Cybersecurity',
    savedDate: '2026-02-18',
    notes: 'Requires state/local government partnership',
    status: 'Open',
  },
  {
    id: 'SG-003',
    title: 'Clean Energy Technology Development',
    agency: 'Department of Energy',
    amount: '$750,000',
    deadline: '2026-06-15',
    category: 'Energy & Environment',
    savedDate: '2026-02-15',
    notes: 'Review eligibility requirements',
    status: 'Forecasted',
  },
];

export default function SavedGrants() {
  const [grants, setGrants] = useState<SavedGrant[]>(SAMPLE_SAVED);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setGrants((prev) => prev.filter((g) => g.id !== id));
  };

  const handleUpdateNote = (id: string, note: string) => {
    setGrants((prev) => prev.map((g) => g.id === id ? { ...g, notes: note } : g));
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Saved Grants</h1>
            <p className="text-slate-400 mt-1">Your bookmarked grant opportunities</p>
          </div>
          <div className="flex gap-3">
            <Link href="/grants" className="text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg px-4 py-2 transition-colors">
              &larr; Grants Hub
            </Link>
            <Link href="/grants/search" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
              Find More Grants
            </Link>
          </div>
        </div>

        {grants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-xl font-semibold text-white">No saved grants yet</h2>
            <p className="text-slate-400 mt-2">Search for grants and save them here for easy access</p>
            <Link href="/grants/search" className="inline-block mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
              Search Grants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {grants.map((grant) => (
              <div key={grant.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{grant.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        grant.status === 'Open' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'
                      }`}>
                        {grant.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-slate-300">{grant.agency}</span>
                      <span className="text-emerald-400 font-medium">{grant.amount}</span>
                      <span className="text-slate-300">Deadline: {grant.deadline}</span>
                      <span className="text-slate-500">Saved: {grant.savedDate}</span>
                    </div>

                    {editingNote === grant.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={grant.notes}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateNote(grant.id, (e.target as HTMLInputElement).value);
                          }}
                          className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          autoFocus
                        />
                        <button onClick={() => setEditingNote(null)} className="text-xs text-slate-400">Cancel</button>
                      </div>
                    ) : (
                      <p
                        className="text-sm text-slate-400 cursor-pointer hover:text-slate-300"
                        onClick={() => setEditingNote(grant.id)}
                      >
                        {grant.notes || 'Click to add notes...'}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/grants/applications?grant=${grant.id}`}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium text-center transition-colors"
                    >
                      Apply
                    </Link>
                    <button
                      onClick={() => handleRemove(grant.id)}
                      className="px-4 py-2 bg-slate-700 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
