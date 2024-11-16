'use strict';

const { ProdukSepatu } = require('../models');

// Rate shoe product
const rateShoeProduct = async (req, res) => {
    try {
        const { rating } = req.body; // Assume rating is sent in the request body
        const product = await ProdukSepatu.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Shoe product not found' });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Update the total rating and rating count
        const newTotalRating = product.totalRating + rating;
        const newRatingCount = product.ratingCount + 1;
        const averageRating = newTotalRating / newRatingCount;

        await product.update({
            totalRating: newTotalRating,
            ratingCount: newRatingCount,
            rating: averageRating, // Update the average rating
        });

        res.status(200).json({
            message: 'Rating updated successfully',
            product,
        });
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ error: 'Failed to update rating.' });
    }
};

module.exports = {
    rateShoeProduct,
};
