const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// Haversine formula to calculate distance in KM
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// POST /api/orders - place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, deliveryAddress, userLocation, note } = req.body;

    // 1. Check location
    const shopLat = parseFloat(process.env.SHOP_LAT);
    const shopLng = parseFloat(process.env.SHOP_LNG);
    const radiusKm = parseFloat(process.env.SHOP_RADIUS_KM) || 1;

    if (!userLocation || !userLocation.lat || !userLocation.lng) {
      return res.status(400).json({ message: 'Location is required to place an order.' });
    }

    const distance = getDistanceKm(userLocation.lat, userLocation.lng, shopLat, shopLng);
    if (distance > radiusKm) {
      return res.status(400).json({
        message: `Sorry! Delivery is only within ${radiusKm} km. You are ${distance.toFixed(2)} km away.`
      });
    }

    // 2. Build items with current prices from DB
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isAvailable) {
        return res.status(400).json({ message: `Product "${item.name}" is not available.` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    // 3. Check minimum order ₹100
    if (totalAmount < 100) {
      return res.status(400).json({ message: `Minimum order is ₹100. Your total is ₹${totalAmount}.` });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      userLocation,
      note,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my - user's own orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders - admin: all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status - admin: update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name phone');
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;