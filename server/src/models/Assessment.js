const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loanAmount: { type: Number, required: true },
    feeAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    repaymentPeriodDays: { type: Number, required: true },
    monthlyIncome: { type: Number, required: true },
    existingDebtRepayment: { type: Number, default: 0 },
    totalRepayment: { type: Number },
    costOfBorrowingPct: { type: Number },
    debtBurdenRatio: { type: Number },
    riskLevel: { type: String, enum: ['safe', 'caution', 'high_risk'] },
    recommendationText: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
