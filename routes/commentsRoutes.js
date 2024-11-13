const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByProduct,
  deleteComment
} = require('../controllers/CommentsController');

// Route to create a comment
router.post('/comments', createComment);

// Route to get all comments for a product
router.get('/comments/product/:product_id', getCommentsByProduct);

// Route to delete a comment
router.delete('/comments/:id', deleteComment);

module.exports = router;
