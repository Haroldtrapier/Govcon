"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-800/80 rounded-xl overflow-hidden transition-colors hover:border-emerald-900/50 bg-slate-900/30">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left">
        <span className="font-semibold text-sm sm:text-base pr-4">{q}</span>
        <svg className={`w-5 h-5 text-emerald-500 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96" : "max-h-0"}`}>
        <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

const LIVE_FEED = [
  { id: "SAM-2026-0841", title: "IT Modernization Services", agency: "Department of Veterans Affairs", value: "$4.2M", type: "Full & Open", naics: "541512", posted: "2h ago" },
  { id: "SAM-2026-0839", title: "Cybersecurity Assessment & Auth.", agency: "Department of Homeland Security", value: "$2.8M", type: "8(a) Set-Aside", naics: "541519", posted: "3h ago" },
  { id: "SAM-2026-0835", title: "Cloud Infrastructure Migration", agency: "Department of Defense", value: "$12.5M", type: "SDVOSB", naics: "541513", posted: "5h ago" },
  { id: "SAM-2026-0832", title: "Data Analytics Platform", agency: "Health & Human Services", value: "$3.1M", type: "Small Business", naics: "541511", posted: "6h ago" },
  { id: "SAM-2026-0828", title: "Network Engineering Support", agency: "NASA", value: "$8.7M", type: "Full & Open", naics: "541513", posted: "8h ago" },
  { id: "GG-2026-4521", title: "SBIR Phase I - AI/ML Defense", agency: "Department of Defense", value: "$250K", type: "SBIR", naics: "541715", posted: "1d ago" },
];

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [annual, setAnnual] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAgentIdx, setActiveAgentIdx] = useState(0);

  const statsView = useInView(0.3);
  const featuresView = useInView(0.1);
  const howView = useInView(0.1);

  const stat1 = useCountUp(12847, 2000, statsView.inView);
  const stat2 = useCountUp(847, 1200, statsView.inView);
  const stat3 = useCountUp(85, 1500, statsView.inView);
  const stat4 = useCountUp(38, 1000, statsView.inView);

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { router.push("/dashboard"); return; }
      setChecking(false);
    };
    check();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveAgentIdx(i => (i + 1) % 6), 3000);
    return () => clearInterval(interval);
  }, []);

  if (checking) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400" /></div>;

  const go = (path: string) => () => router.push(path);

  const AGENTS = [
    { name: "Opportunity Scout", desc: "Scans SAM.gov, Grants.gov & FPDS in real-time", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
    { name: "Proposal Writer", desc: "Generates compliant, section-by-section proposals", icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" },
    { name: "Compliance Analyst", desc: "FAR/DFARS clause checks & CMMC tracking", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
    { name: "Market Researcher", desc: "Agency spending, competitor & pricing intel", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" },
    { name: "Grant Navigator", desc: "SBIR/STTR, federal & state grant matching", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Capture Strategist", desc: "Win themes, go/no-go analysis & teaming", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
  ];

  const FEATURES = [
    { title: "SAM.gov Live Search", desc: "Real-time contract & grant opportunity search with AI-scored matching against your company profile.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", color: "emerald" },
    { title: "AI Proposal Generation", desc: "Paste any RFP and generate compliant, section-by-section proposals with compliance matrices.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "blue" },
    { title: "Grant Discovery", desc: "Search Grants.gov, SBIR/STTR, and state programs. Track applications from draft to award.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1", color: "purple" },
    { title: "Compliance Engine", desc: "Automated FAR/DFARS clause checking, CMMC readiness, SAM.gov registration monitoring.", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622", color: "amber" },
    { title: "Market Intelligence", desc: "USASpending analytics, FPDS contract history, competitor analysis, and pricing research.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "rose" },
    { title: "Team Collaboration", desc: "Multi-user proposal editing, review workflows, role-based access, and capture team dashboards.", icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772", color: "cyan" },
  ];

  const colorMap: Record<string, string> = {
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-400",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
  };

  const PLANS = [
    { name: "Starter", monthlyPrice: 97, annualPrice: 77, desc: "Individual contractors", features: ["5 AI queries/day", "SAM.gov search", "1 proposal/month", "Basic compliance tools", "Email support"], cta: "Start Free" },
    { name: "Professional", monthlyPrice: 197, annualPrice: 157, desc: "Growing firms & teams", features: ["Unlimited AI queries", "ContractMatch engine", "Unlimited proposals", "All research tools", "Grants module", "Compliance automation", "5 team members", "Priority support"], cta: "Start Free Trial", popular: true },
    { name: "Enterprise", monthlyPrice: 397, annualPrice: 317, desc: "Large capture teams", features: ["Everything in Professional", "20+ team members", "API access", "Custom AI training", "White-label option", "Dedicated success manager", "SSO & audit trail"], cta: "Contact Sales" },
  ];

  const FAQS = [
    { q: "How does the AI generate proposals?", a: "Sturgeon AI uses 6 specialized agents. When you upload an RFP, the system extracts SHALL/MUST requirements, builds a compliance matrix, and generates section-by-section proposal content aligned with evaluation criteria. You review, edit, and export to DOCX." },
    { q: "Is my data secure?", a: "All data is encrypted at rest and in transit. We use Supabase (PostgreSQL) with row-level security, meaning users only access their own data. We never share your proposals or company information." },
    { q: "What certifications does Sturgeon AI support?", a: "We support all major small business certifications: SDVOSB, VOSB, 8(a), HUBZone, WOSB, EDWOSB, and SDB. The platform tracks status, expiry dates, and factors them into opportunity matching." },
    { q: "Does it integrate with SAM.gov?", a: "Yes. We integrate directly with SAM.gov's API for real-time opportunity data, entity validation, and set-aside info. We also connect to Grants.gov, USASpending.gov, and FPDS." },
    { q: "Can I try it before buying?", a: "Yes. Sign up free with no credit card. You get 5 AI queries/day, basic search, and 1 proposal/month. Upgrade anytime." },
    { q: "How is this different from GovWin or BidNet?", a: "Unlike traditional listing sites, Sturgeon AI doesn't just show you opportunities\u2014it writes your proposals, checks compliance, matches contracts to your profile, and provides AI-powered market intelligence. It's a complete capture management platform." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ═══ NAV ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/60 shadow-2xl shadow-black/30" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-[72px]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Sturgeon<span className="text-emerald-400"> AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#agents" className="hover:text-white transition-colors">AI Agents</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={go("/login")} className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors hidden sm:inline-block font-medium">Log In</button>
            <button onClick={go("/signup")} className="px-5 py-2.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-all font-semibold shadow-lg shadow-emerald-600/25">Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-28 sm:pt-36 pb-0 hero-gradient overflow-hidden">
        <div className="absolute inset-0 dot-grid pointer-events-none" />
        <div className="absolute top-20 left-[5%] w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-[5%] w-[400px] h-[400px] bg-blue-500/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8 animate-fade-in tracking-wide">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              POWERED BY GPT-4o &amp; CLAUDE AI
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.08] tracking-tight animate-slide-up">
              The AI Platform for<br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Government Contracting
              </span>
              <br />
              <span className="text-slate-400 text-3xl sm:text-4xl md:text-5xl">&amp; Grants</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "150ms" }}>
              Search SAM.gov &amp; Grants.gov. Generate winning proposals with AI.
              Track compliance, certifications, and your entire capture pipeline.
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto mt-10 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center bg-slate-900/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl shadow-black/30 focus-within:border-emerald-500/50 transition-colors">
                <div className="px-4 text-slate-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contracts, grants, NAICS codes, agencies..."
                  className="flex-1 bg-transparent py-4 text-white placeholder-slate-500 outline-none text-sm sm:text-base"
                  onKeyDown={(e) => e.key === "Enter" && router.push("/signup")}
                />
                <button onClick={go("/signup")} className="px-6 sm:px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors whitespace-nowrap">
                  Search Free
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
                <span>Popular:</span>
                <button onClick={go("/signup")} className="hover:text-emerald-400 transition-colors">IT Services 541512</button>
                <button onClick={go("/signup")} className="hover:text-emerald-400 transition-colors">Cybersecurity</button>
                <button onClick={go("/signup")} className="hover:text-emerald-400 transition-colors">8(a) Set-Asides</button>
                <button onClick={go("/signup")} className="hover:text-emerald-400 transition-colors">SBIR Grants</button>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-4 animate-slide-up" style={{ animationDelay: "400ms" }}>No credit card required &middot; Free plan available &middot; 5,000+ contractors trust Sturgeon AI</p>
          </div>

          {/* Live Opportunities Feed */}
          <div className="mt-16 animate-slide-up" style={{ animationDelay: "500ms" }}>
            <div className="rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl shadow-black/40 bg-slate-900/60 backdrop-blur-sm">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-slate-900/80">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/70" /><div className="w-3 h-3 rounded-full bg-yellow-500/70" /><div className="w-3 h-3 rounded-full bg-green-500/70" /></div>
                  <span className="text-xs font-medium text-slate-400">Live Opportunity Feed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Live</span>
                </div>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-5 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800/50 bg-slate-950/50">
                <div className="col-span-1">ID</div>
                <div className="col-span-3">Title</div>
                <div className="col-span-3">Agency</div>
                <div className="col-span-1 text-right">Value</div>
                <div className="col-span-2">Set-Aside</div>
                <div className="col-span-1">NAICS</div>
                <div className="col-span-1 text-right">Posted</div>
              </div>

              {/* Table rows */}
              {LIVE_FEED.map((opp, i) => (
                <div key={opp.id} className={`grid grid-cols-12 gap-2 px-5 py-3 text-xs items-center border-b border-slate-800/30 hover:bg-emerald-500/5 transition-colors cursor-pointer ${i === 0 ? "bg-emerald-500/5" : ""}`} onClick={go("/signup")}>
                  <div className="col-span-1 text-slate-500 font-mono">{opp.id.split("-").pop()}</div>
                  <div className="col-span-3 font-medium text-white truncate">{opp.title}</div>
                  <div className="col-span-3 text-slate-400 truncate">{opp.agency}</div>
                  <div className="col-span-1 text-right text-emerald-400 font-semibold">{opp.value}</div>
                  <div className="col-span-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      opp.type === "8(a) Set-Aside" ? "bg-purple-900/40 text-purple-400" :
                      opp.type === "SDVOSB" ? "bg-blue-900/40 text-blue-400" :
                      opp.type === "SBIR" ? "bg-amber-900/40 text-amber-400" :
                      opp.type === "Small Business" ? "bg-emerald-900/40 text-emerald-400" :
                      "bg-slate-800 text-slate-400"
                    }`}>{opp.type}</span>
                  </div>
                  <div className="col-span-1 text-slate-500 font-mono">{opp.naics}</div>
                  <div className="col-span-1 text-right text-slate-500">{opp.posted}</div>
                </div>
              ))}

              <div className="px-5 py-3 bg-slate-950/50 flex items-center justify-between">
                <span className="text-xs text-slate-500">Showing 6 of 12,847 active opportunities</span>
                <button onClick={go("/signup")} className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">View All &rarr;</button>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient fade to next section */}
        <div className="h-24 bg-gradient-to-b from-transparent to-slate-950" />
      </section>

      {/* ═══ TRUSTED BY ═══ */}
      <section className="border-y border-slate-800/40 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-[11px] text-slate-500 uppercase tracking-[0.2em] mb-6 font-semibold">Trusted by contractors working with leading federal agencies</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 items-center">
            {["Department of Defense", "NASA", "GSA", "DHS", "Veterans Affairs", "HHS", "DOE", "USDA"].map(name => (
              <span key={name} className="text-sm font-semibold text-slate-700 tracking-wide whitespace-nowrap">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section ref={statsView.ref} className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: stat1.toLocaleString() + "+", label: "Active Opportunities", sub: "Contracts & Grants" },
              { value: "$" + stat2 + "B+", label: "In Federal Awards", sub: "Tracked Annually" },
              { value: stat3 + "%", label: "Time Saved", sub: "On Proposal Writing" },
              { value: stat4 + "%", label: "Avg Win Rate", sub: "For Pro Users" },
            ].map((s, i) => (
              <div key={s.label} className={`text-center ${statsView.inView ? "animate-count-up" : "opacity-0"}`} style={{ animationDelay: `${i * 120}ms` }}>
                <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-sm font-semibold text-slate-200 mt-2">{s.label}</p>
                <p className="text-xs text-slate-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI AGENTS ═══ */}
      <section id="agents" className="py-20 bg-slate-900/20 border-y border-slate-800/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">AI-Powered Intelligence</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold">6 Specialized AI Agents Working For You</h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">Each agent is trained on government contracting data, FAR/DFARS regulations, and thousands of winning proposals.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AGENTS.map((agent, i) => (
              <div
                key={agent.name}
                className={`relative rounded-xl p-6 border transition-all duration-500 cursor-default ${
                  activeAgentIdx === i
                    ? "bg-emerald-950/40 border-emerald-500/40 shadow-xl shadow-emerald-500/10 scale-[1.02]"
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                {activeAgentIdx === i && (
                  <div className="absolute top-3 right-3">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                    </span>
                  </div>
                )}
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${
                  activeAgentIdx === i ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                }`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={agent.icon} /></svg>
                </div>
                <h3 className="font-bold text-sm mb-1">{agent.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" ref={featuresView.ref} className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">Complete Platform</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Everything You Need to Win</h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">More than a search tool. Sturgeon AI is a full capture management platform powered by artificial intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`group glass-card gradient-border rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 ${featuresView.inView ? "animate-slide-up" : "opacity-0"}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[f.color]} border flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                </div>
                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" ref={howView.ref} className="py-20 bg-slate-900/20 border-y border-slate-800/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold">From RFP to Award in 4 Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { step: "01", title: "Set Up Your Profile", desc: "Add NAICS codes, certifications (8(a), SDVOSB, HUBZone, WOSB), past performance, and company capabilities." },
              { step: "02", title: "Discover Opportunities", desc: "AI scans SAM.gov, Grants.gov, eBuy, and FPDS daily. Get scored matches tailored to your profile." },
              { step: "03", title: "Generate Proposals", desc: "Paste the RFP. AI extracts requirements, builds compliance matrices, and generates section-by-section proposals." },
              { step: "04", title: "Win & Track", desc: "Submit, track your pipeline, monitor compliance, and build your past performance record." },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`relative p-8 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-900/50 transition-all group ${howView.inView ? "animate-slide-up" : "opacity-0"}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span className="text-7xl font-black text-emerald-500/[0.07] absolute top-3 right-5 group-hover:text-emerald-500/[0.12] transition-colors select-none">{item.step}</span>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold mb-4">{item.step}</div>
                <h3 className="text-lg font-bold mb-2 relative">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed relative">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Simple, Transparent Pricing</h2>
            <p className="text-slate-400 mt-3">No hidden fees. Cancel anytime.</p>

            <div className="inline-flex items-center gap-1 mt-6 bg-slate-900 rounded-full p-1 border border-slate-800">
              <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!annual ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>Monthly</button>
              <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${annual ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>Annual <span className="text-emerald-300 text-xs ml-1">-20%</span></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {PLANS.map(p => {
              const price = annual ? p.annualPrice : p.monthlyPrice;
              return (
                <div key={p.name} className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${p.popular ? "bg-gradient-to-b from-emerald-950/50 to-slate-950 border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/10" : "glass-card"}`}>
                  {p.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-emerald-500/30 uppercase tracking-wider">Most Popular</span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{p.desc}</p>
                  <div className="mt-5 mb-6">
                    <span className="text-4xl font-extrabold">${price}</span>
                    <span className="text-slate-400 text-sm">/mo</span>
                  </div>
                  <button onClick={go("/signup")} className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${p.popular ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20" : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"}`}>{p.cta}</button>
                  <ul className="mt-7 space-y-3">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-slate-300 text-[13px]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-20 bg-slate-900/20 border-y border-slate-800/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="absolute top-10 left-[20%] w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-[20%] w-[400px] h-[400px] bg-blue-500/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Ready to Win More<br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Government Contracts &amp; Grants?</span>
          </h2>
          <p className="text-lg text-slate-400 mt-4 max-w-xl mx-auto">Join thousands of small businesses using Sturgeon AI to compete and win in federal contracting.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button onClick={go("/signup")} className="group px-10 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 font-semibold text-lg shadow-2xl shadow-emerald-600/25 hover:shadow-emerald-500/35 transition-all hover:-translate-y-0.5">
              Get Started Free
              <svg className="inline-block w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-4">No credit card required &middot; Free plan available</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-slate-800/60 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span className="text-lg font-bold">Sturgeon AI</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">AI-powered government contracting &amp; grants intelligence for small businesses.</p>
            </div>
            {[
              { title: "Platform", links: [["Features", "/pro/features"], ["Pricing", "/pro/pricing"], ["AI Agents", "/agents"], ["Grants", "/grants"]] },
              { title: "Resources", links: [["Documentation", "/system/documentation"], ["Help Center", "/system/help"], ["Status", "/system/status"], ["Support", "/support"]] },
              { title: "Data Sources", links: [["SAM.gov", "/marketplaces/sam"], ["Grants.gov", "/grants/federal"], ["FPDS", "/marketplaces/fpds"], ["USASpending", "/marketplaces/usaspending"]] },
              { title: "Company", links: [["Security", "/system/security"], ["Sign In", "/login"], ["Sign Up", "/signup"], ["Contact", "/support"]] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-xs font-bold mb-4 text-slate-300 uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}><button onClick={go(href)} className="text-sm text-slate-500 hover:text-emerald-400 transition-colors">{label}</button></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} Sturgeon AI. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-600">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer">SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
