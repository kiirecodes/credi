import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';
import RiskBadge from './RiskBadge';
import ReasoningList from './ReasoningList';
import PatternWarningBanner from './PatternWarningBanner';

export default function ResultsDashboard({ assessment }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Assessment Results</span>
            <RiskBadge riskLevel={assessment.riskLevel} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-foreground font-medium">
            {assessment.plainLanguageSummary}
          </p>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Repayment</p>
              <p className="text-lg font-semibold text-foreground">
                UGX {assessment.totalRepayment.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cost of Borrowing</p>
              <p className="text-lg font-semibold text-foreground">
                {assessment.costOfBorrowingPct.toFixed(1)}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Debt Burden</p>
              <p className="text-lg font-semibold text-foreground">
                {assessment.debtBurdenRatio.toFixed(0)}%
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Why this rating?</h3>
            <ReasoningList reasoning={assessment.reasoning} />
          </div>

          <Alert className="bg-primary/10 border-primary text-foreground">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="text-sm">{assessment.recommendationText}</span>
          </Alert>
        </CardContent>
      </Card>

      <PatternWarningBanner patternWarning={assessment.patternWarning} />
    </div>
  );
}
