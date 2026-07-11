const express = require('express');
const router = express.Router();
const lenderController = require('../controllers/lenderController');

router.get('/', lenderController.getLenders);

module.exports = router;
