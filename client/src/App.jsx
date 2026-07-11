import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import HomePage from '@/pages/HomePage';
import AssessmentFlowPage from '@/pages/AssessmentFlowPage';
import RoadmapSlide from '@/components/RoadmapSlide';

export default function App() {
  const [view, setView] = useState('home');

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-navy text-navy-foreground px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <ShieldCheck className="h-6 w-6" />
          <span className="font-semibold">Credi-Check</span>
        </div>
      </header>

      {view === 'home' && (
        <>
          <HomePage onStart={() => setView('flow')} />
          <div className="text-center pb-8">
            <button
              onClick={() => setView('roadmap')}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              View Roadmap
            </button>
          </div>
        </>
      )}

      {view === 'flow' && (
        <AssessmentFlowPage />
      )}

      {view === 'roadmap' && (
        <RoadmapSlide onBack={() => setView('home')} />
      )}
    </div>
  );
}
