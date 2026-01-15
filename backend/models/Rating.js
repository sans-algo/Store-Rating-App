const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please provide comment'],
    maxlength: 500
  }
}, {
  timestamps: true
});

// Prevent duplicate ratings from same user
ratingSchema.index({ storeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);