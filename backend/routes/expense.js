const express = require('express');
const auth = require('../middleware/auth');
const { getExpenseSummary } = require('../controllers/expenseController');

const router = express.Router();

// Define the route to get the expense summary
router.get('/expense-summary', auth, getExpenseSummary);

module.exports = router;
