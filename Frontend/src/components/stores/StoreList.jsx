import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { storeAPI } from '../../services/api';
import StoreCard from './StoreCard';
import RatingForm from '../ratings/RatingForm';
import Modal from '../common/Modal';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [searchTerm]);

  const fetchStores = async () => {
    try {
      const response = await storeAPI.getAll(searchTerm);
      setStores(response.data.stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleRate = (store) => {
    setSelectedStore(store);
    setShowRatingModal(true);
  };

  const handleRatingSuccess = () => {
    setShowRatingModal(false);
    fetchStores();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stores by name or category..."
            className="w-full pl-10 p-3 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard key={store._id} store={store} onRate={handleRate} />
        ))}
      </div>

      <Modal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        title="Rate Store"
      >
        <RatingForm
          store={selectedStore}
          onSuccess={handleRatingSuccess}
          onCancel={() => setShowRatingModal(false)}
        />
      </Modal>
    </div>
  );
};

export default StoreList;
