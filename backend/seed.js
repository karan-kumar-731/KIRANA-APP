require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('✅ MongoDB connected');
  
  const User = require('./models/User');
  
  // Delete existing admin
  await User.deleteOne({ phone: '9999999999' });
  console.log('🗑️ Old admin deleted');
  
  // Create fresh - model khud bcrypt karega
  const admin = await User.create({
    name: 'Admin',
    phone: '9999999999',
    password: 'admin123',
    role: 'admin',
    address: ''
  });
  
  console.log('✅ Admin created:', admin.phone);
  console.log('📱 Phone: 9999999999');
  console.log('🔒 Password: admin123');
  process.exit();

}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit();
});