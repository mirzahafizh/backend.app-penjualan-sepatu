const express = require('express');
const router = express.Router();
const likesController = require('../controllers/LikeController');

// Like a product
router.post('/products/:productId/like', likesController.likeProduct);

// Unlike a product
router.post('/products/:productId/unlike', likesController.unlikeProduct);

// Get total likes for a product
router.get('/products/:productId/likes', likesController.getTotalLikes);

module.exports = router;
