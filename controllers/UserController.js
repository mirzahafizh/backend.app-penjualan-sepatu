const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ImageKit = require('imagekit'); // Ensure ImageKit SDK is installed
require('dotenv').config(); // Load environment variables from .env file

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, role, address, phoneNumber } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle image upload using ImageKit
        let imageUrl = null;
        if (req.file) {
            const result = await imagekit.upload({
                file: req.file.buffer, // Assuming you are using multer for file uploads
                fileName: req.file.originalname,
            });
            imageUrl = result.url; // Get the uploaded image URL
        }

        // Create a new user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: role || 'user',
            address,
            phoneNumber: phoneNumber || null, // Default to null if phoneNumber is not provided
            image: imageUrl,
        });
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role, address: newUser.address,phoneNumber: newUser.phoneNumber, image: newUser.image },
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { fullName, email, password, address, phoneNumber } = req.body;

        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prepare the update object
        const updateData = {
            fullName,
            email,
            address,
            phoneNumber, // Include address
        };

        // Hash the password if it's provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with 10 rounds
            updateData.password = hashedPassword; // Include the hashed password
        }

        // Handle image upload using ImageKit
        if (req.file) {
            const result = await imagekit.upload({
                file: req.file.buffer, // Assuming you are using multer for file uploads
                fileName: req.file.originalname,
            });
            updateData.image = result.url; // Update the image URL
        }

        await user.update(updateData);

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET, // Use environment variable for secret
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};



// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy(); // Delete the user entry
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
