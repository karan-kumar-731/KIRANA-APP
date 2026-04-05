const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    res.json({ totalOrders, pendingOrders, deliveredOrders, totalUsers, totalProducts, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/seed - seed dummy products & admin account
router.post('/seed', async (req, res) => {
  try {
    // Create admin user if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Shop Admin',
        phone: '8249978206',
        password: 'rkchauhan',
        role: 'GodFather',
      });
    }

    // Seed dummy products
    const count = await Product.countDocuments();
    if (count === 0) {
      const dummyProducts = [
        { name: 'Aashirvaad Atta 5kg', description: 'Premium whole wheat atta, perfect for soft rotis', price: 265, category: 'Atta & Rice', stock: 50, unit: 'bag', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300' },
        { name: 'Basmati Rice 1kg', description: 'Long grain aromatic basmati rice', price: 120, category: 'Atta & Rice', stock: 80, unit: 'kg', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300' },
        { name: 'Toor Dal 500g', description: 'Fresh toor dal, ideal for everyday dal', price: 75, category: 'Dal & Pulses', stock: 60, unit: 'packet', image: 'https://images.unsplash.com/photo-1585237017125-24baf8d7406f?w=300' },
        { name: 'Moong Dal 500g', description: 'Split yellow moong dal', price: 80, category: 'Dal & Pulses', stock: 45, unit: 'packet', image: 'https://images.unsplash.com/photo-1585237017125-24baf8d7406f?w=300' },
        { name: 'Sunflower Oil 1L', description: 'Refined sunflower oil for healthy cooking', price: 145, category: 'Oil & Ghee', stock: 30, unit: 'bottle', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300' },
        { name: 'Amul Ghee 500ml', description: 'Pure cow ghee from Amul', price: 310, category: 'Oil & Ghee', stock: 20, unit: 'tin', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300' },
        { name: 'Red Chilli Powder 200g', description: 'Hot and spicy red chilli powder', price: 55, category: 'Spices', stock: 100, unit: 'packet', image: 'https://images.unsplash.com/photo-1599909631845-61ab7e6543e1?w=300' },
        { name: 'Haldi Powder 200g', description: 'Pure turmeric powder with natural color', price: 45, category: 'Spices', stock: 100, unit: 'packet', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300' },
        { name: 'Lays Magic Masala 26g', description: 'Crispy potato chips with magic masala flavor', price: 20, category: 'Snacks', stock: 150, unit: 'packet', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300' },
        { name: 'Parle-G Biscuits 200g', description: 'Classic glucose biscuits, loved by all', price: 25, category: 'Snacks', stock: 200, unit: 'packet', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300' },
        { name: 'Amul Milk 1L', description: 'Full cream fresh milk from Amul', price: 68, category: 'Dairy', stock: 40, unit: 'packet', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300' },
        { name: 'Amul Butter 100g', description: 'Pasteurized table butter', price: 58, category: 'Dairy', stock: 30, unit: 'packet', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300' },
        { name: 'Tata Tea Gold 500g', description: 'Premium Assam tea with fresh leaves', price: 265, category: 'Beverages', stock: 25, unit: 'packet', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300' },
        { name: 'Bisleri Water 1L', description: 'Pure mineral water', price: 20, category: 'Beverages', stock: 100, unit: 'bottle', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300' },
        { name: 'Surf Excel 500g', description: 'Detergent powder for tough stains', price: 110, category: 'Soap & Cleaning', stock: 35, unit: 'packet', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=300' },
        { name: 'Lifebuoy Soap 100g', description: 'Antibacterial protection soap', price: 30, category: 'Soap & Cleaning', stock: 80, unit: 'piece', image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f025?w=300' },
      ];
      await Product.insertMany(dummyProducts);
    }

    res.json({ message: '✅ Seeded successfully! Admin: phone=9999999999, password=admin123' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;