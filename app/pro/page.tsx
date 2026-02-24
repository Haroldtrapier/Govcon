'use client';

import Link from 'next/link';

const PRO_SECTIONS = [
  { name: 'Pro Features', href: '/pro/features', icon: '✨', description: 'Explore all premium features available with Pro' },
  { name: 'Upgrade to Pro', href: '/pro/upgrade', icon: '🚀', description: 'Compare plans and upgrade your subscription' },
  { name: 'Pricing', href: '/pro/pricing', icon: '💎', description: 'View detailed pricing and plan comparison' },
  { name: 'Team Management', href: '/pro/team', icon: '👥', description: 'Add team members and manage seats' },
  { name: 'API Access', href: '/pro/api', icon: '🔌', description: 'API keys, rate limits, and developer tools' },
  { name: 'Integrations', href: '/pro/integrations', icon: '🔗', description: 'Connect with CRM, ERP, and other tools' },
  { name: 'Document Management', href: '/pro/documents', icon: '📁', description: 'Advanced document storage and version control' },
  { name: 'White Label', href: '/pro/white-label', icon: '🏷️', description: 'Custom branding and white-label options' },
  { name: 'Audit Trail', href: '/pro/audit-trail', icon: '📋', description: 'Detailed activity tracking and compliance auditing' },
];

const CURRENT_PLAN = {
  name: 'Free',
  features: ['5 Opportunities/month', 'Basic Search', 'AI Chat (limited)', '1 User'],
};

export default function ProHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Pro &amp; Billing</h1>
            <p className="text-slate-400 mt-1">Manage your subscription, team, and premium features</p>
          </div>
          <Link
            href="/pro/upgrade"
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg font-medium transition-all shadow-lg shadow-emerald-900/30"
          >
            Upgrade to Pro
          </Link>
        </div>

        {/* Current Plan */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Current Plan</p>
              <p className="text-2xl font-bold text-white mt-1">{CURRENT_PLAN.name}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CURRENT_PLAN.features.map((f) => (
                <span key={f} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRO_SECTIONS.map((section) => (
            <Link
              key={section.name}
              href={section.href}
              className="bg-slate-800/50 border border-slate-700 hover:border-emerald-600/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-emerald-900/10 group"
            >
              <div className="text-3xl mb-3">{section.icon}</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                {section.name}
              </h3>
              <p className="text-sm text-slate-400 mt-2">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
