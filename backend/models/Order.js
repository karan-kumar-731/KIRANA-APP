const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
  image: String,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  deliveryAddress: { type: String, required: true },
  userLocation: {
    lat: Number,
    lng: Number,
  },
  paymentMethod: { type: String, default: 'COD' },
  estimatedDelivery: { type: String, default: '30-45 minutes' },
  note: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);