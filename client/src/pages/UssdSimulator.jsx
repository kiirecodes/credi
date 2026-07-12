import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Phone } from 'lucide-react';

const USSD_CODE = '*777#';
const menuOptions = [
  { id: 'audit', label: 'Safety Audit Console', description: 'Run the borrow affordability inspection.' },
  { id: 'directory', label: 'Lenders Directory', description: 'Browse regulated lender profiles.' },
  { id: 'tips', label: 'Quick Loan Safety Tips', description: 'Get short borrower protection advice.' },
  { id: 'exit', label: 'Exit USSD', description: 'Return to the main workspace.' },
];

const loanProviders = [
  {
    id: 'provider-1',
    name: 'Kampala Credit',
    interestRate: 4.8,
    feeAmount: 12000,
    trustScore: 87,
    summary: 'Flexible salary-backed loan with clear fees.',
  },
  {
    id: 'provider-2',
    name: 'Safari Finance',
    interestRate: 6.2,
    feeAmount: 8500,
    trustScore: 81,
    summary: 'Short-term loan for small business expenses.',
  },
  {
    id: 'provider-3',
    name: 'Bantu Lend',
    interestRate: 5.4,
    feeAmount: 14000,
    trustScore: 92,
    summary: 'Trusted lender with fast approval and support.',
  },
];

export default function UssdSimulator({ onNavigate }) {
  const [code, setCode] = useState('');
  const [screen, setScreen] = useState('dial');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(null);
  const [loanAmount, setLoanAmount] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [menuInput, setMenuInput] = useState('');
  const [error, setError] = useState(null);

  const dial = (event) => {
    event.preventDefault();
    if (code.trim() === USSD_CODE) {
      setScreen('menu');
      setSelectedOption(null);
      setSelectedProviderIndex(null);
      setLoanAmount('');
      setMonthlyIncome('');
      setMenuInput('');
      setError(null);
      return;
    }
    setError('Invalid USSD code. Please enter *777# to begin.');
  };

  const chooseOption = (id) => {
    if (id === 'exit') {
      setScreen('dial');
      setCode('');
      setSelectedOption(null);
      setSelectedProviderIndex(null);
      setLoanAmount('');
      setMonthlyIncome('');
      setMenuInput('');
      setError(null);
      return;
    }

    setSelectedOption(id);
    setSelectedProviderIndex(null);
    setLoanAmount('');
    setMonthlyIncome('');
    setMenuInput('');
    setError(null);
    setScreen('provider');
  };

  const handleMenuSubmit = (event) => {
    event.preventDefault();
    const trimmed = menuInput.trim();
    if (!trimmed) {
      setError('Please enter a menu number.');
      return;
    }

    const choice = menuOptions.find(
      (option, index) => String(index + 1) === trimmed || (option.id === 'exit' && trimmed === '0')
    );
    if (!choice) {
      setError('Invalid selection. Use 1, 2, 3 or 0 to exit.');
      return;
    }

    setError(null);
    chooseOption(choice.id);
  };

  const handleProviderSubmit = (event) => {
    event.preventDefault();
    const trimmed = menuInput.trim();
    if (!trimmed) {
      setError('Please enter a provider number.');
      return;
    }

    const index = Number(trimmed) - 1;
    if (Number.isNaN(index) || index < 0 || index >= loanProviders.length) {
      setError('Invalid provider selection. Choose a valid number.');
      return;
    }

    setSelectedProviderIndex(index);
    setMenuInput('');
    setError(null);
    setScreen('amount');
  };

  const handleAmountSubmit = (event) => {
    event.preventDefault();
    const amount = Number(menuInput.trim());
    if (!amount || amount <= 0) {
      setError('Please enter a valid loan amount.');
      return;
    }

    setLoanAmount(amount);
    setMenuInput('');
    setError(null);
    setScreen('income');
  };

  const handleIncomeSubmit = (event) => {
    event.preventDefault();
    const income = Number(menuInput.trim());
    if (!income || income <= 0) {
      setError('Please enter a valid monthly income amount.');
      return;
    }

    setMonthlyIncome(income);
    setMenuInput('');
    setError(null);
    setScreen('summary');
  };

  const selectedProvider = loanProviders[selectedProviderIndex] || null;
  const selectedMenu = menuOptions.find((option) => option.id === selectedOption);
  const currentTitle = selectedMenu?.label ?? 'USSD Menu';

  const providerSummary = selectedProvider
    ? {
        monthlyPayment: Math.ceil((loanAmount * (1 + selectedProvider.interestRate / 100)) / 12),
        impactRatio: monthlyIncome
          ? Math.round((Math.ceil((loanAmount * (1 + selectedProvider.interestRate / 100)) / 12) / monthlyIncome) * 100)
          : null,
      }
    : null;

  const optionPayload = () => {
    switch (selectedOption) {
      case 'audit':
        return {
          title: 'Safety Audit Console',
          body: [
            'Review borrower affordability and repayment safety guidance directly in this console.',
            'The audit flow remains in USSD until you finish the process or return to the main menu.',
            'Continue to choose a loan provider, enter amount and income, then view a payment summary.',
          ],
        };
      case 'directory':
        return {
          title: 'Lenders Directory',
          body: [
            'Browse verified lender profiles and cost indicators in this streamlined console view.',
            'The directory experience stays within this USSD session.',
            'Choose a provider, enter an amount and income, then review the payment impact.',
          ],
        };
      case 'tips':
        return {
          title: 'Loan Safety Tips',
          body: [
            '1) Confirm the full cost of interest plus fees before accepting a loan.',
            '2) Avoid rollover loans and high-frequency short-term credit.',
            '3) Prefer regulated lenders with clear license disclosures.',
            'After reviewing tips, choose a provider and continue the session to see payment impact.',
          ],
        };
      default:
        return null;
    }
  };

  const result = optionPayload();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-[32px] border border-slate-800 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.55)] overflow-hidden">
        <div className="bg-slate-900/95 border-b border-slate-800 px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-slate-500">USSD Console</div>
            <div className="mt-1 text-sm font-semibold text-white">Dial {USSD_CODE}</div>
          </div>
          <div className="rounded-full border border-slate-800 px-3 py-1 text-[11px] text-slate-400 flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-teal-400" />
            <span>*777#</span>
          </div>
        </div>

        <div className="p-5 space-y-6 bg-slate-950">
          {screen === 'dial' && (
            <form onSubmit={dial} className="space-y-4">
              <div className="text-slate-400 text-sm">Enter the USSD code below to begin:</div>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="*777#"
                className="bg-slate-900 border-slate-800 text-slate-100"
                inputMode="text"
              />
              {error && <div className="text-rose-400 text-sm">{error}</div>}
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-500">
                Dial Now
              </Button>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                The simulator supports short-code access just like mobile money phones. Use *777# to open the safety menu.
              </div>
            </form>
          )}

          {screen === 'menu' && (
            <div className="space-y-4">
              <div className="text-slate-300 text-sm font-semibold">USSD Main Menu</div>
              <div className="grid gap-3">
                {menuOptions.map((option, index) => (
                  <div
                    key={option.id}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-left text-sm text-slate-100"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{index + 1}. {option.label}</span>
                      <span className="text-slate-500 text-[11px]">{option.id === 'exit' ? '0' : index + 1}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-1">{option.description}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleMenuSubmit} className="space-y-3">
                <div className="text-slate-400 text-sm">Enter the menu number to continue:</div>
                <Input
                  value={menuInput}
                  onChange={(e) => setMenuInput(e.target.value)}
                  placeholder="1"
                  className="bg-slate-900 border-slate-800 text-slate-100"
                  inputMode="numeric"
                  maxLength={1}
                />
                {error && <div className="text-rose-400 text-sm">{error}</div>}
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-500">
                  Send
                </Button>
              </form>
              <div className="text-[11px] text-slate-500">Enter the numeric choice just like mobile money. Use 0 to exit.</div>
            </div>
          )}

          {screen === 'provider' && (
            <div className="space-y-4">
              <div className="text-slate-300 text-sm font-semibold">Choose a Loan Provider</div>
              <div className="grid gap-3">
                {loanProviders.map((provider, index) => (
                  <div key={provider.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-sm text-slate-100">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{index + 1}. {provider.name}</span>
                      <span className="text-slate-500 text-[11px]">Score {provider.trustScore}%</span>
                    </div>
                    <div className="mt-2 text-slate-400 text-xs leading-relaxed">{provider.summary}</div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div>Rate {provider.interestRate}%</div>
                      <div>Fee USh {provider.feeAmount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleProviderSubmit} className="space-y-3">
                <div className="text-slate-400 text-sm">Enter provider number to continue:</div>
                <Input
                  value={menuInput}
                  onChange={(e) => setMenuInput(e.target.value)}
                  placeholder="1"
                  className="bg-slate-900 border-slate-800 text-slate-100"
                  inputMode="numeric"
                  maxLength={1}
                />
                {error && <div className="text-rose-400 text-sm">{error}</div>}
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-500">
                  Select Provider
                </Button>
              </form>
            </div>
          )}

          {screen === 'amount' && (
            <div className="space-y-4">
              <div className="text-slate-300 text-sm font-semibold">Enter Loan Amount</div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-sm text-slate-100">
                <div>{selectedProvider?.name}</div>
                <div className="mt-2 text-slate-400 text-xs">Rate {selectedProvider?.interestRate}% fee USh {selectedProvider?.feeAmount.toLocaleString()}</div>
              </div>
              <form onSubmit={handleAmountSubmit} className="space-y-3">
                <div className="text-slate-400 text-sm">Enter loan amount in UGX:</div>
                <Input
                  value={menuInput}
                  onChange={(e) => setMenuInput(e.target.value)}
                  placeholder="1000000"
                  className="bg-slate-900 border-slate-800 text-slate-100"
                  inputMode="numeric"
                />
                {error && <div className="text-rose-400 text-sm">{error}</div>}
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-500">
                  Continue
                </Button>
              </form>
            </div>
          )}

          {screen === 'income' && (
            <div className="space-y-4">
              <div className="text-slate-300 text-sm font-semibold">Enter Monthly Income</div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-sm text-slate-100">
                <div>{selectedProvider?.name}</div>
                <div className="mt-2 text-slate-400 text-xs">Loan USh {Number(loanAmount).toLocaleString()}</div>
              </div>
              <form onSubmit={handleIncomeSubmit} className="space-y-3">
                <div className="text-slate-400 text-sm">Enter monthly income in UGX:</div>
                <Input
                  value={menuInput}
                  onChange={(e) => setMenuInput(e.target.value)}
                  placeholder="4000000"
                  className="bg-slate-900 border-slate-800 text-slate-100"
                  inputMode="numeric"
                />
                {error && <div className="text-rose-400 text-sm">{error}</div>}
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-500">
                  Continue
                </Button>
              </form>
            </div>
          )}

          {screen === 'summary' && selectedProvider && (
            <div className="space-y-5">
              <div className="text-slate-300 text-sm font-semibold">Loan Payment Summary</div>
              <div className="rounded-3xl border border-slate-900 bg-slate-900/80 p-4 text-sm text-slate-300 space-y-3">
                <div className="flex justify-between text-slate-400"><span>Provider</span><span>{selectedProvider.name}</span></div>
                <div className="flex justify-between"><span>Loan amount</span><span>USh {Number(loanAmount).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Interest rate</span><span>{selectedProvider.interestRate}%</span></div>
                <div className="flex justify-between"><span>Fee</span><span>USh {selectedProvider.feeAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Monthly payment</span><span>USh {providerSummary.monthlyPayment.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Income impact</span><span>{providerSummary.impactRatio}% of income</span></div>
              </div>
              <div className="rounded-3xl border border-slate-900 bg-slate-900/80 p-4 text-sm text-slate-300">
                <p>Advice: Keep your payment below 40% of income. If the ratio is high, reduce the loan amount or choose another provider.</p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <Button type="button" variant="outline" onClick={() => setScreen('menu')} className="flex-1 border-slate-700 text-slate-200 hover:bg-slate-900">
                  Back to Menu
                </Button>
                <Button type="button" className="flex-1 bg-teal-600 hover:bg-teal-500" onClick={() => setScreen('disbursement')}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {screen === 'disbursement' && (
            <div className="space-y-5">
              <div className="text-slate-300 text-sm font-semibold">Loan Disbursement</div>
              <div className="rounded-3xl border border-slate-900 bg-slate-900/80 p-4 text-sm text-slate-300">
                <p>Please wait. You are being redirected to loan disbursement.</p>
              </div>
              <Button type="button" variant="outline" onClick={() => setScreen('menu')} className="w-full border-slate-700 text-slate-200 hover:bg-slate-900">
                Back to Menu
              </Button>
            </div>
          )}

          {screen === 'result' && result && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">{result.title}</h2>
                  <p className="text-slate-500 text-sm mt-1">The session remains in console mode. Use the menu or end the session when complete.</p>
                </div>
                <ShieldCheck className="h-6 w-6 text-teal-400" />
              </div>

              <div className="space-y-3 rounded-3xl border border-slate-900 bg-slate-900/80 p-4 text-sm text-slate-300">
                {result.body.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <Button type="button" variant="outline" onClick={() => setScreen('menu')} className="flex-1 border-slate-700 text-slate-200 hover:bg-slate-900">
                  Back to Menu
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setScreen('dial');
                    setCode('');
                    setMenuInput('');
                    setSelectedOption(null);
                    setError(null);
                  }}
                  className="flex-1 border-slate-700 text-slate-200 hover:bg-slate-900"
                >
                  End Session
                </Button>
              </div>
            </div>
          )}

          {screen !== 'dial' && (
            <div className="border-t border-slate-900 pt-4 text-[11px] text-slate-500">
              Tip: This USSD view is a small-phone simulator for the same borrower safety flow you get on the web console.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
