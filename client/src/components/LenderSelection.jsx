import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Landmark, Star, ChevronRight, BarChart2, PieChart } from 'lucide-react';

const lenders = [
  {
    id: 'tala',
    name: 'Tala Mobile Loan',
    shortName: 'Tala Mobile',
    interestRate: 15,
    feeAmount: 10000,
    repaymentPeriodDays: 30,
    trustScore: 4.5,
    category: 'Fintech Mobile app',
    badge: 'Fast disbursement',
    color: 'text-teal-400 border-teal-800/40 bg-teal-950/20'
  },
  {
    id: 'branch',
    name: 'Branch Finance',
    shortName: 'Branch',
    interestRate: 12,
    feeAmount: 15000,
    repaymentPeriodDays: 30,
    trustScore: 4.6,
    category: 'Fintech Mobile app',
    badge: 'Lower Mobile Rate',
    color: 'text-emerald-400 border-emerald-800/40 bg-emerald-955/20'
  },
  {
    id: 'mkopa',
    name: 'M-Kopa Cash',
    shortName: 'M-Kopa Cash',
    interestRate: 25,
    feeAmount: 30000,
    repaymentPeriodDays: 60,
    trustScore: 3.8,
    category: 'Asset Financer',
    badge: 'High Cost / Flexible',
    color: 'text-amber-400 border-amber-800/40 bg-amber-955/20'
  },
  {
    id: 'watu',
    name: 'Watu Credit Uganda',
    shortName: 'Watu Credit',
    interestRate: 20,
    feeAmount: 50000,
    repaymentPeriodDays: 90,
    trustScore: 3.9,
    category: 'Microfinance Institution',
    badge: 'Longer repayment',
    color: 'text-amber-400 border-amber-800/40 bg-amber-955/20'
  },
  {
    id: 'ugtrust',
    name: 'Uganda Trust Microfinance',
    shortName: 'Uganda Trust',
    interestRate: 8,
    feeAmount: 20000,
    repaymentPeriodDays: 90,
    trustScore: 4.8,
    category: 'Regulated Microfinance',
    badge: 'Highly Regulated',
    color: 'text-emerald-400 border-emerald-800/40 bg-emerald-955/20'
  }
];

export default function LenderSelection({ onSelect }) {
  // Autoplay cycle state
  const [hoveredLenderId, setHoveredLenderId] = useState('tala');
  const [autoCycle, setAutoCycle] = useState(true);

  // Auto-rotating slider effect
  useEffect(() => {
    if (!autoCycle) return;

    const timer = setInterval(() => {
      setHoveredLenderId((current) => {
        const idx = lenders.findIndex(l => l.id === current);
        const nextIdx = (idx + 1) % lenders.length;
        return lenders[nextIdx].id;
      });
    }, 2500); // Switch every 2.5 seconds

    return () => clearInterval(timer);
  }, [autoCycle]);

  const BASE_LOAN = 500000;
  const activeLender = lenders.find(l => l.id === hoveredLenderId) || lenders[0];

  // Calculations for active lender (standard UGX 500,000 loan)
  const activeInterest = BASE_LOAN * activeLender.interestRate / 100;
  const activeFee = activeLender.feeAmount;
  const markupTotal = activeInterest + activeFee;

  // Markup share percentages (Interest vs Fees)
  const interestMarkupPct = markupTotal > 0 ? (activeInterest / markupTotal) * 100 : 0;
  const feeMarkupPct = markupTotal > 0 ? (activeFee / markupTotal) * 100 : 0;

  // Line Chart Cost Curves calculations (UGX 100k to UGX 1M)
  const linePoints = (lenderId) => {
    const lender = lenders.find(l => l.id === lenderId);
    const amounts = [100000, 300000, 500000, 700000, 900000];
    
    return amounts.map((amt, idx) => {
      const interest = amt * lender.interestRate / 100;
      const totalCost = interest + lender.feeAmount;
      
      const x = 55 + (idx * 85);
      const maxCost = 280000;
      const y = 140 - ((totalCost / maxCost) * 105);
      return `${x},${y}`;
    }).join(' ');
  };

  const handleCardMouseEnter = (lenderId) => {
    setAutoCycle(false); // Pause autoplay
    setHoveredLenderId(lenderId);
  };

  const handleCardMouseLeave = () => {
    setAutoCycle(true); // Resume autoplay
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Top Section: 3-column layout (Doughnut Chart, Progress Bars, Lender Ratings) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1 (Left): Doughnut Chart */}
        <Card className="bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          {autoCycle && (
            <div className="absolute top-3 right-3 text-[8px] text-teal-400 font-bold bg-teal-955/50 border border-teal-900/50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
              </span>
              Auto Cycling
            </div>
          )}
          <CardHeader className="border-b border-slate-850 py-3 px-5">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <PieChart className="h-3.5 w-3.5 text-teal-400" />
              Markup Cost Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex items-center justify-between gap-4 flex-grow">
            {/* CSS Conic-Gradient Doughnut Chart - Fixed dimensions to prevent squishing */}
            <div 
              className="rounded-full flex items-center justify-center shrink-0 shadow-lg transition-all duration-500"
              style={{
                width: '76px',
                height: '76px',
                background: `conic-gradient(#d97706 0% ${interestMarkupPct}%, #e11d48 ${interestMarkupPct}% 100%)`
              }}
            >
              <div className="w-14 h-14 bg-slate-950 rounded-full flex flex-col items-center justify-center text-center p-1">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight block">
                  {activeLender.shortName.split(' ')[0]}
                </span>
                <span className="text-[9px] font-extrabold text-slate-205 mt-0.5">
                  UGX {markupTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Legend details */}
            <div className="flex-grow space-y-1.5 text-[10px] w-full">
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Interest:
                </span>
                <span className="font-semibold text-slate-300">UGX {activeInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Fees:
                </span>
                <span className="font-semibold text-slate-300">UGX {activeFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-900 pt-1 flex justify-between text-[9px] text-slate-500 font-bold">
                <span>Total Cost:</span>
                <span className="text-slate-300">UGX {markupTotal.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 (Center): Cost Markup Progress Bars */}
        <Card className="bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <CardHeader className="border-b border-slate-850 py-3 px-5">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BarChart2 className="h-3.5 w-3.5 text-teal-400" />
              Lender Markup Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 flex-grow flex flex-col justify-center">
            {lenders.map((lender) => {
              const totalCost = (BASE_LOAN * lender.interestRate / 100) + lender.feeAmount;
              const markupPct = (totalCost / BASE_LOAN) * 100;
              
              let barColor = 'bg-emerald-500';
              if (markupPct > 15 && markupPct <= 25) barColor = 'bg-amber-500';
              if (markupPct > 25) barColor = 'bg-rose-500';

              return (
                <div key={lender.id} className="space-y-0.5">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="font-semibold text-slate-350">{lender.shortName}</span>
                    <span className="text-slate-500">
                      UGX {totalCost.toLocaleString()} ({markupPct.toFixed(0)}%)
                    </span>
                  </div>
                  {/* Made progress track thicker and removed padding to let the inner bar render fully */}
                  <div className="w-full h-2.5 bg-slate-950 rounded-full border border-slate-850 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                      style={{ width: `${(markupPct / 35) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Card 3 (Right): Ratings of Lenders */}
        <Card className="bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <CardHeader className="border-b border-slate-850 py-3 px-5">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-550 shrink-0" />
              Lender Trust Ratings (0-5.0)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 flex-grow flex flex-col justify-center">
            {lenders.map((lender) => {
              const ratingPct = (lender.trustScore / 5.0) * 100;
              
              let ratingColor = 'bg-amber-500';
              if (lender.trustScore >= 4.5) ratingColor = 'bg-emerald-500';
              if (lender.trustScore < 4.0) ratingColor = 'bg-amber-600';

              return (
                <div key={lender.id} className="space-y-0.5">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="font-semibold text-slate-350">{lender.shortName}</span>
                    <span className="text-slate-500 font-bold flex items-center gap-0.5">
                      {lender.trustScore} ★
                    </span>
                  </div>
                  {/* Thicker progress tracks for trust ratings */}
                  <div className="w-full h-2.5 bg-slate-950 rounded-full border border-slate-850 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${ratingColor}`}
                      style={{ width: `${ratingPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

      </div>

      {/* 2. Bottom Section: Lenders Catalog (Left) & Curve Line Graph (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Lenders Catalog */}
        <div className="lg:col-span-7 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Lender Verification Catalog
          </h3>

          <div className="space-y-3">
            {lenders.map((lender) => (
              <div 
                key={lender.id}
                onMouseEnter={() => handleCardMouseEnter(lender.id)}
                onMouseLeave={handleCardMouseLeave}
                className={`p-4 rounded-xl border transition-all duration-300 relative group cursor-pointer ${
                  hoveredLenderId === lender.id 
                    ? 'bg-slate-900/60 border-teal-500/50 shadow-md shadow-teal-950/20 scale-[1.005]' 
                    : 'bg-slate-900/20 border-slate-900 hover:border-slate-850 hover:bg-slate-900/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border shrink-0 transition-colors ${
                      hoveredLenderId === lender.id ? 'bg-teal-955 text-teal-455 border-teal-800/40' : 'bg-slate-950 text-slate-500 border-slate-900'
                    }`}>
                      <Landmark className="h-4.5 w-4.5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-200">{lender.name}</h4>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${lender.color}`}>
                          {lender.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                        <span>{lender.category}</span>
                        <span>•</span>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-550 shrink-0" />
                          <span className="text-slate-350">{lender.trustScore} Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => onSelect(lender)}
                    className="bg-teal-955 hover:bg-teal-900 text-teal-405 border border-teal-800/50 text-[10px] uppercase font-bold py-1 px-2.5 rounded-lg flex items-center gap-0.5 shrink-0"
                  >
                    Select Offer
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-950/60 flex justify-between text-[11px] text-slate-400">
                  <span>Interest: <strong className="text-slate-300">{lender.interestRate}%</strong></span>
                  <span>Processing Fee: <strong className="text-slate-300">UGX {lender.feeAmount.toLocaleString()}</strong></span>
                  <span>Default Term: <strong className="text-slate-300">{lender.repaymentPeriodDays} days</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Cost Scale Curves (SVG Line Chart) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Financing Scale Curves
          </h3>

          <Card className="bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md">
            <CardContent className="p-5 space-y-4">
              <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">Total Repayment Trends</span>
              
              <div className="w-full relative">
                <svg viewBox="0 0 450 160" className="w-full overflow-visible">
                  {/* Grid lines */}
                  <line x1="50" y1="130" x2="410" y2="130" stroke="#1e293b" strokeWidth="1" />
                  <line x1="50" y1="95" x2="410" y2="95" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="50" y1="60" x2="410" y2="60" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="50" y1="25" x2="410" y2="25" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Y Axis labels */}
                  <text x="40" y="133" fill="#64748b" fontSize="8" textAnchor="end">UGX 0</text>
                  <text x="40" y="98" fill="#64748b" fontSize="8" textAnchor="end">90K</text>
                  <text x="40" y="63" fill="#64748b" fontSize="8" textAnchor="end">180K</text>
                  <text x="40" y="28" fill="#64748b" fontSize="8" textAnchor="end">270K</text>

                  {/* X Axis labels */}
                  <text x="55" y="145" fill="#64748b" fontSize="8" textAnchor="middle">100K</text>
                  <text x="140" y="145" fill="#64748b" fontSize="8" textAnchor="middle">300K</text>
                  <text x="225" y="145" fill="#64748b" fontSize="8" textAnchor="middle">500K</text>
                  <text x="310" y="145" fill="#64748b" fontSize="8" textAnchor="middle">700K</text>
                  <text x="395" y="145" fill="#64748b" fontSize="8" textAnchor="middle">900K</text>

                  {/* Lines */}
                  <polyline fill="none" stroke="#10b981" strokeWidth="2" points={linePoints('branch')} />
                  <polyline fill="none" stroke="#14b8a6" strokeWidth="2" points={linePoints('tala')} />
                  <polyline fill="none" stroke="#f43f5e" strokeWidth="2" points={linePoints('mkopa')} />
                </svg>
              </div>

              {/* Legends */}
              <div className="flex justify-center items-center gap-4 text-[9px] text-slate-500 font-semibold pt-2">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-emerald-500 inline-block"></span>
                  <span>Branch (12%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-teal-500 inline-block"></span>
                  <span>Tala (15%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-rose-500 inline-block"></span>
                  <span>M-Kopa (25%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
