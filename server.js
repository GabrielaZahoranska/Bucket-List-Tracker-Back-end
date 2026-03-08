require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// routes
const authRoutes = require('./routes/authRoutes');
const bucketRoutes = require('./routes/bucketItemRoutes');
const experienceRoutes = require('./routes/experienceRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/bucketitems', bucketRoutes);
app.use('/api/experiences', experienceRoutes);

app.get('/', (req, res) => {
  res.send('Bucket List Tracker API running');
});

async function start() {
  // check env before starting
  if (!process.env.JWT_SECRET || !process.env.MONGO_URI) process.exit(1);
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT);
}

start().catch(() => process.exit(1));
