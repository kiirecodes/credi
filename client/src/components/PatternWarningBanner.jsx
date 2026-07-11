import { Alert } from '@/components/ui/alert';
import { TrendingUp } from 'lucide-react';

export default function PatternWarningBanner({ patternWarning }) {
  if (!patternWarning) return null;

  return (
    <Alert className="bg-caution-bg border-caution text-foreground">
      <TrendingUp className="h-4 w-4 text-caution" />
      <span className="text-sm">{patternWarning}</span>
    </Alert>
  );
}
