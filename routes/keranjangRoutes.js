const express = require('express');
const router = express.Router();
const keranjangController = require('../controllers/KeranjangController');



router.post('/keranjang', keranjangController.addToCart);
router.get('/keranjang', keranjangController.getCartItems);
router.get('/keranjang/:id', keranjangController.getCartItemById);
router.put('/keranjang/:id', keranjangController.updateCartItem);
router.delete('/keranjang/:id', keranjangController.removeCartItem);

module.exports = router;
