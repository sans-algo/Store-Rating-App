const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/stats', getStats);
router.delete('/:id', deleteUser);

module.exports = router;