import { useState, useEffect } from 'react';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, Sparkles, Coins, Landmark, Calendar, Percent, ShieldCheck, CheckCircle2, ShieldAlert, Sparkle, HelpCircle, Shield, AlertTriangle } from 'lucide-react';
import LoanForm from '@/components/LoanForm';
import ConsentStep from '@/components/ConsentStep';
import ResultsDashboard from '@/components/ResultsDashboard';
import LenderSelection from '@/components/LenderSelection';
import { analyzeLoan, getDemoUser, getLoanReport } from '@/services/api';

const steps = [
  { key: 'select-provider', label: 'Select Lender', number: 1 },
  { key: 'form', label: 'Declare Terms', number: 2 },
  { key: 'consent', label: 'Verify Consent', number: 3 },
  { key: 'results', label: 'Safety Report', number: 4 }
];

function ProgressStepper({ currentStep }) {
  const currentIndex = steps.findIndex(s => s.key === currentStep);
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-2 mb-6 shadow-sm">
      {steps.map((s, index) => {
        const isActive = s.key === currentStep;
        const isCompleted = currentIndex > index;
        return (
          <div key={s.key} className="flex items-center flex-grow last:flex-grow-0">
            <div className="flex items-center gap-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                isActive 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : isCompleted 
                    ? 'bg-teal-50 text-teal-600 border border-teal-200/80' 
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>
                {isCompleted ? '✓' : s.number}
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold hidden sm:inline ${
                isActive ? 'text-teal-600' : isCompleted ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-[1px] flex-grow mx-4 hidden sm:block ${
                currentIndex > index ? 'bg-teal-400/60' : 'bg-slate-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AssessmentFlowPage() {
  const [step, setStep] = useState('select-provider');
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [selectedLender, setSelectedLender] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadDemoUser = async () => {
      try {
        const { userId: id } = await getDemoUser();
        setUserId(id);

        const storedId = localStorage.getItem('credicheck_assessmentId');
        if (storedId) {
          const report = await getLoanReport(storedId);
          setAssessment(report);
          setStep('results');
          localStorage.removeItem('credicheck_assessmentId');
        }
      } catch (err) {
        setError('Unable to connect to the server. Please ensure the backend is running.');
      }
    };
    loadDemoUser();
  }, []);
  
  // Real-time form values state for live updates in the right-hand panel
  const [liveValues, setLiveValues] = useState({
    loanAmount: 0,
    feeAmount: 0,
    interestRate: 0,
    repaymentPeriodDays: 30,
    monthlyIncome: 0,
    existingDebtRepayment: 0,
  });

  const handleSelectLender = (lender) => {
    setSelectedLender(lender);
    // Auto-fill standard parameters of the lender
    setLiveValues((prev) => ({
      ...prev,
      interestRate: lender.interestRate,
      feeAmount: lender.feeAmount,
      repaymentPeriodDays: lender.repaymentPeriodDays,
    }));
    setStep('form');
  };

  const handleSubmit = (values) => {
    setError(null);
    try {
      // Extract numerical values
      const loanAmount = Number(values.loanAmount) || 0;
      const feeAmount = Number(values.feeAmount) || 0;
      const interestRate = Number(values.interestRate) || 0;
      const repaymentPeriodDays = Number(values.repaymentPeriodDays) || 30;
      const monthlyIncome = Number(values.monthlyIncome) || 0;
      const existingDebtRepayment = Number(values.existingDebtRepayment) || 0;

      // Duplicate Node/Express server calculations locally
      const totalRepayment = loanAmount + feeAmount + (loanAmount * interestRate / 100);
      const costOfBorrowingPct = loanAmount > 0 ? ((totalRepayment - loanAmount) / loanAmount) * 100 : 0;
      
      const newLoanMonthlyCost = repaymentPeriodDays > 0 ? (totalRepayment / (repaymentPeriodDays / 30)) : 0;
      const debtBurdenRatio = monthlyIncome > 0 ? ((existingDebtRepayment + newLoanMonthlyCost) / monthlyIncome) * 100 : 0;
      
      // Classify risk level
      let riskLevel = 'high_risk';
      if (debtBurdenRatio <= 40) riskLevel = 'safe';
      else if (debtBurdenRatio <= 60) riskLevel = 'caution';

      // Build recommendation
      const safeMonthlyCapacity = monthlyIncome * 0.4 - existingDebtRepayment;
      let recommendationText = `We advise you not to take this loan. It takes up too much of your monthly budget. A safer maximum amount you can afford to pay back each month is UGX ${Math.max(safeMonthlyCapacity, 0).toLocaleString()}.`;
      if (riskLevel === 'safe') {
        recommendationText = 'This loan fits within your normal monthly budget based on what you earn and what you owe.';
      } else if (riskLevel === 'caution') {
        recommendationText = 'Be careful. This loan will make your monthly budget very tight. If possible, borrow a smaller amount or ask for a longer payment period to reduce the monthly size.';
      }

      // Build reasoning checks list
      const reasoning = [];
      reasoning.push(`Paying back this loan takes ${debtBurdenRatio.toFixed(0)}% of your monthly earnings.`);
      if (costOfBorrowingPct > 10) reasoning.push('The lender is charging you more than 10% extra on top of what you borrowed (High markup).');
      if (existingDebtRepayment > 0) reasoning.push('You are already paying off another active loan right now, which adds extra pressure.');

      // Create summaries
      const plainLanguageSummary = `You are borrowing UGX ${loanAmount.toLocaleString()} but will repay UGX ${totalRepayment.toLocaleString()} within ${repaymentPeriodDays} days.`;

      // Package full local assessment output
      const result = {
        assessmentId: 'mock-local-id-' + Math.random().toString(36).substr(2, 9),
        totalRepayment,
        costOfBorrowingPct,
        debtBurdenRatio,
        riskLevel,
        plainLanguageSummary,
        reasoning,
        recommendationText,
        patternWarning: null,
      };

      setAssessment(result);
      setStep('consent');
    } catch (err) {
      setError('Something went wrong during local calculations.');
    }
  };

  // Instant client-side calculations for the live stats panel
  const { loanAmount, feeAmount, interestRate, repaymentPeriodDays, monthlyIncome, existingDebtRepayment } = liveValues;
  
  const hasData = loanAmount > 0 || monthlyIncome > 0;
  
  const totalRepayment = loanAmount + feeAmount + (loanAmount * interestRate / 100);
  const costPct = loanAmount > 0 ? ((totalRepayment - loanAmount) / loanAmount) * 100 : 0;
  const newLoanMonthlyCost = repaymentPeriodDays > 0 ? (totalRepayment / (repaymentPeriodDays / 30)) : 0;
  
  const totalMonthlyCommitment = existingDebtRepayment + newLoanMonthlyCost;
  const debtRatio = monthlyIncome > 0 ? (totalMonthlyCommitment / monthlyIncome) * 100 : 0;

  // Determine risk profile for real-time visual chart elements (Light Theme colors)
  let liveRisk = {
    label: 'Calculating...',
    color: 'text-slate-500',
    bg: 'bg-slate-100 border border-slate-200',
    barColor: 'bg-slate-400',
    desc: 'Enter numbers to begin protection calculations.'
  };

  if (hasData) {
    if (debtRatio <= 40) {
      liveRisk = {
        label: 'Affordable / Safe Capacity',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50 border border-emerald-200/60 shadow-sm',
        barColor: 'bg-emerald-600',
        desc: 'Repayment is within safe bounds (under 40% of income).'
      };
    } else if (debtRatio <= 60) {
      liveRisk = {
        label: 'Moderate Financial Pressure',
        color: 'text-amber-700',
        bg: 'bg-amber-50 border border-amber-200/60 shadow-sm',
        barColor: 'bg-amber-600',
        desc: 'Repayments are elevated. Ensure you reduce other discretionary spending.'
      };
    } else {
      liveRisk = {
        label: 'Excessive Debt Stress',
        color: 'text-rose-700',
        bg: 'bg-rose-50 border border-rose-200/60 shadow-sm',
        barColor: 'bg-rose-600',
        desc: 'repayment eats too much of your monthly income. High chance of rolling debt cycles.'
      };
    }
  }

  return (
    <div className="space-y-6">
      {/* Title & Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Landmark className="h-6 w-6 text-teal-600" />
            Safety Audit Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Conducting local calculations using the Borrower Affordability framework.
          </p>
        </div>
        
        {step !== 'results' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200/50 text-[10px] font-bold text-teal-700 uppercase tracking-wider shadow-sm">
            <Sparkle className="h-3 w-3 text-teal-600 animate-spin" />
            Live Analysis Active
          </div>
        )}
      </div>

      {/* Progress Stepper Bar */}
      <ProgressStepper currentStep={step} />

      {error && (
        <Alert className="bg-rose-50 border-rose-200 text-rose-800">
          <AlertCircle className="h-4 w-4 text-rose-600" />
          <span className="text-sm">{error}</span>
        </Alert>
      )}

      {/* Grid view selection based on step state */}
      {step === 'select-provider' ? (
        // Full width layout for lender selection
        <div className="animate-fadeIn">
          <LenderSelection onSelect={handleSelectLender} />
        </div>
      ) : step === 'results' && assessment ? (
        // Full width layout for final results
        <div className="animate-fadeIn">
          <ResultsDashboard assessment={{ ...liveValues, ...assessment }} />
        </div>
      ) : (
        // Split view layout for form entry & consent checks
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Hand: Active Input Step */}
          <div className="lg:col-span-7 space-y-6">
            {step === 'form' && (
              <div className="space-y-4">
                {selectedLender && (
                  <div className="p-3 bg-teal-50 border border-teal-200/60 rounded-xl text-xs flex justify-between items-center text-teal-700 shadow-sm animate-fadeIn">
                    <span>Selected Lender: <strong>{selectedLender.name}</strong></span>
                    <button 
                      onClick={() => setStep('select-provider')} 
                      className="underline text-[10px] uppercase font-bold hover:text-teal-600 transition-colors"
                    >
                      Change Lender
                    </button>
                  </div>
                )}
                <LoanForm 
                  onSubmit={handleSubmit} 
                  onValuesChange={(vals) => setLiveValues((prev) => ({ ...prev, ...vals }))}
                  initialValues={liveValues}
                />
              </div>
            )}

            {step === 'consent' && assessment && (
              <ConsentStep
                assessment={{ ...liveValues, ...assessment }}
                onConfirm={() => setStep('results')}
              />
            )}
          </div>

          {/* Right Hand: Real-Time Interactive Analytics & Stats */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Visual Gauge / Status Header */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${liveRisk.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Real-time Affordability
                </span>
                <span className={`text-xs font-bold ${liveRisk.color}`}>
                  {liveRisk.label}
                </span>
              </div>
              
              {/* Progress gauge bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 mb-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${liveRisk.barColor}`} 
                  style={{ width: `${hasData ? Math.min(debtRatio, 100) : 0}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {liveRisk.desc}
              </p>
            </div>

            {/* Live Stats grid */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                Simulated Cost Indicators
              </h3>
              
              {/* Stat 1: Total Repayment */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Coins className="h-4 w-4 text-slate-400" />
                  <span>Total Repayment:</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  UGX {hasData ? totalRepayment.toLocaleString() : '0'}
                </span>
              </div>

              {/* Stat 2: Monthly Cost */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Monthly Cost:</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  UGX {hasData ? Math.round(newLoanMonthlyCost).toLocaleString() : '0'}
                </span>
              </div>

              {/* Stat 3: Markup Percentage */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Percent className="h-4 w-4 text-slate-400" />
                  <span>Cost of Borrowing:</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {hasData ? `+${costPct.toFixed(0)}%` : '0%'}
                </span>
              </div>

              {/* Stat 4: Debt-to-income burden */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                  <span>Monthly Debt Ratio:</span>
                </div>
                <span className={`text-sm font-bold ${liveRisk.color}`}>
                  {hasData ? `${debtRatio.toFixed(0)}%` : '0%'}
                </span>
              </div>
            </div>

            {/* Informative Guidance / Trust Pillars */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3.5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Key Affordability Rules
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-[9px] font-bold text-teal-700 mt-0.5 shrink-0">
                    1
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    <strong className="text-slate-800">The 40% Guideline</strong>: Safe lending recommends keeping all combined debt payments under 40% of net monthly income.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-[9px] font-bold text-teal-700 mt-0.5 shrink-0">
                    2
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    <strong className="text-slate-800">Cost Transparency</strong>: Pay attention to administrative fees; they are often used to mask double-digit interest rates.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-[9px] font-bold text-teal-700 mt-0.5 shrink-0">
                    3
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    <strong className="text-slate-800">Privacy Safeguard</strong>: All computations happen locally. Your finances are never uploaded to our databases unless you request a logged report.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
