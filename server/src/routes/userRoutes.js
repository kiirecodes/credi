const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id/history', userController.getHistory);

module.exports = router;
