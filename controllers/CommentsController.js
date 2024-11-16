const { Comment, ProdukSepatu, User } = require('../models');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { product_id, user_id, comment_text } = req.body;

    // Validate if the product exists
    const product = await ProdukSepatu.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create the comment
    const newComment = await Comment.create({
      product_id,
      user_id, // Can be null for anonymous comments
      comment_text,
    });

    res.status(200).json({
      message: 'Comment added successfully',
      comment: newComment,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get all comments for a product
const getCommentsByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    // Fetch all comments for the given product
    const comments = await Comment.findAll({
      where: { product_id },
      include: [{ model: User, attributes: ['id', 'fullName'] }],
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the comment
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Delete the comment
    await comment.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

module.exports = {
  createComment,
  getCommentsByProduct,
  deleteComment,
};
