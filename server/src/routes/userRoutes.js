const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/demo', userController.getDemoUser);
router.get('/:id/history', userController.getHistory);

module.exports = router;
