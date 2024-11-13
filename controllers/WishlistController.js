const { Wishlist, ProdukSepatu } = require('../models');

// Add item to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { produkSepatuId, userId } = req.body; // Get userId and produkSepatuId from the request body

        // Check if the product already exists in the wishlist
        const existingWishlistItem = await Wishlist.findOne({
            where: { userId, produkSepatuId },
        });

        if (existingWishlistItem) {
            return res.status(400).json({ error: 'Item already exists in wishlist' });
        }

        // Create a new wishlist item
        const newWishlistItem = await Wishlist.create({
            userId,
            produkSepatuId,
        });

        res.status(201).json(newWishlistItem);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
};

// Get wishlist by user ID
const getWishlistByUserId = async (req, res) => {
    try {
        const userId = req.query.userId; // Extract userId from query parameters
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const wishlistItems = await Wishlist.findAll({
            where: { userId },
            include: [
                {
                    model: ProdukSepatu,
                    as: 'produkSepatu',
                },
            ],
        });

        res.status(200).json(wishlistItems);
    } catch (error) {
        console.error('Error fetching wishlist items:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist items' });
    }
};

// Remove item from wishlist
const removeWishlistItem = async (req, res) => {
    try {
        const { id } = req.params; // Get the item ID from request parameters

        // Find the wishlist item using the provided id
        const wishlistItem = await Wishlist.findOne({
            where: { id }, // Assuming id is unique for wishlist items
        });

        // If the item is not found, return a 404 error
        if (!wishlistItem) {
            return res.status(404).json({ error: 'Wishlist item not found' });
        }

        // Remove the wishlist item from the database
        await wishlistItem.destroy();

        // Send a response with status 204 (No Content)
        res.status(200).send();
    } catch (error) {
        // Log the error for debugging
        console.error('Error removing wishlist item:', error);
        // Send a response with status 500 (Internal Server Error)
        res.status(500).json({ error: 'Failed to remove wishlist item' });
    }
};

module.exports = {
    addToWishlist,
    getWishlistByUserId,
    removeWishlistItem,
};
