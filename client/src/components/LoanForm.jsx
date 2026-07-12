import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Landmark, Receipt, Percent, Calendar, Coins, AlertTriangle, ArrowRight, AlertCircle } from 'lucide-react';

const fields = [
  { name: 'loanAmount', label: 'How much money is the lender giving you? (UGX)', type: 'number', icon: Landmark, placeholder: 'e.g. 500,000' },
  { name: 'feeAmount', label: 'How much fee do they charge to setup this loan? (UGX)', type: 'number', icon: Receipt, placeholder: 'e.g. 25,050' },
  { name: 'interestRate', label: 'What is the stated interest rate? (%)', type: 'number', icon: Percent, placeholder: 'e.g. 15' },
  { name: 'repaymentPeriodDays', label: 'How many days do you have to pay it back? (Days)', type: 'number', icon: Calendar, placeholder: 'e.g. 30' },
  { name: 'monthlyIncome', label: 'How much money do you take home/earn each month? (UGX)', type: 'number', icon: Coins, placeholder: 'e.g. 1,200,000' },
  { name: 'existingDebtRepayment', label: 'How much do you pay for other loans each month? (UGX)', type: 'number', icon: AlertTriangle, placeholder: 'e.g. 200,000', optional: true },
];

export default function LoanForm({ onSubmit, onValuesChange, initialValues }) {
  // Initialize state directly from initialValues to prevent mount race-overwriting
  const [values, setValues] = useState({
    loanAmount: initialValues?.loanAmount ? String(initialValues.loanAmount) : '',
    feeAmount: initialValues?.feeAmount ? String(initialValues.feeAmount) : '',
    interestRate: initialValues?.interestRate ? String(initialValues.interestRate) : '',
    repaymentPeriodDays: initialValues?.repaymentPeriodDays ? String(initialValues.repaymentPeriodDays) : '',
    monthlyIncome: initialValues?.monthlyIncome ? String(initialValues.monthlyIncome) : '',
    existingDebtRepayment: initialValues?.existingDebtRepayment ? String(initialValues.existingDebtRepayment) : '',
  });
  const [errors, setErrors] = useState({});

  // Sync with initialValues from parent on subsequent changes (e.g. selected lender change)
  useEffect(() => {
    if (initialValues) {
      setValues((prev) => {
        const isDifferent = 
          (initialValues.interestRate !== undefined && Number(initialValues.interestRate) !== Number(prev.interestRate)) ||
          (initialValues.feeAmount !== undefined && Number(initialValues.feeAmount) !== Number(prev.feeAmount)) ||
          (initialValues.repaymentPeriodDays !== undefined && Number(initialValues.repaymentPeriodDays) !== Number(prev.repaymentPeriodDays));
          
        if (isDifferent) {
          return {
            ...prev,
            interestRate: initialValues.interestRate ? String(initialValues.interestRate) : '',
            feeAmount: initialValues.feeAmount ? String(initialValues.feeAmount) : '',
            repaymentPeriodDays: initialValues.repaymentPeriodDays ? String(initialValues.repaymentPeriodDays) : '',
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
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 py-4 px-6">
        <CardTitle className="text-base font-bold text-slate-800 tracking-wide">
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
                  <Label htmlFor={field.name} className="text-slate-650 text-xs font-semibold tracking-wide flex items-center justify-between">
                    {field.label}
                    {field.optional && (
                      <span className="text-[10px] text-slate-400 font-medium tracking-normal lowercase">optional</span>
                    )}
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <FieldIcon className="h-4 w-4" />
                    </div>
                    <Input
                      id={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={values[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className={`pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 ${
                        errors[field.name] ? 'border-rose-500 focus:border-rose-500' : ''
                      }`}
                    />
                  </div>
                  {errors[field.name] && (
                    <span className="text-[10px] text-rose-600 font-semibold block flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                      {errors[field.name]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-100 border-0"
          >
            Review Audit Disclosures
            <ArrowRight className="h-4.5 w-4.5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
