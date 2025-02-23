import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/hackconnect';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB; 