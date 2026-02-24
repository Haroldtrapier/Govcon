'use client';

import { useState } from 'react';
import Link from 'next/link';

const MARKETPLACES = [
  {
    slug: 'sam',
    name: 'SAM.gov',
    description: 'System for Award Management - Register, search contracts, and find opportunities',
    category: 'Primary',
    icon: '🏛️',
    features: ['Entity Registration', 'Contract Search', 'Opportunity Alerts', 'Vendor Profile'],
    url: 'https://sam.gov',
  },
  {
    slug: 'usaspending',
    name: 'USAspending.gov',
    description: 'Track federal spending, awards, and agency budgets across the government',
    category: 'Research',
    icon: '💰',
    features: ['Spending Data', 'Award History', 'Agency Budgets', 'Recipient Profiles'],
    url: 'https://usaspending.gov',
  },
  {
    slug: 'fpds',
    name: 'FPDS',
    description: 'Federal Procurement Data System - Historical contract award data and analytics',
    category: 'Research',
    icon: '📊',
    features: ['Award History', 'Contract Data', 'Agency Reports', 'Trend Analysis'],
    url: 'https://fpds.gov',
  },
  {
    slug: 'govwin',
    name: 'GovWin',
    description: 'Market intelligence platform for government contracting opportunities',
    category: 'Intelligence',
    icon: '🎯',
    features: ['Opportunity Tracking', 'Agency Intelligence', 'Competitor Analysis', 'Pipeline'],
    url: 'https://govwin.com',
  },
  {
    slug: 'govspend',
    name: 'GovSpend',
    description: 'Government spending intelligence and procurement analytics',
    category: 'Intelligence',
    icon: '📈',
    features: ['Purchase Orders', 'Contract Data', 'Vendor Intelligence', 'Market Analysis'],
    url: 'https://govspend.com',
  },
  {
    slug: 'gsaadvantage',
    name: 'GSA Advantage',
    description: 'Online shopping and ordering system for GSA Schedule contract holders',
    category: 'GSA',
    icon: '🛒',
    features: ['Product Listings', 'Schedule Pricing', 'Order Tracking', 'BPA Management'],
    url: 'https://gsaadvantage.gov',
  },
  {
    slug: 'ebuy',
    name: 'GSA eBuy',
    description: 'Request quotes and submit proposals for GSA Schedule opportunities',
    category: 'GSA',
    icon: '📋',
    features: ['RFQ Responses', 'Quote Management', 'Schedule Categories', 'Bid Tracking'],
    url: 'https://ebuy.gsa.gov',
  },
  {
    slug: 'fedconnect',
    name: 'FedConnect',
    description: 'Connect with federal agencies for contracting opportunities',
    category: 'Portals',
    icon: '🔗',
    features: ['Opportunity Notifications', 'Proposal Submission', 'Award Tracking', 'Agency Connect'],
    url: 'https://fedconnect.net',
  },
  {
    slug: 'dibbs',
    name: 'DLA DIBBS',
    description: 'Defense Logistics Agency Internet Bid Board System for military procurement',
    category: 'Defense',
    icon: '🛡️',
    features: ['Solicitations', 'Bid Submission', 'Award Notices', 'Part Search'],
    url: 'https://dibbs.bsm.dla.mil',
  },
  {
    slug: 'nasasewp',
    name: 'NASA SEWP',
    description: 'NASA Solutions for Enterprise-Wide Procurement - IT products and services',
    category: 'Portals',
    icon: '🚀',
    features: ['IT Products', 'Services Catalog', 'Contract Vehicle', 'Order Management'],
    url: 'https://sewp.nasa.gov',
  },
  {
    slug: 'unison',
    name: 'Unison Marketplace',
    description: 'Procurement platform connecting government buyers with vendors',
    category: 'Portals',
    icon: '🤝',
    features: ['Vendor Matching', 'RFP Distribution', 'Bid Management', 'Contract Lifecycle'],
    url: 'https://unisonglobal.com',
  },
  {
    slug: 'samvendor',
    name: 'SAM Vendor Profile',
    description: 'Manage your SAM.gov registration, entity information, and certifications',
    category: 'Primary',
    icon: '👤',
    features: ['Entity Management', 'Certifications', 'POC Info', 'Reps & Certs'],
    url: 'https://sam.gov',
  },
];

const CATEGORIES = ['All', 'Primary', 'Research', 'Intelligence', 'GSA', 'Defense', 'Portals'];

export default function MarketplacesHub() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MARKETPLACES.filter((m) => {
    if (filter !== 'All' && m.category !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Marketplaces &amp; Portals</h1>
          <p className="text-slate-400 mt-1">
            Connect with government procurement platforms. Sturgeon AI provides analysis, strategy, and proposal support alongside each marketplace.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search marketplaces..."
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
          />
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <Link
              key={m.slug}
              href={`/marketplaces/${m.slug}`}
              className="bg-slate-800/50 border border-slate-700 hover:border-emerald-600/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-emerald-900/10 group"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{m.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">{m.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{m.description}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.features.map((f) => (
                  <span key={f} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                    {f}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded">{m.category}</span>
                <span className="text-xs text-emerald-400 group-hover:text-emerald-300">Open Workspace &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
