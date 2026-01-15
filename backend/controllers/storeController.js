const Store = require('../models/Store');
const Rating = require('../models/Rating');
const User = require('../models/User');

// @desc    Get all stores
// @route   GET /api/stores
// @access  Public
exports.getStores = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const stores = await Store.find(query).populate('ownerId', 'username email');
    res.status(200).json({ success: true, stores });
  } catch (error) {
    console.error('Get Stores Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Public
exports.getStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('ownerId', 'username email');
    
    if (!store) {
      return res.status(404).json({ 
        success: false,
        message: 'Store not found' 
      });
    }
    
    res.status(200).json({ success: true, store });
  } catch (error) {
    console.error('Get Store Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get stores by owner
// @route   GET /api/stores/owner/me
// @access  Private (Owner)
exports.getMyStores = async (req, res) => {
  try {
    const stores = await Store.find({ ownerId: req.user.id });
    res.status(200).json({ success: true, stores });
  } catch (error) {
    console.error('Get My Stores Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create store
// @route   POST /api/stores
// @access  Private (Owner/Admin)
exports.createStore = async (req, res) => {
  try {
    const { name, category, address, description } = req.body;

    // Validation
    if (!name || !category || !address || !description) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Create store - REMOVED the "one store per owner" restriction
    const store = await Store.create({
      name,
      category,
      address,
      description,
      ownerId: req.user.role === 'owner' ? req.user.id : null
    });

    res.status(201).json({ success: true, store });
  } catch (error) {
    console.error('Create Store Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error creating store' 
    });
  }
};

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private (Owner of store/Admin)
exports.updateStore = async (req, res) => {
  try {
    let store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ 
        success: false,
        message: 'Store not found' 
      });
    }

    // Check ownership
    const isOwner = store.ownerId && store.ownerId.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this store' 
      });
    }

    // Only update allowed fields
    const { name, category, address, description } = req.body;
    
    store = await Store.findByIdAndUpdate(
      req.params.id, 
      { name, category, address, description },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({ success: true, store });
  } catch (error) {
    console.error('Update Store Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private (Owner of store/Admin)
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ 
        success: false,
        message: 'Store not found' 
      });
    }

    // Check ownership
    const isOwner = store.ownerId && store.ownerId.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this store' 
      });
    }

    await store.deleteOne();
    await Rating.deleteMany({ storeId: req.params.id });

    res.status(200).json({ 
      success: true, 
      message: 'Store deleted successfully' 
    });
  } catch (error) {
    console.error('Delete Store Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};