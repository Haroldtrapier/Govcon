'use client';

import Link from 'next/link';

const SYSTEM_SECTIONS = [
  { name: 'System Status', href: '/system/status', icon: '🟢', description: 'Service health, uptime, and performance monitoring' },
  { name: 'Security', href: '/system/security', icon: '🔒', description: 'Password, 2FA, session management, and security settings' },
  { name: 'Team Management', href: '/system/team', icon: '👥', description: 'Invite team members, assign roles, and manage permissions' },
  { name: 'Permissions', href: '/system/permissions', icon: '🛡️', description: 'Role-based access control and permission policies' },
  { name: 'Integrations', href: '/system/integrations', icon: '🔌', description: 'API keys, webhooks, and third-party connections' },
  { name: 'Email Settings', href: '/system/email-settings', icon: '📧', description: 'Email templates, SMTP configuration, and notifications' },
  { name: 'Database', href: '/system/database', icon: '🗄️', description: 'Database management, migrations, and data tools' },
  { name: 'Backup', href: '/system/backup', icon: '💾', description: 'Data backup, restore, and disaster recovery' },
  { name: 'Audit Log', href: '/system/audit-log', icon: '📝', description: 'Activity logs, user actions, and system events' },
  { name: 'SSO', href: '/system/sso', icon: '🔑', description: 'Single Sign-On configuration (SAML, OIDC)' },
  { name: 'Documentation', href: '/system/documentation', icon: '📖', description: 'API docs, user guides, and system documentation' },
  { name: 'Help Center', href: '/system/help', icon: '❓', description: 'FAQs, troubleshooting, and support resources' },
];

export default function SystemHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">System Administration</h1>
          <p className="text-slate-400 mt-1">Manage system settings, security, team, and infrastructure</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SYSTEM_SECTIONS.map((section) => (
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
