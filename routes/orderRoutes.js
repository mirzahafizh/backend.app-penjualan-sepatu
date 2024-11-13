const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/OrderController');

// Route to create a new order
router.post('/', ordersController.createOrder);

// Route to get orders by user ID
router.get('/:userId', ordersController.getUserOrders);

// Route to update order status
router.put('/:id', ordersController.updateOrderStatus);

// Route to remove an order
router.delete('/:id', ordersController.removeOrder);

module.exports = router;
