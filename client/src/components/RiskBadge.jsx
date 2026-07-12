import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const config = {
  safe: {
    icon: CheckCircle2,
    label: 'Safe to Consider',
    className: 'bg-safe-bg text-safe hover:bg-safe-bg',
  },
  caution: {
    icon: AlertTriangle,
    label: 'Borrow with Caution',
    className: 'bg-caution-bg text-caution hover:bg-caution-bg',
  },
  high_risk: {
    icon: XCircle,
    label: 'High Financial Risk',
    className: 'bg-high-risk-bg text-high-risk hover:bg-high-risk-bg',
  },
};

export default function RiskBadge({ riskLevel }) {
  const { icon: Icon, label, className } = config[riskLevel] || config.safe;

  return (
    <Badge className={`${className} text-sm px-3 py-1 gap-1`}>
      <Icon className="h-4 w-4" />
      {label}
    </Badge>
  );
}
