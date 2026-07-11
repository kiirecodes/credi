import { useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import LoanForm from '@/components/LoanForm';
import ConsentStep from '@/components/ConsentStep';
import ResultsDashboard from '@/components/ResultsDashboard';
import { analyzeLoan } from '@/services/api';

export default function AssessmentFlowPage() {
  const [step, setStep] = useState('form');
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-lg mx-auto">
        {error && (
          <Alert className="mb-4 bg-high-risk-bg border-high-risk text-foreground">
            <AlertCircle className="h-4 w-4 text-high-risk" />
            <span className="text-sm">{error}</span>
          </Alert>
        )}

        {step === 'form' && (
          <LoanForm onSubmit={handleSubmit} />
        )}

        {step === 'consent' && assessment && (
          <ConsentStep
            assessment={assessment}
            onConfirm={() => setStep('results')}
          />
        )}

        {step === 'results' && assessment && (
          <ResultsDashboard assessment={assessment} />
        )}
      </div>
    </div>
  );
}
