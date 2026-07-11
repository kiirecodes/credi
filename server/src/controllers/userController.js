const Assessment = require('../models/Assessment');

exports.getHistory = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('loanAmount riskLevel createdAt');

    res.status(200).json({
      count: assessments.length,
      assessments: assessments.map((a) => ({
        id: a._id,
        loanAmount: a.loanAmount,
        riskLevel: a.riskLevel,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};
