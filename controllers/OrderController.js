const { Order } = require('../models');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { userId, totalAmount } = req.body;

    if (!userId || typeof totalAmount !== 'number') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const newOrder = await Order.create({
      userId,
      totalAmount,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from URL params

    const orders = await Order.findAll({
      where: { userId },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Remove an order
const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error removing order:', error);
    res.status(500).json({ error: 'Failed to remove order' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  removeOrder,
};
