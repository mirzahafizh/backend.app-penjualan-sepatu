const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/TransaksiController');

// Protect routes

router.post('/transaksi', transaksiController.createTransaction);
router.get('/transaksi', transaksiController.getUserTransactions);
router.get('/transaksi/user/:userId', transaksiController.getTransactionByUserId);

router.put('/transaksi/:id', transaksiController.updateTransaction);
router.delete('/transaksi/:id', transaksiController.deleteTransaction);
module.exports = router;
