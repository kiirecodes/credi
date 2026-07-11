import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle } from 'lucide-react';

const fields = [
  { name: 'loanAmount', label: 'Loan Amount (UGX)', type: 'number' },
  { name: 'feeAmount', label: 'Fee Amount (UGX)', type: 'number' },
  { name: 'interestRate', label: 'Interest Rate (%)', type: 'number' },
  { name: 'repaymentPeriodDays', label: 'Repayment Period (days)', type: 'number' },
  { name: 'monthlyIncome', label: 'Monthly Income (UGX)', type: 'number' },
  { name: 'existingDebtRepayment', label: 'Existing Debt Repayment (UGX)', type: 'number', optional: true },
];

export default function LoanForm({ onSubmit }) {
  const [values, setValues] = useState({
    loanAmount: '',
    feeAmount: '',
    interestRate: '',
    repaymentPeriodDays: '',
    monthlyIncome: '',
    existingDebtRepayment: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    for (const field of fields) {
      const val = values[field.name];
      if (!field.optional && (val === '' || val === undefined)) {
        newErrors[field.name] = `${field.label} is required`;
      } else if (val !== '' && val !== undefined && Number(val) <= 0 && !field.optional) {
        newErrors[field.name] = `${field.label} must be a positive number`;
      } else if (val !== '' && Number(val) < 0) {
        newErrors[field.name] = `${field.label} must be non-negative`;
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
    <Card>
      <CardHeader>
        <CardTitle>Loan Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type={field.type}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className={errors[field.name] ? 'border-high-risk focus-visible:ring-high-risk' : ''}
              />
              {errors[field.name] && (
                <p className="text-high-risk text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
          <Button type="submit" className="w-full">
            Check My Loan
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
