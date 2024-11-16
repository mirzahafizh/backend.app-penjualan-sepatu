const { Comment, ProdukSepatu, User } = require('../models');

// Create a new comment

// Create a new comment
const createComment = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug: Log request body

    const { product_id, user_id, comment_text } = req.body;

    console.log('Validating if product exists...'); // Debug: Step log
    // Validate if the product exists
    const product = await ProdukSepatu.findByPk(product_id);
    if (!product) {
      console.log(`Product with id ${product_id} not found`); // Debug: Product not found
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Creating a new comment...'); // Debug: Step log
    // Create the comment
    const newComment = await Comment.create({
      product_id,
      user_id, // Can be null for anonymous comments
      comment_text,
    });

    console.log('Comment created successfully:', newComment); // Debug: Log created comment
    res.status(200).json({
      message: 'Comment added successfully',
      comment: newComment,
    });
  } catch (error) {
    console.error('Error adding comment:'); // Debug: Log general error message
    console.error('Error type:', error.name); // Debug: Log error type (e.g., Sequelize error, Validation error)
    console.error('Error message:', error.message); // Debug: Log error message
    console.error('Error stack:', error.stack); // Debug: Log stack trace for deeper debugging

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
