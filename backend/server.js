const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('LinkStore API is running...');
});

// Import Routes (To be created)
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendor');
const adminRoutes = require('./routes/admin');
const checkoutRoutes = require('./routes/checkout');
const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/user');
const reviewRoutes = require('./routes/reviews');

app.use('/api/auth', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/user', userRoutes);

// Serve static files from public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
