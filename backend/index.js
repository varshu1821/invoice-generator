const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/Route');
const invoiceRoutes = require('./routes/invoice');
const expenseRoutes = require('./routes/expense'); // Import the new expense routes
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

//enable all origin
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Basic route to check API status
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use routes for authentication, invoice, and expense
app.use('/api/auth', authRoutes);
app.use('/api', invoiceRoutes);
app.use('/api', expenseRoutes); // Register the expense route

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
