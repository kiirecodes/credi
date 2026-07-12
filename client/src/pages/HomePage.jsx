import { Button } from '@/components/ui/button';
import { ShieldCheck, Info, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';

export default function HomePage({ onStartAssessment }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center">
      
      {/* Badge Alert */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200/70 text-xs text-teal-700 font-semibold mb-6 shadow-sm animate-fadeIn">
        <Sparkles className="h-3.5 w-3.5 text-teal-655" />
        Smarter Borrowing Choices Start Here
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mb-16 lg:mb-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
          Demystify Digital Loans{' '}
          <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Before You Accept
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-650 leading-relaxed">
          Credi-Check is a smart, client-focused borrower protection layer. It scans interest terms, 
          calculates your true debt burden, and highlights potential risks before you commit.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onStartAssessment} 
            size="lg" 
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base py-6 px-8 rounded-xl shadow-md shadow-teal-150 border-0 hover:scale-[1.01] transition-all"
          >
            Launch Free Assessment
          </Button>
        </div>
      </div>

      {/* Core Protection Pillars */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Pillar 1: Transparency */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 hover:border-slate-300 hover:shadow-sm transition-all duration-300">
          <div className="h-10 w-10 rounded-xl bg-teal-55/80 border border-teal-200/60 flex items-center justify-center">
            <Info className="h-5 w-5 text-teal-600" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">1. Transparency</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Exposes hidden interest tricks, administrative fees, and presents clear plain-language costs.
          </p>
        </div>

        {/* Pillar 2: Affirmative Consent */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 hover:border-slate-300 hover:shadow-sm transition-all duration-300">
          <div className="h-10 w-10 rounded-xl bg-teal-55/80 border border-teal-200/60 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-teal-600" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">2. Active Consent</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Empowers borrowers with an interactive opt-in list confirming full understanding before signatures.
          </p>
        </div>

        {/* Pillar 3: Affordability */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 hover:border-slate-300 hover:shadow-sm transition-all duration-300">
          <div className="h-10 w-10 rounded-xl bg-teal-55/80 border border-teal-200/60 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-teal-600" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">3. Local Suitability</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Performs local calculations based strictly on your numbers. No external databases checked, respecting your privacy.
          </p>
        </div>

        {/* Pillar 4: Early Warnings */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 hover:border-slate-300 hover:shadow-sm transition-all duration-300">
          <div className="h-10 w-10 rounded-xl bg-teal-55/80 border border-teal-200/60 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-teal-600" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">4. Pattern Alerts</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Identifies growing borrowing frequency and debt build-up early, preventing the rollover debt cycle.
          </p>
        </div>

      </div>

    </div>
  );
}
