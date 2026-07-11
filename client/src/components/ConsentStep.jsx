import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle2 } from 'lucide-react';

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
      label: `I understand I am borrowing UGX ${assessment.loanAmount.toLocaleString()}`,
    },
    {
      key: 'repayment',
      label: `I understand I will repay UGX ${assessment.totalRepayment.toLocaleString()} in total`,
    },
    {
      key: 'deadline',
      label: `I understand the repayment deadline is ${assessment.repaymentPeriodDays} days`,
    },
    {
      key: 'fees',
      label: `I understand there is a fee of UGX ${assessment.feeAmount.toLocaleString()} included in the total`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirm You Understand</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex items-center gap-2">
              <Checkbox
                id={item.key}
                checked={checks[item.key]}
                onCheckedChange={() => handleCheck(item.key)}
              />
              <Label htmlFor={item.key} className="text-sm leading-snug cursor-pointer">
                {item.label}
              </Label>
            </div>
          </div>
        ))}
        <Button
          onClick={onConfirm}
          disabled={!allChecked}
          className="w-full mt-4"
        >
          Continue to Results
          <CheckCircle2 className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
