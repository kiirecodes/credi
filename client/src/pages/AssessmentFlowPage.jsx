import { useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, Sparkles, Coins, Landmark, Calendar, Percent, ShieldCheck, CheckCircle2, ShieldAlert, Sparkle, HelpCircle, Shield, AlertTriangle } from 'lucide-react';
import LoanForm from '@/components/LoanForm';
import ConsentStep from '@/components/ConsentStep';
import ResultsDashboard from '@/components/ResultsDashboard';
import LenderSelection from '@/components/LenderSelection';
import { analyzeLoan } from '@/services/api';

const steps = [
  { key: 'select-provider', label: 'Select Lender', number: 1 },
  { key: 'form', label: 'Declare Terms', number: 2 },
  { key: 'consent', label: 'Verify Consent', number: 3 },
  { key: 'results', label: 'Safety Report', number: 4 }
];

function ProgressStepper({ currentStep }) {
  const currentIndex = steps.findIndex(s => s.key === currentStep);
  return (
    <div className="w-full bg-slate-900/30 border border-slate-900 rounded-xl p-4 flex items-center justify-between gap-2 mb-6">
      {steps.map((s, index) => {
        const isActive = s.key === currentStep;
        const isCompleted = currentIndex > index;
        return (
          <div key={s.key} className="flex items-center flex-grow last:flex-grow-0">
            <div className="flex items-center gap-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                isActive 
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-900/50' 
                  : isCompleted 
                    ? 'bg-teal-950/80 text-teal-400 border border-teal-800/60' 
                    : 'bg-slate-955 text-slate-500 border border-slate-900'
              }`}>
                {isCompleted ? '✓' : s.number}
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold hidden sm:inline ${
                isActive ? 'text-teal-400' : isCompleted ? 'text-slate-350' : 'text-slate-500'
              }`}>
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-[1px] flex-grow mx-4 hidden sm:block ${
                currentIndex > index ? 'bg-teal-900/50' : 'bg-slate-900'
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

  const handleSubmit = async (values) => {
    setError(null);
    try {
      const result = await analyzeLoan(values);
      setAssessment(result);
      setStep('consent');
    } catch (err) {
      const message = err.response?.data?.errors?.[0]?.message
        || err.response?.data?.message
        || 'Something went wrong. Please try again.';
      setError(message);
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

  // Determine risk profile for real-time visual chart elements
  let liveRisk = {
    label: 'Calculating...',
    color: 'text-slate-400',
    bg: 'bg-slate-900/50 border-slate-800/80',
    barColor: 'bg-slate-700',
    desc: 'Enter numbers to begin protection calculations.'
  };

  if (hasData) {
    if (debtRatio <= 40) {
      liveRisk = {
        label: 'Affordable / Safe Capacity',
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/20 border-emerald-800/30',
        barColor: 'bg-emerald-500',
        desc: 'Repayment is within safe bounds (under 40% of income).'
      };
    } else if (debtRatio <= 60) {
      liveRisk = {
        label: 'Moderate Financial Pressure',
        color: 'text-amber-400',
        bg: 'bg-amber-955/20 border-amber-800/30',
        barColor: 'bg-amber-500',
        desc: 'Repayments are elevated. Ensure you reduce other discretionary spending.'
      };
    } else {
      liveRisk = {
        label: 'Excessive Debt Stress',
        color: 'text-rose-400',
        bg: 'bg-rose-955/30 border-rose-800/30',
        barColor: 'bg-rose-500',
        desc: 'repayment eats too much of your monthly income. High chance of rolling debt cycles.'
      };
    }
  }

  return (
    <div className="space-y-6">
      {/* Title & Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Landmark className="h-6 w-6 text-teal-400" />
            Safety Audit Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conducting local calculations using the Borrower Affordability framework.
          </p>
        </div>
        
        {step !== 'results' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-950/40 border border-teal-900/40 text-[10px] font-semibold text-teal-400 uppercase tracking-wider">
            <Sparkle className="h-3 w-3 animate-spin" />
            Live Analysis Active
          </div>
        )}
      </div>

      {/* Progress Stepper Bar */}
      <ProgressStepper currentStep={step} />

      {error && (
        <Alert className="bg-rose-955/30 border-rose-900 text-rose-200">
          <AlertCircle className="h-4 w-4 text-rose-400" />
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
                  <div className="p-3 bg-teal-955/20 border border-teal-900/30 rounded-xl text-xs flex justify-between items-center text-teal-400 animate-fadeIn">
                    <span>Selected Lender: <strong>{selectedLender.name}</strong></span>
                    <button 
                      onClick={() => setStep('select-provider')} 
                      className="underline text-[10px] uppercase font-bold hover:text-white"
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
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Real-time Affordability
                </span>
                <span className={`text-xs font-bold ${liveRisk.color}`}>
                  {liveRisk.label}
                </span>
              </div>
              
              {/* Progress gauge bar */}
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 mb-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${liveRisk.barColor}`} 
                  style={{ width: `${hasData ? Math.min(debtRatio, 100) : 0}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {liveRisk.desc}
              </p>
            </div>

            {/* Live Stats grid */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">
                Simulated Cost Indicators
              </h3>
              
              {/* Stat 1: Total Repayment */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Coins className="h-4 w-4 text-slate-500" />
                  <span>Est. Repayment:</span>
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  UGX {hasData ? totalRepayment.toLocaleString() : '0'}
                </span>
              </div>

              {/* Stat 2: Monthly Cost */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>Monthly Cost:</span>
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  UGX {hasData ? Math.round(newLoanMonthlyCost).toLocaleString() : '0'}
                </span>
              </div>

              {/* Stat 3: Markup Percentage */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Percent className="h-4 w-4 text-slate-500" />
                  <span>Cost Multiplier:</span>
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  {hasData ? `+${costPct.toFixed(0)}%` : '0%'}
                </span>
              </div>

              {/* Stat 4: Debt-to-income burden */}
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <TrendingUp className="h-4 w-4 text-slate-500" />
                  <span>Total Debt Ratio:</span>
                </div>
                <span className={`text-sm font-bold ${liveRisk.color}`}>
                  {hasData ? `${debtRatio.toFixed(0)}%` : '0%'}
                </span>
              </div>
            </div>

            {/* Informative Guidance / Trust Pillars */}
            <div className="p-5 bg-slate-900/10 border border-slate-900 rounded-2xl space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Affordability Rules
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-teal-950 flex items-center justify-center text-[9px] font-bold text-teal-400 mt-0.5 shrink-0">
                    1
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    <strong className="text-slate-300">The 40% Guideline</strong>: Safe lending recommends keeping all combined debt payments under 40% of net monthly income.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-teal-950 flex items-center justify-center text-[9px] font-bold text-teal-400 mt-0.5 shrink-0">
                    2
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    <strong className="text-slate-300">Cost Transparency</strong>: Pay attention to administrative fees; they are often used to mask double-digit interest rates.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-teal-950 flex items-center justify-center text-[9px] font-bold text-teal-400 mt-0.5 shrink-0">
                    3
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    <strong className="text-slate-300">Privacy Safeguard</strong>: All computations happen locally. Your finances are never uploaded to our databases unless you request a logged report.
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
