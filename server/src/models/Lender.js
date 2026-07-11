const mongoose = require('mongoose');

const lenderSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    category: { type: String, required: true },
    interestRate: { type: Number, required: true },
    feeAmount: { type: Number, required: true },
    repaymentPeriodDays: { type: Number, required: true },
    trustScore: { type: Number, required: true },
    badge: { type: String, required: true },
    color: { type: String, required: true },
    license: { type: String, required: true },
    licenseColor: { type: String, required: true },
    loanRange: { type: String, required: true },
    description: { type: String, required: true },
    privacyNote: { type: String, required: true },
    safetyStatus: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lender', lenderSchema);
