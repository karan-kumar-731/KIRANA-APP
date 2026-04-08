require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('✅ MongoDB connected');
  
  const User = require('./models/User');
  
  // Delete existing admin
  await User.deleteOne({ phone: '9999999999' });
  
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await User.create({
    name: 'Admin',
    phone: '9999999999',
    password: hashedPassword,
    role: 'admin'
  });
  
  console.log('✅ Admin created:', admin.phone);
  console.log('📱 Phone: 9999999999');
  console.log('🔒 Password: admin123');
  process.exit();
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit();
});