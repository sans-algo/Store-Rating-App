import React, { useEffect, useState } from 'react';
import API from '../api';

const OwnerDashboard = () => {
  const [storeData, setStoreData] = useState({ avg: null, ratings: [] });
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    
    fetchStoreRatings();
  }, []);

  const fetchStoreRatings = async () => {
    try {
      const res = await API.get('/owner/my-store-ratings');
      setStoreData(res.data);
    } catch (error) {
      setMessage('Failed to load store ratings data');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`bi ${i < rating ? 'bi-star-fill text-warning' : 'bi-star'}`}
      ></i>
    ));
  };

  return (
    <div className="container mt-4">
      <h2>Store Owner Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      
      {message && <div className="alert alert-info">{message}</div>}

      {/* Store Statistics */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Your Store's Average Rating</h5>
              <div className="display-4 text-primary">
                {storeData.avg ? storeData.avg : 'N/A'}
              </div>
              {storeData.avg && (
                <div className="mt-2">
                  {renderStars(Math.round(storeData.avg))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Total Ratings Received</h5>
              <div className="display-4 text-success">
                {storeData.ratings.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Table */}
      <div className="card">
        <div className="card-header">
          <h5>Users Who Have Rated Your Store</h5>
        </div>
        <div className="card-body">
          {storeData.ratings.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Date Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {storeData.ratings.map((rating, index) => (
                    <tr key={index}>
                      <td>{rating.name}</td>
                      <td>{rating.email}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2">{rating.rating}/5</span>
                          {renderStars(rating.rating)}
                        </div>
                      </td>
                      <td>
                        {new Date(rating.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-star display-1 text-muted"></i>
              <p className="text-muted mt-2">No ratings submitted yet for your store.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;