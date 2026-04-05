const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ['Atta & Rice', 'Dal & Pulses', 'Oil & Ghee', 'Spices', 'Snacks', 'Dairy', 'Beverages', 'Soap & Cleaning', 'Other']
  },
  image: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  unit: { type: String, default: 'piece' },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);