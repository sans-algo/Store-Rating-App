import React, { useEffect, useState } from "react";
import API from "../api";
import "bootstrap-icons/font/bootstrap-icons.css";

const RateStores = () => {
  const [user, setUser] = useState({});
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);

  // Fetch all stores except user's own store for owners
  const fetchStores = async () => {
    try {
      const res = await API.get("/stores");
      const userData = localStorage.getItem("user");
      const parsedUser = userData ? JSON.parse(userData) : null;
      
      // Filter out user's own store if they are an owner
      let filteredStores = res.data;
      if (parsedUser?.role === 'OWNER') {
        filteredStores = res.data.filter(store => store.owner_user_id !== parsedUser.id);
      }
      
      setStores(filteredStores);
    } catch (error) {
      setMessage("Failed to load stores");
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    fetchStores();
  }, []);

  // Open rating modal
  const openRatingModal = (store) => {
    setSelectedStore(store);
    setRating(store.userRating || 0); // pre-fill if user has rated
  };

  // Submit or update rating
  const submitRating = async () => {
    if (!rating || rating < 1 || rating > 5) {
      setMessage("Please select a rating from 1 to 5 stars");
      return;
    }
    
    try {
      await API.post("/ratings", {
        storeId: selectedStore.id,
        rating: Number(rating),
      });
      setMessage("Rating submitted successfully");
      setSelectedStore(null);
      fetchStores(); // refresh list
    } catch (error) {
      console.error("Rating error:", error);
      setMessage(error.response?.data?.message || "Failed to submit rating");
    }
  };

  // Render star rating buttons
  const renderRatingButtons = () => (
    <div className="mb-3">
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          type="button"
          className={`btn btn-sm me-1 ${rating >= num ? "btn-warning" : "btn-outline-secondary"}`}
          onClick={() => setRating(num)}
          aria-label={`Rate ${num}`}
          style={{ fontSize: "1.5rem" }}
        >
          <i className={`bi ${rating >= num ? "bi-star-fill" : "bi-star"}`}></i>
        </button>
      ))}
    </div>
  );

  // Render star display
  const renderStarDisplay = (rating) => {
    return (
      <div className="d-inline">
        {[1, 2, 3, 4, 5].map((num) => (
          <i
            key={num}
            className={`bi ${rating >= num ? "bi-star-fill" : "bi-star"} text-warning me-1`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h2>Rate Stores</h2>
      <p>Welcome, {user?.name} ({user?.role})</p>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="row">
        {stores.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-warning">
              {user?.role === 'OWNER' ? 
                "No other stores available to rate." : 
                "No stores available to rate."}
            </div>
          </div>
        ) : (
          stores.map((store) => (
            <div key={store.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{store.name}</h5>
                  <p className="card-text">
                    <strong>Address:</strong> {store.address}
                  </p>
                  <p className="card-text">
                    <strong>Average Rating:</strong>{" "}
                    {store.avgRating ? (
                      <span>
                        {renderStarDisplay(store.avgRating)} ({store.avgRating}/5)
                      </span>
                    ) : (
                      "No ratings yet"
                    )}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => openRatingModal(store)}
                  >
                    {store.userRating ? "Update Rating" : "Rate Store"}
                  </button>
                  {store.userRating && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Your Rating: {renderStarDisplay(store.userRating)} ({store.userRating}/5)
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rating Modal */}
      {selectedStore && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Rate {selectedStore.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedStore(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Address:</strong> {selectedStore.address}</p>
                <p>Select your rating:</p>
                {renderRatingButtons()}
                <p className="text-muted">Selected: {rating}/5 stars</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedStore(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={submitRating}
                  disabled={rating === 0}
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateStores;