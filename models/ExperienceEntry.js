const mongoose = require('mongoose');

const experienceEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  update: { type: String, default: '' },
  location: { type: String, default: '' },
  photos: [{ type: String }],
  notes: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5 },
  feeling: { type: String, default: '' },
  bucketItem: { type: mongoose.Schema.Types.ObjectId, ref: 'BucketItem', required: true }
}, { timestamps: true });

module.exports = mongoose.model('ExperienceEntry', experienceEntrySchema);
