const Assessment = require('../models/Assessment');
const {
  calculateTotalRepayment,
  calculateCostOfBorrowingPct,
  calculateDebtBurdenRatio,
  classifyRisk,
  buildRecommendation,
  buildReasoning,
} = require('../services/loanAssessmentService');

exports.analyzeLoan = async (req, res, next) => {
  try {
    const {
      userId,
      loanAmount,
      feeAmount,
      interestRate,
      repaymentPeriodDays,
      monthlyIncome,
      existingDebtRepayment = 0,
    } = req.body;

    const totalRepayment = calculateTotalRepayment({ loanAmount, feeAmount, interestRate });
    const costOfBorrowingPct = calculateCostOfBorrowingPct({ loanAmount, totalRepayment });
    const debtBurdenRatio = calculateDebtBurdenRatio({
      totalRepayment,
      repaymentPeriodDays,
      existingDebtRepayment,
      monthlyIncome,
    });
    const riskLevel = classifyRisk(debtBurdenRatio);
    const recommendationText = buildRecommendation(riskLevel, { monthlyIncome, existingDebtRepayment });
    const reasoning = buildReasoning({ debtBurdenRatio, costOfBorrowingPct, existingDebtRepayment });

    const assessment = await Assessment.create({
      user: userId,
      loanAmount,
      feeAmount,
      interestRate,
      repaymentPeriodDays,
      monthlyIncome,
      existingDebtRepayment,
      totalRepayment,
      costOfBorrowingPct,
      debtBurdenRatio,
      riskLevel,
      recommendationText,
    });

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const recentCount = await Assessment.countDocuments({
      user: userId,
      createdAt: { $gte: ninetyDaysAgo },
    });
    const patternWarning = recentCount >= 3
      ? `You have made ${recentCount} loan checks in the last 90 days. Your borrowing frequency is increasing.`
      : null;

    const plainLanguageSummary = `You are borrowing UGX ${loanAmount.toLocaleString()} but will repay UGX ${totalRepayment.toLocaleString()} within ${repaymentPeriodDays} days.`;

    res.status(201).json({
      assessmentId: assessment._id,
      totalRepayment,
      costOfBorrowingPct,
      debtBurdenRatio,
      riskLevel,
      plainLanguageSummary,
      reasoning,
      recommendationText,
      patternWarning,
    });
  } catch (err) {
    next(err);
  }
};

exports.getLoanReport = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const plainLanguageSummary = `You are borrowing UGX ${assessment.loanAmount.toLocaleString()} but will repay UGX ${assessment.totalRepayment.toLocaleString()} within ${assessment.repaymentPeriodDays} days.`;
    const reasoning = buildReasoning({
      debtBurdenRatio: assessment.debtBurdenRatio,
      costOfBorrowingPct: assessment.costOfBorrowingPct,
      existingDebtRepayment: assessment.existingDebtRepayment,
    });

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const recentCount = await Assessment.countDocuments({
      user: assessment.user,
      createdAt: { $gte: ninetyDaysAgo },
    });
    const patternWarning = recentCount >= 3
      ? `You have made ${recentCount} loan checks in the last 90 days. Your borrowing frequency is increasing.`
      : null;

    res.status(200).json({
      assessmentId: assessment._id,
      totalRepayment: assessment.totalRepayment,
      costOfBorrowingPct: assessment.costOfBorrowingPct,
      debtBurdenRatio: assessment.debtBurdenRatio,
      riskLevel: assessment.riskLevel,
      plainLanguageSummary,
      reasoning,
      recommendationText: assessment.recommendationText,
      patternWarning,
    });
  } catch (err) {
    next(err);
  }
};
