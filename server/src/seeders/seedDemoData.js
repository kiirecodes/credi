const mongoose = require('mongoose');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
require('dotenv').config();

const seedDemoData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Assessment.deleteMany({});
    await User.deleteMany({});

    const user = await User.create({
      name: 'Demo User',
      email: 'demo@credicheck.com',
    });

    console.log(`Demo user created with ID: ${user._id}`);

    const demoAssessments = [
      {
        user: user._id,
        loanAmount: 200000,
        feeAmount: 10000,
        interestRate: 5,
        repaymentPeriodDays: 60,
        monthlyIncome: 800000,
        existingDebtRepayment: 0,
        totalRepayment: 220000,
        costOfBorrowingPct: 10,
        debtBurdenRatio: 13.75,
        riskLevel: 'safe',
        recommendationText: 'This loan appears manageable based on your current income and obligations.',
      },
      {
        user: user._id,
        loanAmount: 300000,
        feeAmount: 30000,
        interestRate: 10,
        repaymentPeriodDays: 30,
        monthlyIncome: 600000,
        existingDebtRepayment: 100000,
        totalRepayment: 360000,
        costOfBorrowingPct: 20,
        debtBurdenRatio: 76.67,
        riskLevel: 'high_risk',
        recommendationText: 'This loan is likely to cause repayment stress. A safer monthly repayment capacity is approximately UGX 140000.',
      },
      {
        user: user._id,
        loanAmount: 150000,
        feeAmount: 15000,
        interestRate: 8,
        repaymentPeriodDays: 30,
        monthlyIncome: 500000,
        existingDebtRepayment: 50000,
        totalRepayment: 177000,
        costOfBorrowingPct: 18,
        debtBurdenRatio: 47.4,
        riskLevel: 'caution',
        recommendationText: 'This loan may create financial pressure. Consider a smaller amount or longer term.',
      },
    ];

    await Assessment.insertMany(demoAssessments);
    console.log(`Created ${demoAssessments.length} demo assessments`);
    console.log('Demo data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDemoData();
