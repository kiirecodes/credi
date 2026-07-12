import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowRight } from 'lucide-react';

const stages = [
  { title: 'Loan Safety Checker', description: 'Real-time affordability scoring' },
  { title: 'Comparison Engine', description: 'Compare offers across lenders' },
  { title: 'Financial Health Profile', description: 'Personal financial insights' },
  { title: 'Lender Integration', description: 'Connect with verified lenders' },
  { title: 'Borrower Protection', description: 'Infrastructure across Africa' },
];

export default function RoadmapSlide({ onBack }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 text-center">
          Our Roadmap
        </h2>
        <p className="text-xs text-slate-400 text-center mt-1">
          Planned features and expansion milestones for the Credi-Check platform.
        </p>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={index} className="flex items-center gap-3">
            <Card className="flex-1 bg-slate-900/40 border-slate-800/80 shadow-xl transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    index === stages.length - 1
                      ? 'bg-teal-950/60 border border-teal-800/40 text-teal-400'
                      : 'bg-slate-950 border border-slate-800 text-slate-500'
                  }`}>
                    {index === stages.length - 1 ? (
                      <Rocket className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-200">{stage.title}</h3>
                    <p className="text-xs text-slate-400">{stage.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {index < stages.length - 1 && (
              <ArrowRight className="h-4 w-4 text-slate-600 shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <Button onClick={onBack} variant="outline" className="bg-slate-950 border-slate-850 text-slate-300 hover:text-white hover:bg-slate-900 px-6 py-2.5 rounded-xl text-xs font-semibold">
          Back to Safety Audit
        </Button>
      </div>
    </div>
  );
}
