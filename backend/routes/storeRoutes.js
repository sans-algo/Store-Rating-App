const express = require('express');
const router = express.Router();
const {
  getStores,
  getStore,
  getMyStores,
  createStore,
  updateStore,
  deleteStore
} = require('../controllers/storeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getStores)
  .post(protect, authorize('owner', 'admin'), createStore);

router.get('/owner/me', protect, authorize('owner'), getMyStores);

router.route('/:id')
  .get(getStore)
  .put(protect, authorize('owner', 'admin'), updateStore)
  .delete(protect, authorize('owner', 'admin'), deleteStore);

module.exports = router;