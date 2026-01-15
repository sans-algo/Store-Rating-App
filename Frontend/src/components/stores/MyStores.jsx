import React, { useState, useEffect } from 'react';
import { storeAPI, ratingAPI } from '../../services/api';
import { Edit2, Star, Trash2, Plus } from 'lucide-react';
import Modal from '../common/Modal';
import StoreForm from './StoreForm';
import RatingList from '../ratings/RatingList';

const MyStores = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showRatingsModal, setShowRatingsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    try {
      setLoading(true);
      const response = await storeAPI.getMyStores();
      setStores(response.data.stores);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setLoading(false);
    }
  };

  const handleStoreSuccess = () => {
    setShowStoreModal(false);
    setSelectedStore(null);
    fetchMyStores();
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store? This will delete all ratings.')) {
      try {
        await storeAPI.delete(storeId);
        fetchMyStores();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete store');
      }
    }
  };

  const handleViewRatings = async (store) => {
    try {
      const response = await ratingAPI.getStoreRatings(store._id);
      setRatings(response.data.ratings);
      setSelectedStore(store);
      setShowRatingsModal(true);
    } catch (error) {
      console.error('Error fetching ratings:', error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Stores</h2>
        <button
          onClick={() => {
            setSelectedStore(null);
            setShowStoreModal(true);
          }}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 font-semibold"
        >
          <Plus size={20} /> Create New Store
        </button>
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 mb-6">You haven't created any stores yet</p>
          <button
            onClick={() => setShowStoreModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
          >
            Create Your First Store
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-bold mb-2">{store.name}</h3>
              <p className="text-gray-600 mb-2">{store.category}</p>
              <p className="text-sm text-gray-500 mb-3">{store.address}</p>
              <p className="text-sm mb-4">{store.description}</p>
              
              <div className="flex items-center gap-1 mb-4 p-3 bg-yellow-50 rounded">
                {renderStars(Math.round(store.averageRating))}
                <span className="ml-2 font-semibold">{store.averageRating.toFixed(1)}</span>
                <span className="text-sm text-gray-600">
                  ({store.totalRatings} reviews)
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewRatings(store)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
                >
                  View Reviews
                </button>
                <button
                  onClick={() => {
                    setSelectedStore(store);
                    setShowStoreModal(true);
                  }}
                  className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteStore(store._id)}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Store Form Modal */}
      <Modal
        isOpen={showStoreModal}
        onClose={() => {
          setShowStoreModal(false);
          setSelectedStore(null);
        }}
        title={selectedStore ? 'Edit Store' : 'Create New Store'}
      >
        <StoreForm
          store={selectedStore}
          onSuccess={handleStoreSuccess}
          onCancel={() => {
            setShowStoreModal(false);
            setSelectedStore(null);
          }}
        />
      </Modal>

      {/* Ratings Modal */}
      <Modal
        isOpen={showRatingsModal}
        onClose={() => {
          setShowRatingsModal(false);
          setSelectedStore(null);
        }}
        title={`Reviews for ${selectedStore?.name}`}
      >
        <RatingList ratings={ratings} />
      </Modal>
    </div>
  );
};

export default MyStores;