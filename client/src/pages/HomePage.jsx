import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Info, Sparkles, TrendingUp, HelpCircle, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function HomePage({ onStart }) {
  // Mock interactive preview slider state for immediate wow-factor
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(15);
  const [termDays, setTermDays] = useState(30);
  const [income, setIncome] = useState(1200000);

  // Instant client-side calculations matching the server formulas
  const totalRepayment = loanAmount + (loanAmount * interestRate / 100);
  const costPct = ((totalRepayment - loanAmount) / loanAmount) * 100;
  const newLoanMonthlyCost = totalRepayment / (termDays / 30);
  const debtRatio = (newLoanMonthlyCost / income) * 100;

  // Determine visual indicators based on ratios
  let riskStatus = {
    label: 'Safe to Consider',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    progressBg: 'bg-emerald-500',
    icon: CheckCircle,
    desc: 'Repayments fit well within standard financial safety guidelines.'
  };
  if (debtRatio > 40 && debtRatio <= 60) {
    riskStatus = {
      label: 'Borrow with Caution',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      progressBg: 'bg-amber-500',
      icon: AlertTriangle,
      desc: 'Monthly cost creates moderate pressure. Minimize other expenses.'
    };
  } else if (debtRatio > 60) {
    riskStatus = {
      label: 'High Financial Risk',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30',
      progressBg: 'bg-rose-500',
      icon: ShieldAlert,
      desc: 'Repayment eats a critical portion of your income. Highly likely to cause debt stress.'
    };
  }

  const RiskIcon = riskStatus.icon;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center">
      
      {/* Badge Alert */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-800/80 text-xs text-teal-400 font-medium mb-6 animate-fadeIn">
        <Sparkles className="h-3.5 w-3.5" />
        Smarter Borrowing Choices Start Here
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mb-12 lg:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Demystify Digital Loans{' '}
          <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Before You Accept
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-400 leading-relaxed">
          Credi-Check is a smart, client-focused borrower protection layer. It scans interest terms, 
          calculates your true debt burden, and highlights potential risks before you commit.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onStart} 
            size="lg" 
            className="bg-teal-650 hover:bg-teal-700 text-white font-semibold text-base py-6 px-8 rounded-xl shadow-lg shadow-teal-900/30 border border-teal-500/30 hover:scale-[1.02] transition-all"
          >
            Launch Free Assessment
          </Button>
        </div>
      </div>

      {/* Interactive Visualizer Playground */}
      <div className="w-full max-w-5xl bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 md:p-8 backdrop-blur-sm mb-16 shadow-2xl relative overflow-hidden">
        {/* Subtle grid accent background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#0f766e_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Sliders Input Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
                Interactive Affordability Visualizer
              </h2>
              <p className="text-xs text-slate-400">
                Drag the sliders to simulate a loan and visualize key burden metrics instantly.
              </p>
            </div>

            <div className="space-y-4">
              {/* Slider 1: Loan Amount */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Loan Offer Amount</span>
                  <span className="text-teal-400 font-bold">UGX {loanAmount.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="100000" 
                  max="2000000" 
                  step="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-855 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Interest Rate</span>
                  <span className="text-teal-400 font-bold">{interestRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-855 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Slider 3: Term */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Repayment Term</span>
                  <span className="text-teal-400 font-bold">{termDays} Days</span>
                </div>
                <input 
                  type="range" 
                  min="7" 
                  max="90" 
                  step="1"
                  value={termDays}
                  onChange={(e) => setTermDays(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-855 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Slider 4: Income */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Your Monthly Income</span>
                  <span className="text-teal-400 font-bold">UGX {income.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="200000" 
                  max="5000000" 
                  step="50000"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-855 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Results Visual Display */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
            
            {/* Risk Indicator Header */}
            <div className={`p-4 rounded-xl border ${riskStatus.bg} flex items-start gap-3 transition-colors duration-300`}>
              <RiskIcon className={`h-5 w-5 ${riskStatus.color} shrink-0 mt-0.5`} />
              <div>
                <div className={`text-sm font-bold ${riskStatus.color}`}>
                  {riskStatus.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-normal">
                  {riskStatus.desc}
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="my-6 space-y-4">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                <span className="text-xs text-slate-400">Total Repayment:</span>
                <span className="text-sm font-semibold text-slate-200">UGX {totalRepayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                <span className="text-xs text-slate-400">Borrowing Extra Cost:</span>
                <span className="text-sm font-semibold text-slate-200">+{costPct.toFixed(0)}%</span>
              </div>
              
              {/* Circular or Bar Progress Indicator */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Debt Burden Ratio:</span>
                  <span className="font-semibold text-slate-250">{debtRatio.toFixed(0)}% of income</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${riskStatus.progressBg}`} 
                    style={{ width: `${Math.min(debtRatio, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  (Safety limit recommends keeping monthly repayments below 40% of total income.)
                </p>
              </div>
            </div>

            {/* CTA action link */}
            <button 
              onClick={onStart}
              className="w-full text-xs font-semibold py-2.5 px-4 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/60 hover:bg-teal-900/60 transition-colors"
            >
              Analyze Your Exact Offer Terms
            </button>
          </div>
        </div>
      </div>

      {/* Core Protection Pillars */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Pillar 1: Transparency */}
        <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-3 hover:border-slate-850 hover:bg-slate-900/30 transition-all duration-300">
          <div className="h-10 w-10 rounded-xl bg-teal-950/60 border border-teal-800/40 flex items-center justify-center">
            <Info className="h-5 w-5 text-teal-400" />
          </div>
          <h3 className="font-bold text-sm text-slate-200">1. Transparency</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Exposes hidden interest tricks, administrative fees, and presents clear plain-language costs.
          </p>
        </div>

        {/* Pillar 2: Affirmative Consent */}
        <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-3 hover:border-slate-850 hover:bg-slate-900/30 transition-all duration-300">
          <div className="h-10 w-10 rounded-xl bg-teal-950/60 border border-teal-800/40 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-teal-400" />
          </div>
          <h3 className="font-bold text-sm text-slate-200">2. Active Consent</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Empowers borrowers with an interactive opt-in list confirming full understanding before signatures.
          </p>
        </div>

        {/* Pillar 3: Affordability */}
        <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-3 hover:border-slate-850 hover:bg-slate-900/30 transition-all duration-300">
          <div className="h-10 w-10 rounded-xl bg-teal-950/60 border border-teal-800/40 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-teal-400" />
          </div>
          <h3 className="font-bold text-sm text-slate-200">3. Local Suitability</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Performs local calculations based strictly on your numbers. No external databases checked, respecting your privacy.
          </p>
        </div>

        {/* Pillar 4: Early Warnings */}
        <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-3 hover:border-slate-850 hover:bg-slate-900/30 transition-all duration-300">
          <div className="h-10 w-10 rounded-xl bg-teal-950/60 border border-teal-800/40 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-teal-400" />
          </div>
          <h3 className="font-bold text-sm text-slate-200">4. Pattern Alerts</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Identifies growing borrowing frequency and debt build-up early, preventing the rollover debt cycle.
          </p>
        </div>

      </div>

    </div>
  );
}
