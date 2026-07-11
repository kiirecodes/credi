import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Landmark, Star, ShieldCheck, TrendingDown, ChevronRight, BarChart2 } from 'lucide-react';

const lenders = [
  {
    id: 'tala',
    name: 'Tala Mobile Loan',
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
    interestRate: 12,
    feeAmount: 15000,
    repaymentPeriodDays: 30,
    trustScore: 4.6,
    category: 'Fintech Mobile app',
    badge: 'Lower Mobile Rate',
    color: 'text-emerald-400 border-emerald-800/40 bg-emerald-950/20'
  },
  {
    id: 'mkopa',
    name: 'M-Kopa Cash',
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
  // Chart calculation baseline: Standard UGX 500,000 loan
  const BASE_LOAN = 500000;

  return (
    <div className="space-y-6">
      
      {/* Visual Cost Comparison Chart Card */}
      <Card className="bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md">
        <CardHeader className="border-b border-slate-850 py-3.5 px-6">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-teal-400" />
            True Cost of Borrowing Markup Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-xs text-slate-400 leading-normal mb-5">
            Exposing total financing charges (Interest + Processing Fees) calculated for a standard loan of <strong className="text-slate-200">UGX 500,000</strong>:
          </p>

          {/* CSS Horizontal Bar Chart */}
          <div className="space-y-4">
            {lenders.map((lender) => {
              const totalCost = (BASE_LOAN * lender.interestRate / 100) + lender.feeAmount;
              const markupPct = (totalCost / BASE_LOAN) * 100;
              
              // Colors based on markup percentage
              let barColor = 'bg-emerald-500';
              if (markupPct > 15 && markupPct <= 25) barColor = 'bg-amber-500';
              if (markupPct > 25) barColor = 'bg-rose-500';

              return (
                <div key={lender.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">{lender.name}</span>
                    <span className="text-slate-400">
                      Markup Cost: <strong className="text-slate-200">UGX {totalCost.toLocaleString()}</strong> ({markupPct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-850 overflow-hidden p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                      style={{ width: `${(markupPct / 35) * 100}%` }} // Normalizing against max 35%
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-500">
            <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> Lower Cost
            <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-sm ml-2"></span> Moderate Cost
            <span className="inline-block w-2.5 h-2.5 bg-rose-500 rounded-sm ml-2"></span> High Cost
          </div>
        </CardContent>
      </Card>

      {/* Lenders List Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Select a Lender Offer to Audit
        </h3>

        {lenders.map((lender) => (
          <div 
            key={lender.id}
            className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl hover:border-slate-850 hover:bg-slate-900/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-850 text-teal-400 shrink-0">
                <Landmark className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-sm text-slate-200">{lender.name}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${lender.color}`}>
                    {lender.badge}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                  <span>{lender.category}</span>
                  <span>•</span>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                    <span className="font-semibold text-slate-350">{lender.trustScore}</span>
                    <span>Trust score</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Terms Summary Column */}
            <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-slate-900/80 pt-3 sm:pt-0 sm:border-0">
              <div className="text-left sm:text-right space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Standard Terms</span>
                <p className="text-xs text-slate-300 font-semibold">
                  {lender.interestRate}% Interest | UGX {lender.feeAmount.toLocaleString()} Fees
                </p>
              </div>

              <Button 
                onClick={() => onSelect(lender)}
                className="bg-teal-950 hover:bg-teal-900 text-teal-400 border border-teal-800/40 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 shrink-0"
              >
                Select Offer
                <ChevronRight className="h-4.5 w-4.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
