import React, { useState, useEffect } from 'react';
import { storeAPI } from '../../services/api';

const StoreForm = ({ store, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        category: store.category,
        address: store.address,
        description: store.description
      });
    }
  }, [store]);

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);

      // Validation
      if (!formData.name || !formData.category || !formData.address || !formData.description) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (store) {
        await storeAPI.update(store._id, formData);
      } else {
        await storeAPI.create(formData);
      }
      
      setLoading(false);
      onSuccess();
    } catch (err) {
      console.error('Store Form Error:', err);
      setError(err.response?.data?.message || 'Failed to save store');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Store Name *</label>
        <input
          type="text"
          placeholder="Enter store name"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
        <input
          type="text"
          placeholder="e.g., Electronics, Fashion, Books"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
        <input
          type="text"
          placeholder="Enter store address"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          placeholder="Describe your store"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:bg-gray-400 font-semibold"
        >
          {loading ? 'Saving...' : 'Save Store'}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-300 text-gray-700 p-3 rounded hover:bg-gray-400 disabled:bg-gray-200 font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default StoreForm;