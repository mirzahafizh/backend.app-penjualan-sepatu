const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary
const productRoutes = require('./routes/productRoutes'); // Adjust the path as necessary
const cartRoutes = require('./routes/keranjangRoutes'); // Adjust the path as necessary
const transaksiRoutes = require('./routes/transaksiRoutes'); // Adjust the path as necessary
const ordersRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes'); // Adjust the path as appropriate
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentsRoutes'); // Adjust the path as appropriate
const cors = require('cors');
const axios = require('axios'); // Import axios
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware

const corsOptions = {
  origin: ['https://backend-app-penjualan-sepatu.vercel.app'], // Allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions)); // Enable CORS

app.use(bodyParser.json()); // Parse JSON request bodies

// Use user routes
app.use('/api/users', userRoutes); // Prefix your routes
app.use('/api', productRoutes); // Prefix your routes
app.use('/api', cartRoutes); // Prefix your routes
app.use('/api', transaksiRoutes); // Prefix your routes
app.use('/api/orders', ordersRoutes);
app.use('/api', wishlistRoutes); // Prefix your routes
app.use('/api', likeRoutes); // Prefix your routes
app.use('/api', commentRoutes); // Prefix your routes

app.post('/midtrans/payment', async (req, res) => {
    const transactionDetails = req.body; // Get the transaction details from the request body
    const token = 'SB-Mid-server-vrjGWm6lbc6SYxZoZUu6i5B4';
  
    try {

      const base64Token = Buffer.from(`${token}:`).toString('base64');

      const response = await axios.post('https://app.sandbox.midtrans.com/snap/v1/transactions', transactionDetails, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${base64Token}`, // Properly format the authorization header
        },
      });
  
      // Return the response from Midtrans to the Flutter app
      res.status(response.status).json(response.data);
    } catch (error) {
      // Log detailed error information
      console.error('Error processing payment:', error.response ? error.response.data : error.message);
      res.status(500).json({
        error: 'Payment processing error',
        details: error.response ? error.response.data : error.message,
      });
    }
});

// Payment status checking endpoint
app.get('/midtrans/check', async (req, res) => {
    const { orderId } = req.query; // Get the orderId from query parameters
    const token = 'SB-Mid-server-vrjGWm6lbc6SYxZoZUu6i5B4';

    if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required' });
    }

    try {
        const base64Token = Buffer.from(`${token}:`).toString('base64');
        const url = `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
            },
        });

        // Return the payment status to the Flutter app
        res.status(response.status).json(response.data);
    } catch (error) {
        // Log detailed error information
        console.error('Error checking payment status:', error.response ? error.response.data : error.message);
        res.status(500).json({
            error: 'Error checking payment status',
            details: error.response ? error.response.data : error.message,
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
