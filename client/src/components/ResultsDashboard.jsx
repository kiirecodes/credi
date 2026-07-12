import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lightbulb, RotateCcw, Printer, Info, HelpCircle, AlertTriangle, ShieldCheck, ArrowRight, ShieldAlert, Sparkles, TrendingDown } from 'lucide-react';
import RiskBadge from './RiskBadge';
import ReasoningList from './ReasoningList';
import PatternWarningBanner from './PatternWarningBanner';
import BorrowingPatternPanel from './BorrowingPatternPanel';

export default function ResultsDashboard({ assessment, userId }) {
  // Re-run calculations locally to show detailed monthly breakdown
  const { loanAmount, feeAmount, interestRate, repaymentPeriodDays, monthlyIncome, existingDebtRepayment } = assessment;

  const newLoanMonthlyCost = repaymentPeriodDays > 0 ? (assessment.totalRepayment / (repaymentPeriodDays / 30)) : 0;
  const netRemaining = monthlyIncome - (existingDebtRepayment + newLoanMonthlyCost);

  // Compute percentages
  const preDebtPct = monthlyIncome > 0 ? (existingDebtRepayment / monthlyIncome) * 100 : 0;
  const newDebtPct = monthlyIncome > 0 ? (newLoanMonthlyCost / monthlyIncome) * 100 : 0;
  const netRemainingPct = Math.max(0, 100 - (preDebtPct + newDebtPct));

  // Determine risk presentation details
  let bannerStyle = {
    bg: 'bg-emerald-950/20 border-emerald-900/40',
    text: 'text-emerald-400',
    icon: ShieldCheck,
    title: 'Affordable Assessment Approved'
  };
  if (assessment.riskLevel === 'caution') {
    bannerStyle = {
      bg: 'bg-amber-950/20 border-amber-900/40',
      text: 'text-amber-400',
      icon: AlertTriangle,
      title: 'Elevated Affordability Warning'
    };
  } else if (assessment.riskLevel === 'high_risk') {
    bannerStyle = {
      bg: 'bg-rose-955/20 border-rose-900/40',
      text: 'text-rose-450',
      icon: ShieldAlert,
      title: 'High Financial Risk Indicated'
    };
  }

  const HeaderIcon = bannerStyle.icon;

  const handlePrint = () => {
    window.print();
  };

  const handleReload = () => {
    // Reload page to reset form state
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-slideUp print:bg-white print:text-black">
      
      {/* Risk Alert Header Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${bannerStyle.bg}`}>
        <div className="flex items-center gap-3">
          <HeaderIcon className={`h-6 w-6 ${bannerStyle.text} shrink-0`} />
          <div>
            <h3 className={`text-sm font-bold ${bannerStyle.text}`}>
              {bannerStyle.title}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 print:text-slate-600">
              Unique Assessment Code: <span className="font-mono text-slate-300 print:text-slate-800">{assessment.assessmentId}</span>
            </p>
          </div>
        </div>
        <RiskBadge riskLevel={assessment.riskLevel} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Cost Summary & Breakdown Charts */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Stat Cards Grid */}
          <Card className="bg-slate-900/40 border-slate-800/80 shadow-xl backdrop-blur-md">
            <CardHeader className="border-b border-slate-850 py-3.5 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
                contractual Terms Summary
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Repayment</p>
                  <p className="text-base font-bold text-slate-200">
                    UGX {assessment.totalRepayment.toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Markup Cost</p>
                  <p className="text-base font-bold text-teal-400">
                    +{assessment.costOfBorrowingPct.toFixed(0)}%
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Monthly Burden</p>
                  <p className="text-base font-bold text-slate-200">
                    {assessment.debtBurdenRatio.toFixed(0)}%
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mt-5 p-4 bg-slate-950/40 border border-slate-900 rounded-xl">
                <strong className="text-teal-400">Audit Insight:</strong> {assessment.plainLanguageSummary}
              </p>
            </CardContent>
          </Card>

          {/* Visual Income Breakdown chart list */}
          <Card className="bg-slate-900/40 border-slate-800/80 shadow-xl backdrop-blur-md">
            <CardHeader className="border-b border-slate-850 py-3.5 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4 text-teal-400" />
                Monthly Cash Flow Allocation Chart
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-4">
                {/* Visual Stacked bar */}
                <div className="w-full h-4 bg-slate-950 border border-slate-850 rounded-full overflow-hidden p-0.5 flex">
                  <div 
                    className="h-full bg-slate-700 rounded-l-full transition-all duration-300"
                    style={{ width: `${preDebtPct}%` }}
                    title={`Existing Debt: ${preDebtPct.toFixed(0)}%`}
                  />
                  <div 
                    className="h-full bg-teal-650 transition-all duration-300"
                    style={{ width: `${newDebtPct}%` }}
                    title={`New Loan: ${newDebtPct.toFixed(0)}%`}
                  />
                  <div 
                    className="h-full bg-emerald-500 rounded-r-full transition-all duration-300"
                    style={{ width: `${netRemainingPct}%` }}
                    title={`Net Remaining: ${netRemainingPct.toFixed(0)}%`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="space-y-0.5 text-left border-l-2 border-slate-600 pl-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Prior Debt</span>
                    <p className="text-xs font-semibold text-slate-300">{preDebtPct.toFixed(0)}% ({existingDebtRepayment.toLocaleString()} UGX)</p>
                  </div>
                  <div className="space-y-0.5 text-left border-l-2 border-teal-600 pl-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">New Loan</span>
                    <p className="text-xs font-semibold text-slate-300">{newDebtPct.toFixed(0)}% ({Math.round(newLoanMonthlyCost).toLocaleString()} UGX)</p>
                  </div>
                  <div className="space-y-0.5 text-left border-l-2 border-emerald-500 pl-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Remaining</span>
                    <p className="text-xs font-semibold text-slate-300">{netRemainingPct.toFixed(0)}% ({Math.round(netRemaining).toLocaleString()} UGX)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Reasoning, Advice alerts, Warnings, and actions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Assessment Reasoning cards */}
          <Card className="bg-slate-900/40 border-slate-800/80 shadow-xl backdrop-blur-md">
            <CardHeader className="border-b border-slate-850 py-3.5 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Affordability Factors Checked
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ReasoningList reasoning={assessment.reasoning} />
            </CardContent>
          </Card>

          {/* Core recommendation box */}
          <Alert className="bg-teal-950/20 border-teal-800/40 text-slate-100 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <Lightbulb className="h-20 w-20 text-teal-400" />
            </div>
            <div className="flex gap-3 relative z-10">
              <Lightbulb className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs uppercase font-bold text-teal-400 tracking-wider">Risk Mitigation Recommendation</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {assessment.recommendationText}
                </p>
              </div>
            </div>
          </Alert>

          {/* Pattern Warnings */}
          <PatternWarningBanner patternWarning={assessment.patternWarning} />

          {/* Borrowing History Pattern Panel */}
          {userId && <BorrowingPatternPanel userId={userId} />}

          {/* Dashboard Action Toolbar */}
          <div className="flex gap-4 print:hidden">
            <Button
              onClick={handleReload}
              variant="outline"
              className="flex-1 bg-slate-950 border-slate-850 text-slate-300 hover:text-white hover:bg-slate-900 py-5 rounded-xl text-xs font-semibold"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New Safety Audit
            </Button>
            <Button
              onClick={handlePrint}
              className="flex-1 bg-teal-650 hover:bg-teal-700 text-white py-5 rounded-xl text-xs font-semibold"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Audit Document
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
}
