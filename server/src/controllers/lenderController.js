const Lender = require('../models/Lender');

exports.getLenders = async (req, res, next) => {
  try {
    const lenders = await Lender.find().sort({ name: 1 });
    res.status(200).json({ lenders });
  } catch (err) {
    next(err);
  }
};
