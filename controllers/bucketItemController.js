const BucketItem = require('../models/BucketItem');
const ExperienceEntry = require('../models/ExperienceEntry');

const index = async (req, res) => {
  try {
    const items = await BucketItem.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch bucket items' });
  }
};

const show = async (req, res) => {
  try {
    const item = await BucketItem.findOne({ _id: req.params.id, user: req.user.id })
      .populate('user', 'name email')
      .lean();
    if (!item) return res.status(404).json({ error: 'Bucket item not found' });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch bucket item' });
  }
};

const create = async (req, res) => {
  try {
    const { title, description, category, priority, targetYear, targetDate, status, visibility } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }
    const item = await BucketItem.create({
      title,
      description: description || '',
      category,
      priority: priority != null ? priority : 1,
      targetYear: targetYear || undefined,
      targetDate: targetDate || undefined,
      status: status || 'dreaming',
      visibility: visibility || 'private',
      user: req.user.id
    });
    return res.status(201).json(item);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create bucket item' });
  }
};

const update = async (req, res) => {
  try {
    const item = await BucketItem.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ error: 'Bucket item not found' });

    const { title, description, category, priority, targetYear, targetDate, status, visibility } = req.body;
    if (title != null) item.title = title;
    if (description != null) item.description = description;
    if (category != null) item.category = category;
    if (priority != null) item.priority = priority;
    if (targetYear != null) item.targetYear = targetYear;
    if (targetDate != null) item.targetDate = targetDate;
    if (status != null) item.status = status;
    if (visibility != null) item.visibility = visibility;

    await item.save();
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update bucket item' });
  }
};

const destroy = async (req, res) => {
  try {
    const item = await BucketItem.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ error: 'Bucket item not found' });

    await ExperienceEntry.deleteMany({ bucketItem: item._id });
    await BucketItem.findByIdAndDelete(item._id);
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete bucket item' });
  }
};

const stats = async (req, res) => {
  try {
    const items = await BucketItem.find({ user: req.user.id }).lean();
    const total = items.length;
    const done = items.filter((i) => i.status === 'done').length;
    const inProgress = items.filter((i) => i.status === 'planning' || i.status === 'dreaming').length;
    const completionPercentage = total === 0 ? 0 : Math.round((done / total) * 100);

    const recentExperiences = await ExperienceEntry.find({ bucketItem: { $in: items.map((i) => i._id) } })
      .populate('bucketItem', 'title')
      .sort({ date: -1 })
      .limit(10)
      .lean();

    return res.json({
      goalsCompleted: done,
      goalsInProgress: inProgress,
      totalGoals: total,
      completionPercentage,
      recentActivity: recentExperiences
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

module.exports = { index, show, create, update, destroy, stats };
