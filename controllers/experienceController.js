const ExperienceEntry = require('../models/ExperienceEntry');
const BucketItem = require('../models/BucketItem');

const index = async (req, res) => {
  try {
    const bucketItem = await BucketItem.findOne({ _id: req.params.bucketItemId, user: req.user.id });
    if (!bucketItem) return res.status(404).json({ error: 'Bucket item not found' });

    const entries = await ExperienceEntry.find({ bucketItem: bucketItem._id })
      .sort({ date: -1 })
      .lean();
    return res.json(entries);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch experiences' });
  }
};

const show = async (req, res) => {
  try {
    const entry = await ExperienceEntry.findById(req.params.id).populate('bucketItem').lean();
    if (!entry) return res.status(404).json({ error: 'Experience not found' });
    if (entry.bucketItem.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this experience' });
    }
    return res.json(entry);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch experience' });
  }
};

const create = async (req, res) => {
  try {
    const bucketItem = await BucketItem.findOne({ _id: req.params.bucketItemId, user: req.user.id });
    if (!bucketItem) return res.status(404).json({ error: 'Bucket item not found' });

    const { date, update: updateText, location, photos, notes, rating, feeling } = req.body;
    const entry = await ExperienceEntry.create({
      date: date || new Date(),
      update: updateText || '',
      location: location || '',
      photos: Array.isArray(photos) ? photos : [],
      notes: notes || '',
      rating: rating != null ? rating : undefined,
      feeling: feeling || '',
      bucketItem: bucketItem._id
    });
    return res.status(201).json(entry);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create experience' });
  }
};

const update = async (req, res) => {
  try {
    const entry = await ExperienceEntry.findById(req.params.id).populate('bucketItem');
    if (!entry) return res.status(404).json({ error: 'Experience not found' });
    if (entry.bucketItem.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this experience' });
    }

    const { date, update: updateText, location, photos, notes, rating, feeling } = req.body;
    if (date != null) entry.date = date;
    if (updateText != null) entry.update = updateText;
    if (location != null) entry.location = location;
    if (photos != null) entry.photos = Array.isArray(photos) ? photos : entry.photos;
    if (notes != null) entry.notes = notes;
    if (rating != null) entry.rating = rating;
    if (feeling != null) entry.feeling = feeling;

    await entry.save();
    return res.json(entry);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update experience' });
  }
};

const destroy = async (req, res) => {
  try {
    const entry = await ExperienceEntry.findById(req.params.id).populate('bucketItem');
    if (!entry) return res.status(404).json({ error: 'Experience not found' });
    if (entry.bucketItem.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this experience' });
    }
    await ExperienceEntry.findByIdAndDelete(entry._id);
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete experience' });
  }
};

module.exports = { index, show, create, update, destroy };
