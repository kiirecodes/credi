import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

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
      title: 'Money Received (Principal)',
      label: `I understand I am borrowing exactly UGX ${assessment.loanAmount.toLocaleString()} in hand.`,
    },
    {
      key: 'repayment',
      title: 'Total Money to Repay',
      label: `I understand I must pay back a total of UGX ${assessment.totalRepayment.toLocaleString()} (including all interest and fees).`,
    },
    {
      key: 'deadline',
      title: 'Repayment Deadline',
      label: `I understand I have exactly ${assessment.repaymentPeriodDays} days to pay back the full amount.`,
    },
    {
      key: 'fees',
      title: 'Lender Service Fees',
      label: `I understand there is an extra fee of UGX ${assessment.feeAmount.toLocaleString()} added on top of what I borrowed.`,
    },
  ];

  return (
    <Card className="bg-white border-slate-200 shadow-sm animate-slideUp">
      <CardHeader className="border-b border-slate-100 py-4 px-6">
        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-teal-600" />
          Make Sure You Understand Your Loan
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-5">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Please Verify These Numbers First</h4>
          <p className="text-xs text-slate-500 leading-normal">
            Before we show you your full safety report, please check each box below to confirm you understand how much this loan will actually cost you.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.key} 
              onClick={() => handleCheck(item.key)}
              className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                checks[item.key] 
                  ? 'bg-teal-50/20 border-teal-500/80 shadow-sm' 
                  : 'bg-white border-slate-200 hover:bg-slate-50/40 hover:border-slate-300'
              }`}
            >
              <Info className={`h-5 w-5 mt-0.5 shrink-0 transition-colors ${checks[item.key] ? 'text-teal-655' : 'text-slate-400'}`} />
              <div className="flex-grow space-y-1">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${checks[item.key] ? 'text-teal-600' : 'text-slate-450'}`}>
                  {item.title}
                </span>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={item.key}
                    checked={checks[item.key]}
                    onCheckedChange={() => {}} // Handled by outer card onClick
                    className="border-slate-300 bg-white"
                  />
                  <Label 
                    htmlFor={item.key} 
                    className="text-xs font-semibold text-slate-700 leading-snug cursor-pointer flex-grow"
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
          className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm py-5 rounded-xl border-0 shadow-md shadow-teal-100/50 hover:scale-[1.01] transition-all disabled:opacity-40 disabled:scale-100 mt-4"
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
