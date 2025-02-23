import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: String,
  firebaseUid: { type: String, unique: true },
  role: String,
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema); 