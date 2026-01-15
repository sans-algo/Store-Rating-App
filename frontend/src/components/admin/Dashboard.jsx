import React, { useState, useEffect } from 'react';
import { userAPI, storeAPI } from '../../services/api';
import { Edit2, Trash2, Plus } from 'lucide-react';
import Modal from '../common/Modal';
import StoreForm from '../stores/StoreForm';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, storesRes] = await Promise.all([
        userAPI.getStats(),
        userAPI.getAll(),
        storeAPI.getAll()
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setStores(storesRes.data.stores);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const handleDeleteStore = async (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await storeAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Error deleting store');
      }
    }
  };

  const handleEditStore = (store) => {
    setSelectedStore(store);
    setShowStoreModal(true);
  };

  const handleStoreSuccess = () => {
    setShowStoreModal(false);
    setSelectedStore(null);
    fetchData();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Stores</h3>
          <p className="text-3xl font-bold">{stats.totalStores}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Ratings</h3>
          <p className="text-3xl font-bold">{stats.totalRatings}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">All Stores</h3>
          <button
            onClick={() => {
              setSelectedStore(null);
              setShowStoreModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={16} /> Add Store
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-left">Rating</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store._id} className="border-b">
                  <td className="p-3">{store.name}</td>
                  <td className="p-3">{store.category}</td>
                  <td className="p-3">{store.ownerId?.username || 'Unassigned'}</td>
                  <td className="p-3">
                    {store.averageRating.toFixed(1)} ({store.totalRatings})
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditStore(store)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteStore(store._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showStoreModal}
        onClose={() => {
          setShowStoreModal(false);
          setSelectedStore(null);
        }}
        title={selectedStore ? 'Edit Store' : 'Add Store'}
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
    </div>
  );
};

export default Dashboard;
