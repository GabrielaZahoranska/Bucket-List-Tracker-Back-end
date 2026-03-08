const mongoose = require('mongoose');

// connect to mongo
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    throw new Error('MongoDB connection error: ' + err.message);
  }
};

module.exports = connectDB;