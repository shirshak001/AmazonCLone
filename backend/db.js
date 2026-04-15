require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/amazonclone';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('[OK] MongoDB connected');
  } catch (err) {
    console.error('[ERROR] MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
