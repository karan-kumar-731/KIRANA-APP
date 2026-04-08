const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ✅ CORS - both frontend and admin allowed
app.use(cors({
  origin: [
    "https://kirana-app-kixv.vercel.app",
    "https://kirana-app-cyan.vercel.app",
    "https://NAYA-ADMIN-URL.vercel.app" 
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options('*', cors());

app.use(express.json());

// ✅ Health check - keeps Render from sleeping
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// ✅ Keep Render alive - pings every 14 minutes
setInterval(() => {
  fetch(`https://kirana-app-1-qxan.onrender.com/api/health`)
    .catch(() => {});
}, 14 * 60 * 1000);

// Connect DB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });