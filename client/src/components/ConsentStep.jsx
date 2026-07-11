import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ConsentStep({ assessment, onConfirm }) {
  const [checks, setChecks] = useState({
    amount: false,
    repayment: false,
    deadline: false,
    fees: false,
  });

  const allChecked = Object.values(checks).every(Boolean);

  const handleCheck = (key) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    {
      key: 'amount',
      title: 'Principal Obligation',
      label: `I understand I am borrowing UGX ${assessment.loanAmount.toLocaleString()}`,
    },
    {
      key: 'repayment',
      title: 'Repayment Value',
      label: `I understand I will repay UGX ${assessment.totalRepayment.toLocaleString()} in total`,
    },
    {
      key: 'deadline',
      title: 'repayment Schedule',
      label: `I understand the repayment deadline is ${assessment.repaymentPeriodDays} days`,
    },
    {
      key: 'fees',
      title: 'Financing Surcharges',
      label: `I understand there is a fee of UGX ${assessment.feeAmount.toLocaleString()} included in the total`,
    },
  ];

  return (
    <Card className="bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md animate-slideUp">
      <CardHeader className="border-b border-slate-850 py-4 px-6">
        <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-teal-400" />
          Affirmative Consent Checklist
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-5">
        <div className="p-4 bg-slate-950/80 border border-slate-900 rounded-xl space-y-1">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audit Result Pending</h4>
          <p className="text-xs text-slate-500 leading-normal">
            To view the full safety report, you must manually acknowledge and verify that you understand each of the four core terms below.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.key} 
              onClick={() => handleCheck(item.key)}
              className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                checks[item.key] 
                  ? 'bg-teal-950/20 border-teal-800/60 shadow-sm shadow-teal-950/20' 
                  : 'bg-slate-950/40 border-slate-850 hover:bg-slate-900/50 hover:border-slate-800'
              }`}
            >
              <Info className={`h-5 w-5 mt-0.5 shrink-0 transition-colors ${checks[item.key] ? 'text-teal-400' : 'text-slate-500'}`} />
              <div className="flex-grow space-y-1">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${checks[item.key] ? 'text-teal-400' : 'text-slate-500'}`}>
                  {item.title}
                </span>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={item.key}
                    checked={checks[item.key]}
                    onCheckedChange={() => {}} // Handled by outer card onClick for easier tap target
                    className="border-slate-700 bg-slate-950"
                  />
                  <Label 
                    htmlFor={item.key} 
                    className="text-xs font-medium text-slate-300 leading-snug cursor-pointer flex-grow"
                  >
                    {item.label}
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={onConfirm}
          disabled={!allChecked}
          className="w-full bg-teal-650 hover:bg-teal-700 text-white font-semibold text-sm py-5 rounded-xl border border-teal-500/20 shadow-md shadow-teal-955/20 hover:scale-[1.01] transition-all disabled:opacity-40 disabled:scale-100 mt-4"
        >
          View Full Transparency Report
          <CheckCircle2 className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
