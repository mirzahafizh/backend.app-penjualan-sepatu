const express = require('express');
const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/UserController'); // Adjust the path as necessary
const authenticateToken = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // Use memory storage or configure disk storage

// Login a user
router.post('/login', loginUser);

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.post('/register', upload.single('image'), registerUser);
router.put('/:id', upload.single('image'), updateUser);

// Delete user
router.delete('/:id',authenticateToken, deleteUser);

module.exports = router;
