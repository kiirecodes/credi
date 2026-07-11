const express = require('express');
const router = express.Router();
const validateLoanInput = require('../middleware/validateLoanInput');
const loanController = require('../controllers/loanController');

router.post('/analyze', validateLoanInput, loanController.analyzeLoan);
router.get('/:id', loanController.getLoanReport);

module.exports = router;
