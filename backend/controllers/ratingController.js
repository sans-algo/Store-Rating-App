const Rating = require('../models/Rating');
const Store = require('../models/Store');

// @desc    Get ratings for a store
// @route   GET /api/ratings/store/:storeId
// @access  Public
exports.getStoreRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ storeId: req.params.storeId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create rating
// @route   POST /api/ratings
// @access  Private
exports.createRating = async (req, res) => {
  try {
    const { storeId, rating, comment } = req.body;

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated
    const existingRating = await Rating.findOne({
      storeId,
      userId: req.user.id
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this store' });
    }

    const newRating = await Rating.create({
      storeId,
      userId: req.user.id,
      rating,
      comment
    });

    // Update store average rating
    await updateStoreRating(storeId);

    res.status(201).json({ success: true, rating: newRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update rating
// @route   PUT /api/ratings/:id
// @access  Private
exports.updateRating = async (req, res) => {
  try {
    let rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Check ownership
    if (rating.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this rating' });
    }

    rating = await Rating.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Update store average rating
    await updateStoreRating(rating.storeId);

    res.status(200).json({ success: true, rating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete rating
// @route   DELETE /api/ratings/:id
// @access  Private
exports.deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Check ownership or admin
    if (rating.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this rating' });
    }

    const storeId = rating.storeId;
    await rating.deleteOne();

    // Update store average rating
    await updateStoreRating(storeId);

    res.status(200).json({ success: true, message: 'Rating deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update store rating
async function updateStoreRating(storeId) {
  const ratings = await Rating.find({ storeId });
  
  if (ratings.length === 0) {
    await Store.findByIdAndUpdate(storeId, {
      averageRating: 0,
      totalRatings: 0
    });
  } else {
    const avgRating = ratings.reduce((acc, item) => item.rating + acc, 0) / ratings.length;
    await Store.findByIdAndUpdate(storeId, {
      averageRating: avgRating,
      totalRatings: ratings.length
    });
  }
}