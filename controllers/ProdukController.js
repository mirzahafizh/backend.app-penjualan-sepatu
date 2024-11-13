'use strict';

const { ProdukSepatu } = require('../models');
const ImageKit = require('imagekit');
const { Op } = require('sequelize');
// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Create shoe product
const createShoeProduct = async (req, res) => {
    try {
        const { ukuran, stok, rating, nama_sepatu, tipe_sepatu, harga, diskon, deskripsi } = req.body;
        const imageFile = req.file; // Assuming you're using middleware like multer for file uploads

        // Ensure the required fields are provided
        if (!nama_sepatu || !tipe_sepatu || !harga || !ukuran || !stok || !deskripsi) {
            return res.status(400).json({ error: 'All fields are required (nama_sepatu, tipe_sepatu, harga, ukuran, stok, deskripsi)' });
        }

        let imageUrl = null; // Initialize imageUrl as null

        // Upload the image if it's provided
        if (imageFile) {
            const imageUploadResponse = await imagekit.upload({
                file: imageFile.buffer,
                fileName: imageFile.originalname,
                folder: 'produk_sepatu', // Specify the folder for the images
            });
            imageUrl = imageUploadResponse.url; // Get the URL from the uploaded image
        }

        // Create the new product
        const newProduct = await ProdukSepatu.create({
            ukuran: JSON.parse(ukuran), // Parse the ukuran array from the request body
            stok: JSON.parse(stok), // Parse the stok array from the request body
            rating,
            nama_sepatu,
            tipe_sepatu, // Include the shoe type
            image: imageUrl, // Save the uploaded image URL (null if no image uploaded)
            harga,
            diskon,
            deskripsi,
        });

        // Respond with success
        res.status(201).json({
            message: 'Shoe product created successfully',
            product: newProduct,
        });
    } catch (error) {
        console.error('Error creating shoe product:', error);
        res.status(500).json({ error: 'Failed to create shoe product.' });
    }
};



// Update shoe product
const updateShoeProduct = async (req, res) => {
    try {
        const { ukuran, stok, rating, nama_sepatu, harga, diskon, deskripsi } = req.body;
        const imageFile = req.file; // Assuming you're using middleware like multer for file uploads

        const product = await ProdukSepatu.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Shoe product not found' });
        }

        // Retain existing image URL
        let imageUrl = product.image;

        // Upload new image if it exists
        if (imageFile) {
            const imageUploadResponse = await imagekit.upload({
                file: imageFile.buffer,
                fileName: imageFile.originalname,
                folder: 'produk_sepatu', // Specify the folder
            });
            imageUrl = imageUploadResponse.url; // Update to new image URL
        }

        await product.update({
            ukuran: JSON.parse(ukuran), // Parse the ukuran array from request body
            stok: JSON.parse(stok), // Parse the stok array from request body
            rating,
            nama_sepatu,
            image: imageUrl,
            harga,
            diskon,
            deskripsi,
        });

        res.status(200).json({
            message: 'Shoe product updated successfully',
            product,
        });
    } catch (error) {
        console.error('Error updating shoe product:', error);
        res.status(500).json({ error: 'Failed to update shoe product.' });
    }
};

// Get all shoe products
const getAllShoeProducts = async (req, res) => {
    try {
        const products = await ProdukSepatu.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching shoe products:', error);
        res.status(500).json({ error: 'Failed to fetch shoe products.' });
    }
};

// Get shoe product by ID
const getShoeProductById = async (req, res) => {
    try {
        const product = await ProdukSepatu.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Shoe product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching shoe product by ID:', error);
        res.status(500).json({ error: 'Failed to fetch shoe product.' });
    }
};

// Delete shoe product
const deleteShoeProduct = async (req, res) => {
    try {
        const product = await ProdukSepatu.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Shoe product not found' });
        }

        await product.destroy(); // Delete the shoe product
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting shoe product:', error);
        res.status(500).json({ error: 'Failed to delete shoe product.' });
    }
};

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

// Search shoe products
const searchProducts = async (req, res) => {
    try {
        const { term } = req.query; // Get search term from request query
    
        // Validate the search term
        if (!term) {
          return res.status(400).json({ error: "Search term is required" });
        }
    
        // Search for products using Sequelize
        const products = await ProdukSepatu.findAll({
          where: {
            [Op.or]: [
              { nama_sepatu: { [Op.like]: `%${term}%` } }, // Search by shoe name
              { tipe_sepatu: { [Op.like]: `%${term}%` } }  // Search by shoe type
            ]
          }
        });
    
        // Check if products were found
        if (products.length === 0) {
          return res.status(404).json({ error: "No products found matching your search" });
        }
    
        // Send the found products as a response
        res.status(200).json(products);
      } catch (error) {
        console.error("Error searching for products:", error);
        res.status(500).json({ error: "Failed to search for products" });
      }
    };


module.exports = {
    createShoeProduct,
    updateShoeProduct,
    getAllShoeProducts,
    getShoeProductById,
    deleteShoeProduct,
    rateShoeProduct,
    searchProducts,
};
