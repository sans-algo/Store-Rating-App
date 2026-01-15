import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Store, User, Shield, Search, LogOut } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Store className="text-blue-600" size={32} />
            <span className="text-xl font-bold">Store Rating System</span>
          </div>
          <div className="flex items-center gap-6">
            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  activeTab === 'admin' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Shield size={20} /> Admin Panel
              </button>
            )}
            {user?.role === 'owner' && (
              <button
                onClick={() => setActiveTab('mystore')}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  activeTab === 'mystore' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Store size={20} /> My Store
              </button>
            )}
            {(user?.role === 'user' || user?.role === 'owner') && (
              <button
                onClick={() => setActiveTab('browse')}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  activeTab === 'browse' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Search size={20} /> Browse Stores
              </button>
            )}
            <div className="flex items-center gap-2">
              <User size={20} />
              <span className="font-medium">{user?.username}</span>
              <button
                onClick={logout}
                className="ml-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
