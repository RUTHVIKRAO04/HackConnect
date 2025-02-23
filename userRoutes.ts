import express from 'express';
import { User } from '../../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('Received user data:', req.body);
    const { fullName, firebaseUid, role } = req.body;
    
    const user = new User({ fullName, firebaseUid, role });
    const savedUser = await user.save();
    
    res.status(201).json({ message: 'User info saved successfully', user: savedUser });
  } catch (error) {
    console.error('Server error saving user:', error);
    res.status(500).json({ error: 'Failed to save user info' });
  }
});

export default router; 