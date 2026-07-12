import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

export default function AcknowledgeQuizStep({ assessment, onCorrectSelected, onSuccess, onFailure }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const correct = assessment.totalRepayment;
    
    // Generate some incorrect option values
    const opt1 = correct + 150000;
    const opt2 = correct - 50000 > assessment.loanAmount ? correct - 50000 : correct + 75000;
    const opt3 = assessment.loanAmount; // common misunderstanding: thinking they only pay back what they borrowed

    // Shuffle options
    const list = [correct, opt1, opt2, opt3]
      .filter((v, i, self) => self.indexOf(v) === i) // remove duplicates
      .map(val => ({
        val,
        isCorrect: val === correct,
        label: `UGX ${Math.round(val).toLocaleString()}`
      }));
    
    // Sort randomly
    list.sort(() => Math.random() - 0.5);
    setOptions(list);

    // Make sure sidebar starts as blinded
    onCorrectSelected(false);
  }, [assessment, onCorrectSelected]);

  const handleSelectOption = (opt) => {
    if (error) return;
    setSelectedOption(opt);
    // Tell parent to unblind if this option is correct, otherwise keep it blinded
    onCorrectSelected(opt.isCorrect);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    if (selectedOption.isCorrect) {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <Card className="bg-white border-slate-200 shadow-sm animate-slideUp">
      <CardHeader className="border-b border-slate-100 py-4 px-6">
        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-teal-600" />
          Comprehension Verification
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-5">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Verification Quiz</h4>
          <p className="text-xs text-slate-500 leading-normal">
            To protect your finances, our system requires you to confirm the exact commitment. 
            <strong> What is the total repayment amount you must pay back to the lender?</strong>
          </p>
        </div>

        {/* Modal Pop-up Overlay for Incorrect Selection - Requires user action */}
        {error && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white border border-rose-200 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-slideUp">
              <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Comprehension Check Failed</h3>
                <p className="text-xs text-slate-550 leading-normal">
                  It appears you did not capture the actual cost of this loan. Before borrowing, it is vital that you are fully aware of your financial obligations.
                </p>
              </div>
              
              <Button
                onClick={onFailure}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3.5 rounded-xl border-0 flex items-center justify-center gap-2 mt-4 hover:scale-[1.01] transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                Start Afresh
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {options.map((opt, idx) => (
            <div 
              key={idx}
              onClick={() => handleSelectOption(opt)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 text-sm font-semibold select-none flex items-center justify-between ${
                selectedOption?.val === opt.val
                  ? 'bg-teal-50/20 border-teal-500/80 shadow-sm text-teal-700' 
                  : 'bg-white border-slate-200 hover:bg-slate-50/40 text-slate-750'
              } ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>{opt.label}</span>
              <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                selectedOption?.val === opt.val ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
              }`}>
                {selectedOption?.val === opt.val && <span className="h-1.5 w-1.5 rounded-full bg-white"></span>}
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={selectedOption === null || error !== null}
          className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm py-5 rounded-xl border-0 shadow-md shadow-teal-100/50 hover:scale-[1.01] transition-all disabled:opacity-40 disabled:scale-100 mt-4"
        >
          Complete
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
