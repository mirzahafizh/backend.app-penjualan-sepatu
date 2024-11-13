const { Like, ProdukSepatu, User } = require('../models');

// Like a product
const likeProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.body.userId || null; // Optional: Get the userId from the request body (if you have users)

        const product = await ProdukSepatu.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the user has already liked this product (optional, if user-based)
        const existingLike = await Like.findOne({
            where: { product_id: productId, user_id: userId }
        });

        if (existingLike) {
            return res.status(400).json({ error: 'You have already liked this product' });
        }

        // Create a new like
        await Like.create({
            product_id: productId,
            user_id: userId
        });

        res.status(201).json({ message: 'Product liked successfully' });
    } catch (error) {
        console.error('Error liking product:', error);
        res.status(500).json({ error: 'Failed to like product' });
    }
};

// Unlike a product
const unlikeProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.body.userId || null; // Optional: Get the userId from the request body

        const product = await ProdukSepatu.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Find the like
        const like = await Like.findOne({
            where: { product_id: productId, user_id: userId }
        });

        if (!like) {
            return res.status(404).json({ error: 'Like not found' });
        }

        // Delete the like
        await like.destroy();

        res.status(200).json({ message: 'Product unliked successfully' });
    } catch (error) {
        console.error('Error unliking product:', error);
        res.status(500).json({ error: 'Failed to unlike product' });
    }
};

// Get total likes for a product
const getTotalLikes = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await ProdukSepatu.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Count the number of likes for the product
        const totalLikes = await Like.count({
            where: { product_id: productId }
        });

        res.status(200).json({
            productId,
            totalLikes
        });
    } catch (error) {
        console.error('Error fetching total likes:', error);
        res.status(500).json({ error: 'Failed to fetch total likes' });
    }
};

module.exports = {
    likeProduct,
    unlikeProduct,
    getTotalLikes
};
