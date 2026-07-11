function calculateTotalRepayment({ loanAmount, feeAmount, interestRate }) {
  return loanAmount + feeAmount + (loanAmount * interestRate / 100);
}

function calculateCostOfBorrowingPct({ loanAmount, totalRepayment }) {
  return ((totalRepayment - loanAmount) / loanAmount) * 100;
}

function calculateDebtBurdenRatio({
  totalRepayment, repaymentPeriodDays, existingDebtRepayment, monthlyIncome
}) {
  const newLoanMonthlyCost = totalRepayment / (repaymentPeriodDays / 30);
  return ((existingDebtRepayment + newLoanMonthlyCost) / monthlyIncome) * 100;
}

function classifyRisk(debtBurdenRatio) {
  if (debtBurdenRatio <= 40) return 'safe';
  if (debtBurdenRatio <= 60) return 'caution';
  return 'high_risk';
}

function buildRecommendation(riskLevel, { monthlyIncome, existingDebtRepayment }) {
  const safeMonthlyCapacity = monthlyIncome * 0.4 - existingDebtRepayment;
  switch (riskLevel) {
    case 'safe':
      return 'This loan appears manageable based on your current income and obligations.';
    case 'caution':
      return 'This loan may create financial pressure. Consider a smaller amount or longer term.';
    case 'high_risk':
    default:
      return `This loan is likely to cause repayment stress. A safer monthly repayment capacity is approximately UGX ${Math.max(safeMonthlyCapacity, 0).toFixed(0)}.`;
  }
}

function buildReasoning({ debtBurdenRatio, costOfBorrowingPct, existingDebtRepayment }) {
  const reasons = [];
  reasons.push(`Your repayment takes ${debtBurdenRatio.toFixed(0)}% of your income`);
  if (costOfBorrowingPct > 10) reasons.push('Loan cost is above the recommended level');
  if (existingDebtRepayment > 0) reasons.push('You already have an existing active loan');
  return reasons;
}

module.exports = {
  calculateTotalRepayment,
  calculateCostOfBorrowingPct,
  calculateDebtBurdenRatio,
  classifyRisk,
  buildRecommendation,
  buildReasoning,
};
