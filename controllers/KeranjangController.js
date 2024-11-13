const { Keranjang, ProdukSepatu } = require('../models');

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { produkSepatuId, quantity, userId, ukuran } = req.body; // Get ukuran from the request body

        if (!produkSepatuId || !userId || typeof quantity !== 'number' || quantity <= 0 || !ukuran) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const existingCartItem = await Keranjang.findOne({
            where: { userId, produkSepatuId, ukuran }, // Include ukuran in the query
        });

        if (existingCartItem) {
            // Update quantity if the item already exists in the cart
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            return res.status(200).json(existingCartItem);
        }

        const newCartItem = await Keranjang.create({
            userId,
            produkSepatuId,
            quantity,
            ukuran, // Include ukuran when creating a new cart item
        });

        res.status(200).json(newCartItem);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};

// Get cart items
const getCartItems = async (req, res) => {
    try {
        const userId = req.query.userId; // Extract userId from query parameters
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const cartItems = await Keranjang.findAll({
            where: { userId },
            include: [
                {
                    model: ProdukSepatu,
                    as: 'produkSepatu',
                },
            ],
        });
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        const { quantity, userId, ukuran } = req.body; // Get userId, quantity, and ukuran from the request body
        const { id } = req.params; // Get the cart item ID from request parameters

        const cartItem = await Keranjang.findOne({
            where: { id, userId, ukuran }, // Use id, userId, and ukuran to find the cart item
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        cartItem.quantity = quantity; // Update the quantity
        await cartItem.save(); // Save the changes

        res.status(200).json(cartItem); // Return the updated cart item
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params; // Get the item ID from request parameters

        // Find the cart item using the provided id
        const cartItem = await Keranjang.findOne({
            where: { id }, // Assuming id is unique for cart items
        });

        // If the item is not found, return a 404 error
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Remove the cart item from the database
        await cartItem.destroy();

        // Send a response with status 204 (No Content)
        res.status(204).send();
    } catch (error) {
        // Log the error for debugging
        console.error('Error removing cart item:', error);
        // Send a response with status 500 (Internal Server Error)
        res.status(500).json({ error: 'Failed to remove cart item' });
    }
};

// Get cart item by ID
const getCartItemById = async (req, res) => {
    try {
        const { id } = req.params; // Get the item ID from request parameters

        // Find the cart item using the provided id
        const cartItem = await Keranjang.findOne({
            where: { id },
            include: [
                {
                    model: ProdukSepatu,
                    as: 'produkSepatu',
                },
            ],
        });

        // If the item is not found, return a 404 error
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Send the cart item in the response
        res.status(200).json(cartItem);
    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching cart item by ID:', error);
        // Send a response with status 500 (Internal Server Error)
        res.status(500).json({ error: 'Failed to fetch cart item' });
    }
};

// Export the functions
module.exports = {
    addToCart,
    getCartItems,
    updateCartItem,
    removeCartItem,
    getCartItemById,
};
