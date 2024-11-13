const axios = require('axios');

const chargePayment = async (req, res) => {
  const transactionDetails = req.body; // Get the transaction details from the request body
  const token = 'SB-Mid-server-vrjGWm6lbc6SYxZoZUu6i5B4'; // Ensure the token is a string

  try {
    // Encode the token in Base64 format for Basic Auth

    const response = await axios.post('https://api.sandbox.midtrans.com/v2/charge', transactionDetails, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`, // Properly format the authorization header
      },
    });

    // Return the response from Midtrans to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    // Log detailed error information
    console.error('Error processing payment:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: 'Payment processing error',
      details: error.response ? error.response.data : error.message,
    });
  }
};

module.exports = {
  chargePayment,
};
