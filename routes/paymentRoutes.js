const express = require('express');
const { chargePayment } = require('../controllers/PaymentController');

const router = express.Router();

router.post('/payment/charge', chargePayment);

module.exports = router;
