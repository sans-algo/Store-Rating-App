import React, { useContext, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StoreList from './components/stores/StoreList';
import MyStores from './components/stores/MyStores';
import Dashboard from './components/admin/Dashboard';
import Loading from './components/common/Loading';

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('login');

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <>
        {activeTab === 'login' ? (
          <Login setActiveTab={setActiveTab} />
        ) : (
          <Register setActiveTab={setActiveTab} />
        )}
      </>
    );
  }

  // Set initial tab based on user role
  if (activeTab === 'login' || activeTab === 'register') {
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else if (user.role === 'owner') {
      setActiveTab('mystore');
    } else {
      setActiveTab('browse');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="py-8">
        {activeTab === 'browse' && <StoreList />}
        {activeTab === 'mystore' && <MyStores />}
        {activeTab === 'admin' && <Dashboard />}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;