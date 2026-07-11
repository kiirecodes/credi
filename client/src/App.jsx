import { useState } from 'react';
import { ShieldCheck, Activity, Award } from 'lucide-react';
import HomePage from '@/pages/HomePage';
import AssessmentFlowPage from '@/pages/AssessmentFlowPage';
import RoadmapSlide from '@/components/RoadmapSlide';

export default function App() {
  const [view, setView] = useState('home');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-700/50 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-800/20 blur-[100px] pointer-events-none" />

      {/* Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => setView('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-teal-950/60 border border-teal-800/50 group-hover:border-teal-700 transition-all duration-300 shadow-inner shadow-teal-900/40">
              <ShieldCheck className="h-6 w-6 text-teal-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Credi-Check
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                Intelligence Layer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400 font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Protection Active
            </div>

            <button
              onClick={() => setView(view === 'roadmap' ? 'home' : 'roadmap')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300 ${
                view === 'roadmap'
                  ? 'bg-teal-950 text-teal-400 border border-teal-800/60'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-350 border border-slate-800 hover:text-white'
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              Roadmap
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center relative z-10">
        {view === 'home' && (
          <div className="animate-fadeIn">
            <HomePage onStart={() => setView('flow')} />
          </div>
        )}

        {view === 'flow' && (
          <div className="animate-slideUp max-w-7xl mx-auto w-full">
            <AssessmentFlowPage />
          </div>
        )}

        {view === 'roadmap' && (
          <div className="animate-fadeIn">
            <RoadmapSlide onBack={() => setView('home')} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-6 text-center text-xs text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} Credi-Check. Built for the Africa Borrower Protection Hackathon.</p>
      </footer>
    </div>
  );
}
