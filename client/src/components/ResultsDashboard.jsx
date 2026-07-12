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

  // Determine risk presentation details (Premium Light Theme alerts)
  let bannerStyle = {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm',
    text: 'text-emerald-700',
    icon: ShieldCheck,
    title: 'Affordable Assessment Approved'
  };
  if (assessment.riskLevel === 'caution') {
    bannerStyle = {
      bg: 'bg-amber-50 border-amber-205 text-amber-700 shadow-sm',
      text: 'text-amber-700',
      icon: AlertTriangle,
      title: 'Elevated Affordability Warning'
    };
  } else if (assessment.riskLevel === 'high_risk') {
    bannerStyle = {
      bg: 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm',
      text: 'text-rose-700',
      icon: ShieldAlert,
      title: 'High Financial Risk Indicated'
    };
  }

  const HeaderIcon = bannerStyle.icon;

  const handlePrint = () => {
    window.print();
  };

  const handleReload = () => {
    localStorage.removeItem('credicheck_assessmentId');
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
            <p className="text-[11px] text-slate-500 mt-0.5 print:text-slate-650">
              Check Code: <span className="font-mono font-bold text-slate-700 print:text-slate-800">{assessment.assessmentId}</span>
            </p>
          </div>
        </div>
        <RiskBadge riskLevel={assessment.riskLevel} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Cost Summary & Breakdown Charts */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Stat Cards Grid */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 py-3.5 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Loan Cost Summary
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Repayment</p>
                  <p className="text-base font-bold text-slate-900">
                    UGX {assessment.totalRepayment.toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Cost of Borrowing</p>
                  <p className="text-base font-bold text-teal-655">
                    +{assessment.costOfBorrowingPct.toFixed(0)}%
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Monthly Debt Ratio</p>
                  <p className="text-base font-bold text-slate-900">
                    {assessment.debtBurdenRatio.toFixed(0)}%
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-teal-655">Summary:</strong> {assessment.plainLanguageSummary}
              </p>
            </CardContent>
          </Card>

          {/* Visual Income Breakdown chart list */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 py-3.5 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4 text-teal-600" />
                Where Does Your Monthly Income Go?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-4">
                {/* Visual Stacked bar */}
                <div className="w-full h-4 bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5 flex">
                  <div 
                    className="h-full bg-slate-400 rounded-l-full transition-all duration-300"
                    style={{ width: `${preDebtPct}%` }}
                    title={`Existing Debt: ${preDebtPct.toFixed(0)}%`}
                  />
                  <div 
                    className="h-full bg-teal-600 transition-all duration-300"
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
                  <div className="space-y-0.5 text-left border-l-2 border-slate-400 pl-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Existing Debt Payments</span>
                    <p className="text-xs font-semibold text-slate-800">{preDebtPct.toFixed(0)}% ({existingDebtRepayment.toLocaleString()} UGX)</p>
                  </div>
                  <div className="space-y-0.5 text-left border-l-2 border-teal-500 pl-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">New Loan Payment</span>
                    <p className="text-xs font-semibold text-slate-800">{newDebtPct.toFixed(0)}% ({Math.round(newLoanMonthlyCost).toLocaleString()} UGX)</p>
                  </div>
                  <div className="space-y-0.5 text-left border-l-2 border-emerald-500 pl-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Remaining Monthly Income</span>
                    <p className="text-xs font-semibold text-slate-800">{netRemainingPct.toFixed(0)}% ({Math.round(netRemaining).toLocaleString()} UGX)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Reasoning, Advice alerts, Warnings, and actions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Assessment Reasoning cards */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 py-3.5 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Affordability Audit Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ReasoningList reasoning={assessment.reasoning} />
            </CardContent>
          </Card>

          {/* Core recommendation box */}
          <Alert className="bg-teal-50 border-teal-200/80 text-slate-900 p-5 rounded-2xl relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-2 opacity-2">
              <Lightbulb className="h-20 w-20 text-teal-600" />
            </div>
            <div className="flex gap-3 relative z-10">
              <Lightbulb className="h-5 w-5 text-teal-655 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs uppercase font-bold text-teal-700 tracking-wider">Mitigation Recommendation</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
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
              className="flex-1 bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50/50 py-5 rounded-xl text-xs font-semibold shadow-sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New Safety Audit
            </Button>
            <Button
              onClick={handlePrint}
              className="flex-1 bg-teal-650 hover:bg-teal-700 text-white py-5 rounded-xl text-xs font-semibold shadow-sm border-0"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Audit Document
            </Button>
          </div>

        </div>

      </div>

      {/* Sensitization & Educational Panel */}
      <Card className="bg-white border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <ShieldCheck className="h-4.5 w-4.5 text-teal-600" />
          Borrower Protection & Rights (UMRA Regulations)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <h4 className="font-bold text-slate-900">Your Legal Rights in Uganda:</h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed">
              <li>Lenders <strong>must</strong> disclose all baseline interest fees in plain language before signing.</li>
              <li>Lenders are legally barred from contacting people in your contact list or scraping photos for debt collection.</li>
              <li>You have the right to request a formal repayment contract schedule at any time.</li>
            </ul>
          </div>
          <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <h4 className="font-bold text-slate-900">Anti-Debt Trap Guidelines:</h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed">
              <li><strong>Avoid Rollovers</strong>: Never borrow from one digital app to pay off another active loan.</li>
              <li><strong>Emergency Focus</strong>: Limit mobile credit strictly to cash-generating assets or critical emergencies.</li>
              <li><strong>Report Predatory Actions</strong>: Report harassment, hidden interest charges, or unauthorized disbursements directly to UMRA.</li>
            </ul>
          </div>
        </div>
      </Card>

    </div>
  );
}
