const express = require('express');
const router = express.Router();
const {
  getStoreRatings,
  createRating,
  updateRating,
  deleteRating
} = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/store/:storeId', getStoreRatings);
router.post('/', protect, createRating);
router.put('/:id', protect, updateRating);
router.delete('/:id', protect, deleteRating);

module.exports = router;