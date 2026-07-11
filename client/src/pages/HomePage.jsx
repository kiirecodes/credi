import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

export default function HomePage({ onStart }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <ShieldCheck className="h-20 w-20 text-primary mb-6" />
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Credi-Check
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Know before you borrow. Check if a loan is safe, affordable, and right for you.
      </p>
      <Button onClick={onStart} size="lg">
        Check a Loan
      </Button>
    </div>
  );
}
