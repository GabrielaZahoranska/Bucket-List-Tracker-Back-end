const mongoose = require('mongoose');

const categoryEnum = ['travel', 'fitness', 'career', 'personal', 'adventure'];
const statusEnum = ['dreaming', 'planning', 'done'];
const visibilityEnum = ['private', 'public'];

const bucketItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: categoryEnum, required: true },
  priority: { type: Number, default: 1 },
  targetYear: { type: Number },
  targetDate: { type: Date },
  status: { type: String, enum: statusEnum, default: 'dreaming' },
  visibility: { type: String, enum: visibilityEnum, default: 'private' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('BucketItem', bucketItemSchema);
