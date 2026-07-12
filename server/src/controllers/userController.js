const User = require('../models/User');
const Assessment = require('../models/Assessment');

exports.getDemoUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: 'demo@credicheck.com' });
    if (!user) {
      user = await User.create({ name: 'Demo User', email: 'demo@credicheck.com' });
    }
    res.status(200).json({ userId: user._id, name: user.name });
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('loanAmount riskLevel createdAt totalRepayment');

    res.status(200).json({
      count: assessments.length,
      assessments: assessments.map((a) => ({
        id: a._id,
        loanAmount: a.loanAmount,
        riskLevel: a.riskLevel,
        totalRepayment: a.totalRepayment,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};
