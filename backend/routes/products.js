const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage });


// GET /api/products - all available products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isAvailable: true };
    if (category && category !== 'All') filter.category = category;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ YAHAN ADD KAR (CORRECT PLACE)
router.get('/image/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.image || !product.image.data) {
      return res.status(404).send('No image found');
    }

    res.set('Content-Type', product.image.contentType);
    res.send(product.image.data);

  } catch (err) {
    res.status(500).send('Error fetching image');
  }
});


// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





// POST /api/products - admin add product
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock, unit } = req.body;
const image = req.file
  ? {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    }
  : null;
    const product = await Product.create({ name, description, price, category, stock, unit, image });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id - admin update product
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock, unit, isAvailable } = req.body;
    const update = { name, description, price, category, stock, unit, isAvailable };
  if (req.file) {
  update.image = {
    data: req.file.buffer,
    contentType: req.file.mimetype,
  };
}
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/products/:id - admin delete product
router.delete('/:id', protect, adminOnly, async (req, res) => {

  
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;