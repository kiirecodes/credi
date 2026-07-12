import { useState } from 'react';
import { ShieldCheck, Activity, Award, Landmark, BookOpen, ChevronRight, HelpCircle } from 'lucide-react';
import HomePage from '@/pages/HomePage';
import AssessmentFlowPage from '@/pages/AssessmentFlowPage';
import LendersDirectoryPage from '@/pages/LendersDirectoryPage';
import RoadmapSlide from '@/components/RoadmapSlide';

export default function App() {
  const [view, setView] = useState('home');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-teal-200 relative overflow-hidden font-sans antialiased">
      {/* Decorative background ambient glows for light mode */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] rounded-full bg-slate-200/40 blur-[120px] pointer-events-none" />

      {/* Conditionally render Landing Layout or Dashboard Layout */}
      {view === 'home' ? (
        // Landing Layout (Light Mode)
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Brand logo */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
                <div className="p-1.5 rounded-lg bg-teal-50 border border-teal-200/60 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-900">
                  Credi-Check
                </span>
              </div>

              {/* Navigation Items */}
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setView('flow')}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold tracking-wide transition-all shadow-sm shadow-teal-100"
                >
                  Enter Safety Audit Console
                </button>
              </div>
            </div>
          </header>

          <main className="flex-grow">
            <HomePage onStartAssessment={() => setView('flow')} />
          </main>

          <footer className="border-t border-slate-200 bg-white/40 py-6 text-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Credi-Check Borrower Protection Framework. Ugandan Fintech Hackathon Entry.</p>
          </footer>
        </div>
      ) : (
        // Dashboard Workspace Layout (Left Sidebar + Wide Right Workspace)
        <div className="flex flex-row h-screen w-screen overflow-hidden relative">
          
          {/* Dashboard Left Sidebar (Dark themed for premium executive contrast) */}
          <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col justify-between shrink-0 h-full z-20">
            <div>
              {/* Brand Header */}
              <div 
                onClick={() => setView('home')}
                className="px-6 py-5 border-b border-slate-800 flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="p-1.5 rounded-lg bg-teal-950/60 border border-teal-800/40 group-hover:border-teal-700 transition-all">
                  <ShieldCheck className="h-5 w-5 text-teal-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-tight text-slate-200">
                    Credi-Check
                  </span>
                  <span className="text-[9px] text-slate-500 tracking-wider uppercase font-semibold">
                    Workspace
                  </span>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <nav className="p-4 space-y-1">
                <button
                  onClick={() => setView('flow')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    view === 'flow'
                      ? 'bg-teal-950/50 text-teal-400 border border-teal-800/40 shadow-sm shadow-teal-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Landmark className="h-4 w-4 shrink-0" />
                    <span>Safety Audit Tool</span>
                  </div>
                  <ChevronRight className={`h-3 w-3 transition-transform ${view === 'flow' ? 'translate-x-0.5 text-teal-400' : 'text-slate-655'}`} />
                </button>

                <button
                  onClick={() => setView('directory')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    view === 'directory'
                      ? 'bg-teal-950/50 text-teal-400 border border-teal-800/40 shadow-sm shadow-teal-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span>Lenders Directory</span>
                  </div>
                  <ChevronRight className={`h-3 w-3 transition-transform ${view === 'directory' ? 'translate-x-0.5 text-teal-400' : 'text-slate-655'}`} />
                </button>

                <button
                  onClick={() => setView('roadmap')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    view === 'roadmap'
                      ? 'bg-teal-950/50 text-teal-400 border border-teal-800/40 shadow-sm shadow-teal-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="h-4 w-4 shrink-0" />
                    <span>Future Roadmap</span>
                  </div>
                  <ChevronRight className={`h-3 w-3 transition-transform ${view === 'roadmap' ? 'translate-x-0.5 text-teal-400' : 'text-slate-655'}`} />
                </button>
              </nav>
            </div>

            {/* Sidebar Footer Widget */}
            <div className="p-4 border-t border-slate-800">
              <div className="p-3 bg-slate-950/30 border border-slate-850 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                  Engine Operational
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Local privacy calculations are active. Data is secure in memory.
                </p>
              </div>
              <button 
                onClick={() => setView('home')} 
                className="w-full text-center text-[10px] text-slate-500 hover:text-slate-300 underline mt-4"
              >
                Back to Home Screen
              </button>
            </div>
          </aside>

          {/* Main workspace frame (Light Mode) */}
          <main className="flex-grow h-full bg-slate-50 flex flex-col justify-between overflow-y-auto">
            <div className="p-6 md:p-10 max-w-7xl w-full mx-auto">
              {view === 'flow' ? (
                <div className="animate-slideUp">
                  <AssessmentFlowPage />
                </div>
              ) : view === 'directory' ? (
                <div className="animate-slideUp">
                  <LendersDirectoryPage />
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <RoadmapSlide onBack={() => setView('flow')} />
                </div>
              )}
            </div>

            <footer className="border-t border-slate-200/80 bg-slate-100/30 py-4 text-center text-[11px] text-slate-550">
              <p>© {new Date().getFullYear()} Credi-Check Borrower Safety Console.</p>
            </footer>
          </main>
        </div>
      )}
    </div>
  );
}
