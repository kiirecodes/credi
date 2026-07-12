import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, Clock } from 'lucide-react';
import RiskBadge from './RiskBadge';
import { getUserHistory } from '@/services/api';

export default function BorrowingPatternPanel({ userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchHistory = async () => {
      try {
        const data = await getUserHistory(userId);
        setHistory(data.assessments || []);
      } catch (err) {
        // Silent fail — pattern warning banner already covers the MVP requirement
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  if (loading || history.length === 0) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-UG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="bg-slate-900/40 border-slate-800/80 shadow-xl backdrop-blur-md">
      <CardHeader className="border-b border-slate-850 py-3.5 px-6">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-amber-400" />
          Your Borrowing Pattern
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        <p className="text-[11px] text-slate-400 leading-normal">
          You have made <strong className="text-slate-200">{history.length}</strong> loan {history.length === 1 ? 'check' : 'checks'} recorded in the system.
        </p>
        <div className="space-y-2">
          {history.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-900">
              <div className="flex items-center gap-3">
                <RiskBadge riskLevel={item.riskLevel} />
                <span className="text-xs text-slate-300 font-medium">
                  UGX {item.loanAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <Clock className="h-3 w-3" />
                {formatDate(item.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
