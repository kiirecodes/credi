import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Landmark, Search, Star, ShieldCheck, ShieldAlert, Award, FileText, ExternalLink } from 'lucide-react';

const allLenders = [
  {
    slug: 'tala',
    name: 'Tala Mobile Loan',
    category: 'Fintech Mobile app',
    interestRate: 15,
    feeAmount: 10000,
    repaymentPeriodDays: 30,
    trustScore: 4.5,
    license: 'UMRA Registered',
    licenseColor: 'text-teal-700 border-teal-200 bg-teal-50',
    loanRange: 'UGX 50,000 - 1,000,000',
    description: 'Fast automated credit scoring via mobile app logs. No collateral required.',
    privacyNote: 'Collects contacts list and device info for identity checks.',
    safetyStatus: 'Safe (Regulated)'
  },
  {
    slug: 'branch',
    name: 'Branch Finance',
    category: 'Fintech Mobile app',
    interestRate: 12,
    feeAmount: 15000,
    repaymentPeriodDays: 30,
    trustScore: 4.6,
    license: 'UMRA Registered',
    licenseColor: 'text-teal-700 border-teal-200 bg-teal-50',
    loanRange: 'UGX 80,000 - 2,000,000',
    description: 'Low-cost mobile digital credit. Direct mobile money transfer within minutes.',
    privacyNote: 'Accesses GPS data and device identifiers for credit score computations.',
    safetyStatus: 'Safe (Regulated)'
  },
  {
    slug: 'mkopa',
    name: 'M-Kopa Cash',
    category: 'Asset Financer',
    interestRate: 25,
    feeAmount: 30000,
    repaymentPeriodDays: 60,
    trustScore: 3.8,
    license: 'Consumer Goods Provider',
    licenseColor: 'text-amber-700 border-amber-205 bg-amber-50',
    loanRange: 'UGX 200,000 - 1,500,000',
    description: 'Asset finance solutions linked to phone locking and solar power lease systems.',
    privacyNote: 'Remote lock features installed on financed smartphones.',
    safetyStatus: 'Caution (Device Locks)'
  },
  {
    slug: 'watu',
    name: 'Watu Credit Uganda',
    category: 'Microfinance Institution',
    interestRate: 20,
    feeAmount: 50000,
    repaymentPeriodDays: 90,
    trustScore: 3.9,
    license: 'Tier 4 Microfinance',
    licenseColor: 'text-teal-700 border-teal-200 bg-teal-50',
    loanRange: 'UGX 500,000 - 5,000,000',
    description: 'Primarily specializes in asset leasing (Boda Boda financing) and micro business loans.',
    privacyNote: 'GPS trackers installed on financed assets; weekly repayments required.',
    safetyStatus: 'Safe (Asset Collateral)'
  },
  {
    slug: 'ugtrust',
    name: 'Uganda Trust Microfinance',
    category: 'Microfinance Institution',
    interestRate: 8,
    feeAmount: 20000,
    repaymentPeriodDays: 90,
    trustScore: 4.8,
    license: 'BOU Regulated (MDI)',
    licenseColor: 'text-emerald-700 border-emerald-200 bg-emerald-50',
    loanRange: 'UGX 1,000,000 - 20,000,000',
    description: 'Traditional savings and loan microfinance deposit-taking institution regulated by Bank of Uganda.',
    privacyNote: 'Requires standard physical verification, guarantor forms, and local bank statement logs.',
    safetyStatus: 'Highly Secure (Regulated)'
  },
  {
    slug: 'platinum',
    name: 'Platinum Credit Uganda',
    category: 'Microfinance Institution',
    interestRate: 18,
    feeAmount: 40000,
    repaymentPeriodDays: 120,
    trustScore: 4.1,
    license: 'UMRA Registered',
    licenseColor: 'text-teal-700 border-teal-200 bg-teal-50',
    loanRange: 'UGX 300,000 - 8,000,000',
    description: 'Provides quick civil servant logbook and salary loans. High limits with quick turnarounds.',
    privacyNote: 'Salary deduction agreements or logbook title transfers required.',
    safetyStatus: 'Safe (Contractual)'
  },
  {
    slug: 'tugende',
    name: 'Tugende Lease Finance',
    category: 'Asset Financer',
    interestRate: 22,
    feeAmount: 60000,
    repaymentPeriodDays: 180,
    trustScore: 4.0,
    license: 'Asset Lease Licenced',
    licenseColor: 'text-amber-700 border-amber-205 bg-amber-50',
    loanRange: 'UGX 800,000 - 6,000,000',
    description: 'Ownership path lease financing for boda motorcycles, engines, and agricultural gear.',
    privacyNote: 'Asset tracking enabled. Mandatory insurance packages bundled into weekly fees.',
    safetyStatus: 'Safe (Lease Option)'
  },
  {
    slug: 'zuricash',
    name: 'Zuri Cash Mobile',
    category: 'Fintech Mobile app',
    interestRate: 28,
    feeAmount: 35000,
    repaymentPeriodDays: 14,
    trustScore: 3.2,
    license: 'Unregulated Web Platform',
    licenseColor: 'text-rose-700 border-rose-200 bg-rose-50',
    loanRange: 'UGX 30,000 - 300,000',
    description: 'Short-term high interest mobile credit app. Quick payouts but aggressive penalties.',
    privacyNote: 'Aggressive data scraping; contacts and photo galleries are uploaded to external databases.',
    safetyStatus: 'High Risk (Predatory Warnings)'
  }
];

export default function LendersDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fintech Mobile app', 'Microfinance Institution', 'Asset Financer'];

  const filteredLenders = allLenders.filter((lender) => {
    const matchesSearch = lender.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lender.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || lender.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Award className="h-6 w-6 text-teal-600" />
            Lender Registry & Transparency Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified regulatory credentials, license tiers, privacy disclosures, and standard cost structures.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search lenders by name or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500/50"
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
                  ? 'bg-teal-50 text-teal-700 border-teal-200 shadow-sm'
                  : 'bg-slate-100/40 text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
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
          <Card key={lender.slug} className="bg-white border-slate-200 hover:border-slate-300/80 shadow-md transition-all duration-300 flex flex-col justify-between">
            <CardHeader className="border-b border-slate-100 py-4 px-5 flex flex-row items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-teal-600">
                  <Landmark className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-sm text-slate-800">{lender.name}</h3>
                  <p className="text-[10px] text-slate-500 font-semibold">{lender.category}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${lender.licenseColor}`}>
                  {lender.license}
                </span>
                <div className="flex items-center gap-0.5 text-[10px]">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-550" />
                  <span className="font-bold text-slate-700">{lender.trustScore}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4 flex-grow flex flex-col justify-between">
              
              {/* Description & Details */}
              <div className="space-y-3.5">
                <p className="text-xs text-slate-650 leading-relaxed">
                  {lender.description}
                </p>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px]">
                  <div>
                    <span className="text-slate-400 uppercase tracking-wide text-[9px] block">Baseline Cost Structure</span>
                    <strong className="text-slate-750">{lender.interestRate}% Interest | UGX {lender.feeAmount.toLocaleString()} Fee</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wide text-[9px] block">Standard Loan Range</span>
                    <strong className="text-slate-750">{lender.loanRange}</strong>
                  </div>
                </div>
              </div>

              {/* Warnings and Disclosures */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-[11px]">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-slate-600 leading-normal">
                    <strong className="text-slate-800">Privacy Disclosure:</strong> {lender.privacyNote}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 uppercase tracking-wider">Safety Status:</span>
                  <span className={
                    lender.safetyStatus.includes('Risk') ? 'text-rose-600' : 
                    lender.safetyStatus.includes('Caution') ? 'text-amber-600' : 'text-emerald-600'
                  }>
                    {lender.safetyStatus}
                  </span>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}

        {filteredLenders.length === 0 && (
          <div className="col-span-2 py-12 text-center space-y-2 bg-slate-100 border border-slate-200 rounded-2xl">
            <ShieldAlert className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No lenders found matching search criteria.</p>
            <p className="text-xs text-slate-500">Try modifying your text query or selected category filter.</p>
          </div>
        )}
      </div>

    </div>
  );
}
