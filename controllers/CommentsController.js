const { Comment, ProdukSepatu, User, Transaksi } = require('../models');

// Create a new comment
const createComment = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug: Log request body

    const { product_id, user_id, comment_text, isRatingEnabled, orderId } = req.body;

    console.log('Validating if product exists...'); // Debug: Step log
    // Validate if the product exists
    const product = await ProdukSepatu.findByPk(product_id);
    if (!product) {
      console.log(`Product with id ${product_id} not found`); // Debug: Product not found
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Validating if order exists...'); // Debug: Step log
    // Validate if the order exists (optional, based on your logic)
    if (orderId) {
      const order = await Transaksi.findByPk(orderId);
      if (!order) {
        console.log(`Order with id ${orderId} not found`); // Debug: Order not found
        return res.status(404).json({ error: 'Order not found' });
      }
    }

    console.log('Creating a new comment...'); // Debug: Step log
    // Create the comment
    const newComment = await Comment.create({
      product_id,
      user_id, // Can be null for anonymous comments
      comment_text,
      isRatingEnabled: isRatingEnabled !== undefined ? isRatingEnabled : true, // Default to true if not provided
      orderId, // Optional, can be null if not provided
    });

    console.log('Comment created successfully:', newComment); // Debug: Log created comment

    // Jika berhasil, update `isRatingEnabled` di tabel Transaksi menjadi 0
    if (orderId) {
      const updatedOrder = await Transaksi.findByPk(orderId);
      if (updatedOrder) {
        // Update isRatingEnabled menjadi 0 di tabel Transaksi
        await updatedOrder.update({ isRatingEnabled: 0 });
        console.log(`Order with id ${orderId} updated: isRatingEnabled set to 0`);
      }
    }

    res.status(200).json({
      message: 'Comment added successfully',
      comment: newComment, // Return the created comment
    });
  } catch (error) {
    console.error('Error adding comment:'); // Debug: Log general error message
    console.error('Error type:', error.name); // Debug: Log error type (e.g., Sequelize error, Validation error)
    console.error('Error message:', error.message); // Debug: Log error message
    console.error('Error stack:', error.stack); // Debug: Log stack trace for deeper debugging

    // Jika gagal, pastikan `isRatingEnabled` tetap 1 pada response
    res.status(500).json({
      error: 'Failed to add comment',
      isRatingEnabled: 1, // Set `isRatingEnabled` to 1 in case of failure
    });
  }
};


// Get all comments for a product
const getCommentsByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    console.log('Fetching comments for product_id:', product_id); // Debug: Log product ID

    // Fetch all comments for the given product
    const comments = await Comment.findAll({
      where: { product_id },
      include: [
        {
          model: User,
          attributes: ['id', 'fullName'],
        },
      ],
    });

    if (comments.length === 0) {
      console.log(`No comments found for product_id ${product_id}`); // Debug: No comments found
      return res.status(404).json({ error: 'No comments found for this product' });
    }

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

    console.log('Fetching comment to delete with id:', id); // Debug: Log comment ID

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
