const { body, validationResult } = require('express-validator');

const validateLoanInput = [
  body('userId')
    .isString()
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('userId must be a valid Mongo ObjectId'),
  body('loanAmount')
    .isNumeric()
    .withMessage('loanAmount is required and must be a positive number')
    .custom((val) => val > 0)
    .withMessage('loanAmount must be a positive number'),
  body('feeAmount')
    .isNumeric()
    .withMessage('feeAmount is required and must be a positive number')
    .custom((val) => val >= 0)
    .withMessage('feeAmount must be non-negative'),
  body('interestRate')
    .isNumeric()
    .withMessage('interestRate is required and must be a positive number')
    .custom((val) => val > 0)
    .withMessage('interestRate must be a positive number'),
  body('repaymentPeriodDays')
    .isInt({ min: 1 })
    .withMessage('repaymentPeriodDays is required and must be a positive integer'),
  body('monthlyIncome')
    .isNumeric()
    .withMessage('monthlyIncome is required and must be a positive number')
    .custom((val) => val > 0)
    .withMessage('monthlyIncome must be a positive number'),
  body('existingDebtRepayment')
    .optional()
    .isNumeric()
    .withMessage('existingDebtRepayment must be a number')
    .custom((val) => val >= 0)
    .withMessage('existingDebtRepayment must be non-negative'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }
    next();
  },
];

module.exports = validateLoanInput;
