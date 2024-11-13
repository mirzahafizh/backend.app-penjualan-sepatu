const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/WishlistController');



router.post('/wishlist',wishlistController.addToWishlist);
router.get('/wishlist', wishlistController.getWishlistByUserId);
router.delete('/wishlist/:id',wishlistController.removeWishlistItem);

module.exports = router;