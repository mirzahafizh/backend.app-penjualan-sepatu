const multer = require('multer');
const upload = multer(); // Use memory storage or configure disk storage

// In your routes file
const express = require('express');
const router = express.Router();
const produkSepatuController = require('../controllers/ProdukController');

router.post('/produk-sepatu', upload.single('image'), produkSepatuController.createShoeProduct);
router.put('/produk-sepatu/:id', upload.single('image'), produkSepatuController.updateShoeProduct);
router.get('/produk-sepatu', produkSepatuController.getAllShoeProducts);
router.get('/produk-sepatu/:id', produkSepatuController.getShoeProductById);
router.delete('/produk-sepatu/:id', produkSepatuController.deleteShoeProduct);
// Routes for ratings
router.post('/produk-sepatu/:id/rating', produkSepatuController.rateShoeProduct);
router.get('/search', produkSepatuController.searchProducts);
module.exports = router;
