import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Landmark, Search, Star, ShieldCheck, ShieldAlert, Award, FileText, ExternalLink } from 'lucide-react';
import { getLenders } from '@/services/api';

export default function LendersDirectoryPage() {
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const loadLenders = async () => {
      try {
        const fetched = await getLenders();
        setLenders(fetched);
      } catch (err) {
        setFetchError('Unable to fetch lenders from the database.');
      } finally {
        setLoading(false);
      }
    };

    loadLenders();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center text-slate-400">
        Loading lender directory...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="rounded-3xl border border-rose-800 bg-rose-950/60 p-8 text-center text-rose-200">
        {fetchError}
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(lenders.map((lender) => lender.category)))];

  const filteredLenders = lenders.filter((lender) => {
    const matchesSearch = lender.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lender.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || lender.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Award className="h-6 w-6 text-teal-400" />
            Lender Registry & Transparency Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse verified regulatory credentials, license tiers, privacy disclosures, and standard cost structures.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/30 border border-slate-900 p-4 rounded-2xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search lenders by name or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-955 text-teal-400 border-teal-800/40 shadow shadow-teal-950'
                  : 'bg-slate-950/40 text-slate-450 border-slate-900 hover:border-slate-850 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLenders.map((lender) => (
          <Card key={lender.slug} className="bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80 shadow-xl transition-all duration-300 flex flex-col justify-between">
            <CardHeader className="border-b border-slate-800/80 py-4 px-5 flex flex-row items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-teal-400">
                  <Landmark className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-sm text-slate-200">{lender.name}</h3>
                  <p className="text-[10px] text-slate-500 font-semibold">{lender.category}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${lender.licenseColor}`}>
                  {lender.license}
                </span>
                <div className="flex items-center gap-0.5 text-[10px]">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-300">{lender.trustScore}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4 flex-grow flex flex-col justify-between">
              
              {/* Description & Details */}
              <div className="space-y-3.5">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lender.description}
                </p>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-3 bg-slate-950/40 border border-slate-900 p-3 rounded-xl text-[11px]">
                  <div>
                    <span className="text-slate-500 uppercase tracking-wide text-[9px] block">Baseline Cost Structure</span>
                    <strong className="text-slate-300">{lender.interestRate}% Interest | UGX {lender.feeAmount.toLocaleString()} Fee</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wide text-[9px] block">Standard Loan Range</span>
                    <strong className="text-slate-300">{lender.loanRange}</strong>
                  </div>
                </div>
              </div>

              {/* Warnings and Disclosures */}
              <div className="border-t border-slate-900/60 pt-4 space-y-2.5 text-[11px]">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-slate-400 leading-normal">
                    <strong className="text-slate-300">Privacy Disclosure:</strong> {lender.privacyNote}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold p-2 bg-slate-950/30 rounded border border-slate-900">
                  <span className="text-slate-500 uppercase tracking-wider">Safety Status:</span>
                  <span className={
                    lender.safetyStatus.includes('Risk') ? 'text-rose-400' : 
                    lender.safetyStatus.includes('Caution') ? 'text-amber-400' : 'text-emerald-400'
                  }>
                    {lender.safetyStatus}
                  </span>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}

        {filteredLenders.length === 0 && (
          <div className="col-span-2 py-12 text-center space-y-2 bg-slate-900/10 border border-slate-900 rounded-2xl">
            <ShieldAlert className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">No lenders found matching search criteria.</p>
            <p className="text-xs text-slate-500">Try modifying your text query or selected category filter.</p>
          </div>
        )}
      </div>

    </div>
  );
}
