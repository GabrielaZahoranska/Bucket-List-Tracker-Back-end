// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bucketRoutes = require('./routes/bucketItemRoutes');
const experienceRoutes = require('./routes/experienceRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bucketitems', bucketRoutes);
app.use('/api/experiences', experienceRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Bucket List Tracker API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));