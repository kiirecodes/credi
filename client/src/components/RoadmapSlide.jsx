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
    <div className="min-h-screen bg-navy py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-navy-foreground text-center mb-8">
          Our Roadmap
        </h2>
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={index} className="flex items-center gap-3">
              <Card className="flex-1 bg-white/10 border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {index === stages.length - 1 && (
                      <Rocket className="h-5 w-5 text-navy-foreground" />
                    )}
                    <div>
                      <h3 className="font-semibold text-navy-foreground">{stage.title}</h3>
                      <p className="text-sm text-navy-foreground/70">{stage.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {index < stages.length - 1 && (
                <ArrowRight className="h-5 w-5 text-navy-foreground/50 shrink-0" />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button onClick={onBack} variant="outline" className="border-navy-foreground/30 text-navy-foreground hover:bg-white/10">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
