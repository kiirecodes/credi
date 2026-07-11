import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Landmark, Receipt, Percent, Calendar, Coins, AlertTriangle, ArrowRight, AlertCircle } from 'lucide-react';

const fields = [
  { name: 'loanAmount', label: 'Loan Offer Amount (UGX)', type: 'number', icon: Landmark, placeholder: 'e.g. 500,000' },
  { name: 'feeAmount', label: 'Processing Fees (UGX)', type: 'number', icon: Receipt, placeholder: 'e.g. 25,050' },
  { name: 'interestRate', label: 'Stated Interest Rate (%)', type: 'number', icon: Percent, placeholder: 'e.g. 15' },
  { name: 'repaymentPeriodDays', label: 'Repayment Period (Days)', type: 'number', icon: Calendar, placeholder: 'e.g. 30' },
  { name: 'monthlyIncome', label: 'Your Monthly Net Income (UGX)', type: 'number', icon: Coins, placeholder: 'e.g. 1,200,000' },
  { name: 'existingDebtRepayment', label: 'Other Active Monthly Debt (UGX)', type: 'number', icon: AlertTriangle, placeholder: 'e.g. 200,000 (optional)', optional: true },
];

export default function LoanForm({ onSubmit, onValuesChange, initialValues }) {
  const [values, setValues] = useState({
    loanAmount: '',
    feeAmount: '',
    interestRate: '',
    repaymentPeriodDays: '',
    monthlyIncome: '',
    existingDebtRepayment: '',
  });
  const [errors, setErrors] = useState({});

  // Sync with initialValues from parent on lender selection
  useEffect(() => {
    if (initialValues) {
      setValues((prev) => {
        const isDifferent = 
          Number(initialValues.interestRate) !== Number(prev.interestRate) ||
          Number(initialValues.feeAmount) !== Number(prev.feeAmount) ||
          Number(initialValues.repaymentPeriodDays) !== Number(prev.repaymentPeriodDays);
          
        if (isDifferent) {
          return {
            ...prev,
            interestRate: initialValues.interestRate || '',
            feeAmount: initialValues.feeAmount || '',
            repaymentPeriodDays: initialValues.repaymentPeriodDays || '',
          };
        }
        return prev;
      });
    }
  }, [initialValues]);

  // Real-time propagation of inputs to parent visualizer
  useEffect(() => {
    if (onValuesChange) {
      onValuesChange({
        loanAmount: Number(values.loanAmount) || 0,
        feeAmount: Number(values.feeAmount) || 0,
        interestRate: Number(values.interestRate) || 0,
        repaymentPeriodDays: Number(values.repaymentPeriodDays) || 30,
        monthlyIncome: Number(values.monthlyIncome) || 0,
        existingDebtRepayment: Number(values.existingDebtRepayment) || 0,
      });
    }
  }, [values, onValuesChange]);

  const validate = () => {
    const newErrors = {};
    for (const field of fields) {
      const val = values[field.name];
      if (!field.optional && (val === '' || val === undefined)) {
        newErrors[field.name] = `${field.label.split(' (')[0]} is required`;
      } else if (val !== '' && val !== undefined && Number(val) <= 0 && !field.optional) {
        newErrors[field.name] = `${field.label.split(' (')[0]} must be greater than zero`;
      } else if (val !== '' && Number(val) < 0) {
        newErrors[field.name] = `${field.label.split(' (')[0]} must be non-negative`;
      }
    }
    if (values.monthlyIncome !== '' && Number(values.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Monthly income must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      loanAmount: Number(values.loanAmount),
      feeAmount: Number(values.feeAmount),
      interestRate: Number(values.interestRate),
      repaymentPeriodDays: Number(values.repaymentPeriodDays),
      monthlyIncome: Number(values.monthlyIncome),
      existingDebtRepayment: Number(values.existingDebtRepayment) || 0,
    });
  };

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <Card className="bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md">
      <CardHeader className="border-b border-slate-850 py-4 px-6">
        <CardTitle className="text-base font-bold text-slate-100 tracking-wide">
          Loan Term Declaration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => {
              const FieldIcon = field.icon;
              return (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-slate-350 text-xs font-semibold tracking-wide flex items-center justify-between">
                    {field.label}
                    {field.optional && (
                      <span className="text-[10px] text-slate-500 font-medium tracking-normal lowercase">optional</span>
                    )}
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <FieldIcon className="h-4 w-4" />
                    </div>
                    <Input
                      id={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={values[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className={`pl-10 bg-slate-950 border-slate-850 text-slate-100 placeholder:text-slate-700 focus:border-teal-700 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 ${
                        errors[field.name] ? 'border-rose-500 focus:border-rose-500' : ''
                      }`}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="text-rose-450 text-[11px] flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <Button type="submit" className="w-full bg-teal-650 hover:bg-teal-700 text-white font-semibold text-sm py-5 rounded-xl border border-teal-500/20 shadow-md shadow-teal-950/40 hover:scale-[1.01] transition-all mt-6">
            Run Transparency Audit
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
