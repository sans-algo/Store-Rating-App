import React, { useState, useEffect, useContext } from 'react';
import { storeAPI, ratingAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Edit2, Star, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import StoreForm from './StoreForm';
import RatingList from '../ratings/RatingList';

const StoreDetails = () => {
  const { user, logout, refreshUser } = useContext(AuthContext);
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.storeId) {
      fetchStoreData();
    }
  }, [user?.storeId]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const [storeRes, ratingsRes] = await Promise.all([
        storeAPI.getOne(user.storeId),
        ratingAPI.getStoreRatings(user.storeId)
      ]);
      setStore(storeRes.data.store);
      setRatings(ratingsRes.data.ratings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching store data:', error);
      setLoading(false);
    }
  };

  const handleEditSuccess = async () => {
    setShowEditModal(false);
    // Refresh user data to get updated storeId
    await refreshUser();
    // Then fetch store data
    if (user?.storeId) {
      fetchStoreData();
    }
  };

  const handleDeleteStore = async () => {
    if (window.confirm('Are you sure you want to delete your store? This action cannot be undone and will delete all ratings.')) {
      try {
        await storeAPI.delete(user.storeId);
        alert('Store deleted successfully!');
        logout();
      } catch (error) {
        console.error('Error deleting store:', error);
        alert(error.response?.data?.message || 'Failed to delete store');
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (!user?.storeId) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">You don't have a store yet</h2>
        <p className="text-gray-600 mb-6">Create your store to start receiving ratings and reviews</p>
        <button
          onClick={() => setShowEditModal(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
        >
          Create Your Store
        </button>
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Create Store"
        >
          <StoreForm
            onSuccess={handleEditSuccess}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      </div>
    );
  }

  if (loading || !store) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{store.name}</h2>
            <p className="text-gray-600 mb-1">{store.category}</p>
            <p className="text-sm text-gray-500">{store.address}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Edit2 size={16} /> Edit
            </button>
            <button
              onClick={handleDeleteStore}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
        <p className="mb-4">{store.description}</p>
        <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded">
          {renderStars(Math.round(store.averageRating))}
          <span className="font-semibold">{store.averageRating.toFixed(1)}</span>
          <span className="text-gray-600">
            ({store.totalRatings} {store.totalRatings === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
        <RatingList ratings={ratings} />
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Store"
      >
        <StoreForm
          store={store}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
};

export default StoreDetails;