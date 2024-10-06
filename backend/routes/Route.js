const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Invoice = require('../models/Invoice'); // Import the Invoice model
const auth = require('../middleware/auth');
const { storage } = require('../config/firebase');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const multer = require('multer');



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

// Register a user
router.post('/register', upload.single('photo'), express.json(), async (req, res) => {
  const { username, email, password } = req.body;
  const photo = req.file;

  try {
    console.log(req);
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    // Upload the image to Firebase Storage
    let photoUrl = '';
    if (photo) {
        const storageRef = ref(storage, `users/${Date.now()}_${photo.originalname}`);
        await uploadBytes(storageRef, photo.buffer); 
        photoUrl = await getDownloadURL(storageRef);
    }

    // Create new user
    user = new User({ username, email, password, photoUrl });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token,photoUrl});
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login a user
router.post('/login', express.json(), async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Return JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Protected dashboard route
router.get('/dashboard', auth, (req, res) => {
  res.json({ msg: 'Welcome to the dashboard!' });
});

// Update username by user ID
router.put('/users/:id', auth, async (req, res) => {
  const { username } = req.body;

  // Check if username is provided
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Find user by ID and update username
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username },
      { new: true, runValidators: true } // runValidators ensures that validation rules are applied
    );

    // If the user is not found, return a 404 error
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the updated user details
    res.json(updatedUser);
  } catch (error) {
    // Handle errors (e.g., validation errors)
    res.status(500).json({ message: error.message });
  }
});


// Delete a user by ID
router.delete('/users/:id', auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
