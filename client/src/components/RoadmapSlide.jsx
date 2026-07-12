import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, ShieldCheck, ArrowLeft, X, Landmark, Users, Key, Globe, ShieldAlert, Phone } from 'lucide-react';

const roadmapData = [
  {
    phase: 'Phase 1',
    title: 'Local Safety Audit MVP',
    subtitle: 'On-device consumer safety check',
    description: 'Privacy-first, on-device loan terms calculator, plain-language translation, and active friction consent steps.',
    timeline: 'Q3 2026 (Live MVP)',
    stakeholders: 'Low-income borrowers, first-time mobile users, and community advocacy groups.',
    tech: 'React, Tailwind CSS HSL variables, and LocalStorage for secure, offline history logging.',
    icon: ShieldCheck,
    color: 'bg-teal-50 border-teal-200 text-teal-700 hover:border-teal-500'
  },
  {
    phase: 'Phase 2',
    title: 'Consent Block & API Handshake',
    subtitle: 'Blocking unsolicited mobile cash releases',
    description: 'Integrating with digital lenders using secure API webhooks. The borrower receives a signed verification token once the safety audit is passed. Mobile money providers block cash release until this token is checked.',
    timeline: 'Q4 2026 (Beta Integration)',
    stakeholders: 'Mobile Network Operators (MTN/Airtel), registered digital lenders, and security teams.',
    tech: 'JSON Web Tokens (JWT), RESTful API gateways, and cryptographic consent checks.',
    icon: Key,
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-500'
  },
  {
    phase: 'Phase 3',
    title: 'USSD Offline Integration',
    subtitle: 'Safety checks via feature phones (no internet)',
    description: 'Deploying custom USSD codes (e.g. *284*4#) and SMS-based safety queries. Allows rural borrowers to calculate loan costs, verify consent, and check affordability offline.',
    timeline: 'Q1 2027 (Rural Expansion)',
    stakeholders: 'Rural farmers, remote community cooperatives, and offline mobile subscribers.',
    tech: 'USSD session gateways (Africa\'s Talking), SMS broadcast channels, and lightweight offline scoring nodes.',
    icon: Phone,
    color: 'bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-500'
  },
  {
    phase: 'Phase 4',
    title: 'Community Trust Scores',
    subtitle: 'Crowdsourced lender review system',
    description: 'Building verified borrower post-loan feedback cycles. Aggregating Google Play Store reviews, app permissions (detecting contact list scrapers or photo scrapers), and public court filings.',
    timeline: 'Q2 2027 (Platform Expansion)',
    stakeholders: 'General borrowing public and consumer credit rating algorithms.',
    tech: 'Puppeteer-based store crawlers, sentiment analysis algorithms, and MongoDB review collections.',
    icon: Users,
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:border-indigo-500'
  },
  {
    phase: 'Phase 5',
    title: 'Regulator Compliance Dashboard',
    subtitle: 'Real-time enforcement tools for UMRA',
    description: 'Providing GovTech analytics portal directly to the Uganda Microfinance Regulatory Authority (UMRA). Visualizes anonymous user-flagged predatory reports, average interest rates across districts, and triggers alerts.',
    timeline: 'Q3 2027 (Regulatory Launch)',
    stakeholders: 'UMRA inspectors, central bank policymakers, and national enforcement teams.',
    tech: 'D3.js interactive mapping, geo-located interest rate grids, and encrypted government agency portals.',
    icon: Landmark,
    color: 'bg-teal-50 border-teal-200 text-teal-700 hover:border-teal-500'
  },
  {
    phase: 'Phase 6',
    title: 'Africa-Wide Wallet Protection',
    subtitle: 'Scaling safety to regional mobile wallets',
    description: 'Scaling the Credi-Check protocol across the East African Community (EAC) and continental Africa. Building direct developer SDKs and integration adapters for major telcos like Safaricom, Orange Money, and Wave.',
    timeline: 'Q4 2027 (Continental Scale)',
    stakeholders: 'Regional central banks, fintech hubs, and international telecommunications companies.',
    tech: 'Multi-region AWS clustering, cross-border token validation, and universal USSD integration nodes.',
    icon: Globe,
    color: 'bg-rose-50 border-rose-200 text-rose-700 hover:border-rose-500'
  }
];

export default function RoadmapSlide({ onBack }) {
  const [selectedPhase, setSelectedPhase] = useState(null);

  const PhaseIcon = selectedPhase?.icon || Rocket;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-2">
          <Rocket className="h-6 w-6 text-teal-600 animate-pulse" />
          Credi-Check Product Evolution Roadmap
        </h2>
        <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
          Interactive development roadmap. Click on any phase node to unlock technical specifications, target timelines, and developer milestones.
        </p>
      </div>

      {/* Staggered Tree Diagram Container */}
      <div className="relative py-8 min-h-[500px]">
        {/* Dash Timeline Center Line (Trunk) */}
        <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-slate-200 -translate-x-1/2 pointer-events-none" />

        <div className="space-y-12">
          {roadmapData.map((item, index) => {
            const IconComponent = item.icon;
            const isLeft = index % 2 === 0;

            return (
              <div 
                key={index}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${
                  isLeft ? 'md:justify-start' : 'md:justify-end'
                }`}
              >
                {/* Node Center Dot Indicator */}
                <div 
                  onClick={() => setSelectedPhase(item)}
                  className={`absolute left-[28px] md:left-1/2 -translate-x-1/2 z-20 h-9 w-9 rounded-full border-2 bg-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-md ${
                    item.phase === 'Phase 1' ? 'border-teal-500 text-teal-600' : 'border-slate-300 text-slate-500'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>

                {/* Staggered Content Card Block */}
                <div className={`w-full md:w-[45%] pl-14 md:pl-0 ${
                  isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'
                }`}>
                  <Card 
                    onClick={() => setSelectedPhase(item)}
                    className={`cursor-pointer border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-teal-500 transition-all duration-350 transform hover:-translate-y-0.5 rounded-2xl group overflow-hidden`}
                  >
                    <div className="p-5 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full inline-block">
                        {item.phase}
                      </span>
                      <h3 className="font-bold text-sm text-slate-850 group-hover:text-teal-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 italic">
                        {item.subtitle}
                      </p>
                      <span className="text-[10px] block font-bold text-slate-400 mt-2">
                        📅 Target: {item.timeline}
                      </span>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Popup Overlay */}
      {selectedPhase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-slideUp relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPhase(null)}
              className="absolute right-5 top-5 p-1 rounded-full text-slate-450 hover:text-slate-700 hover:bg-slate-50 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${selectedPhase.color}`}>
                <PhaseIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                  Product Blueprint &bull; {selectedPhase.phase}
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedPhase.title}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-600">
              
              <div className="space-y-1">
                <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">Phase Objective</span>
                <p className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-650 italic">
                  &ldquo;{selectedPhase.subtitle}&rdquo;
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">Detailed Scope</span>
                <p className="text-slate-600">{selectedPhase.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">Target Timeline</span>
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100/50 inline-block">
                    {selectedPhase.timeline}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">Key Technologies</span>
                  <p className="text-slate-500 font-mono text-[10px]">{selectedPhase.tech}</p>
                </div>
              </div>

              <div className="space-y-1 pt-1.5 border-t border-slate-100">
                <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">Key Stakeholders</span>
                <p className="text-slate-500">{selectedPhase.stakeholders}</p>
              </div>

            </div>

            {/* Action Close */}
            <div className="pt-2">
              <Button
                onClick={() => setSelectedPhase(null)}
                className="w-full bg-teal-650 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl border-0 shadow-sm"
              >
                Close Phase Blueprint
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="text-center pt-4">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50/50 px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Safety Audit
        </Button>
      </div>

    </div>
  );
}
