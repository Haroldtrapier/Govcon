'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function GrantDetail() {
  const params = useParams();
  const grantId = (params?.id as string) || '';
  const [saved, setSaved] = useState(false);

  const grant = {
    id: grantId,
    title: 'Small Business Innovation Research (SBIR) Phase I',
    agency: 'Department of Defense',
    subAgency: 'Office of the Under Secretary of Defense for Research and Engineering',
    fundingAmount: '$50,000 - $250,000',
    deadline: '2026-04-15',
    postedDate: '2026-01-15',
    category: 'Research & Development',
    cfda: '12.431',
    fundingInstrument: 'Grant',
    eligibility: 'Small Business (500 or fewer employees)',
    matchRequired: false,
    costSharing: 'Not required',
    status: 'Open',
    description: `The Department of Defense SBIR program is designed to provide small businesses the opportunity to propose innovative ideas that meet the specific research and development needs of the Federal Government. This Phase I solicitation seeks proposals that demonstrate the feasibility of proposed concepts for solving defense-related challenges.

Key areas of interest include:
- Artificial Intelligence and Machine Learning
- Cybersecurity and Cyber Operations
- Autonomous Systems
- Advanced Materials and Manufacturing
- Quantum Science and Technology
- Biotechnology
- Space Technology
- 5G and Advanced Communications`,
    requirements: [
      'Must be a US-based small business with fewer than 500 employees',
      'Principal Investigator must be primarily employed by the applicant firm',
      'At least 2/3 of the Phase I research must be performed by the proposing firm',
      'Must address one or more of the published SBIR topics',
      'Proposal must not exceed 25 pages',
    ],
    timeline: [
      { date: '2026-01-15', event: 'Solicitation Posted' },
      { date: '2026-02-28', event: 'Pre-Release Information' },
      { date: '2026-03-15', event: 'Questions Deadline' },
      { date: '2026-04-15', event: 'Application Deadline' },
      { date: '2026-07-15', event: 'Expected Award Notification' },
      { date: '2026-09-01', event: 'Expected Start Date' },
    ],
    contacts: [
      { name: 'SBIR/STTR Help Desk', email: 'sbirhelp@defense.gov', phone: '(800) 382-4634' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/grants" className="hover:text-white transition-colors">Grants</Link>
          <span>/</span>
          <Link href="/grants/search" className="hover:text-white transition-colors">Search</Link>
          <span>/</span>
          <span className="text-slate-300 truncate">{grant.title}</span>
        </div>

        {/* Header */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{grant.title}</h1>
                <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-sm font-medium">
                  {grant.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-slate-300">{grant.agency}</span>
                <span className="text-emerald-400 font-semibold">{grant.fundingAmount}</span>
                <span className="text-slate-300">CFDA: {grant.cfda}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSaved(!saved)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                  saved ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {saved ? 'Saved' : 'Save Grant'}
              </button>
              <Link
                href={`/grants/applications?grant=${grantId}`}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Start Application
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
            <div>
              <p className="text-xs text-slate-500 uppercase">Posted</p>
              <p className="text-sm text-slate-300">{grant.postedDate}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Deadline</p>
              <p className="text-sm text-red-400 font-medium">{grant.deadline}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Instrument</p>
              <p className="text-sm text-slate-300">{grant.fundingInstrument}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Cost Sharing</p>
              <p className="text-sm text-slate-300">{grant.costSharing}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
          <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{grant.description}</div>
        </div>

        {/* Eligibility & Requirements */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Eligibility &amp; Requirements</h2>
          <p className="text-sm text-emerald-400 font-medium mb-3">{grant.eligibility}</p>
          <ul className="space-y-2">
            {grant.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-emerald-400 mt-0.5">&#10003;</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Key Dates</h2>
          <div className="space-y-3">
            {grant.timeline.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  new Date(item.date) < new Date() ? 'bg-emerald-500' : 'bg-slate-600'
                }`} />
                <span className="text-sm text-slate-400 w-28">{item.date}</span>
                <span className="text-sm text-slate-200">{item.event}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Contact Information</h2>
          {grant.contacts.map((c, i) => (
            <div key={i} className="text-sm space-y-1">
              <p className="text-slate-200 font-medium">{c.name}</p>
              <p className="text-slate-400">{c.email} | {c.phone}</p>
            </div>
          ))}
        </div>

        {/* AI Analysis */}
        <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/5 border border-emerald-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">AI Readiness Analysis</h2>
          <p className="text-sm text-slate-300 mb-4">
            Get AI-powered insights on your eligibility, competitiveness, and recommended approach for this grant.
          </p>
          <Link
            href="/chat/proposal-help"
            className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            Analyze with AI
          </Link>
        </div>
      </div>
    </div>
  );
}
