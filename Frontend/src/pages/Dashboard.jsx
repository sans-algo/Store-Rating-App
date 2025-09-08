import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  // Fetch stores based on user role
  const fetchStores = async () => {
    try {
      const userData = localStorage.getItem("user");
      const userRole = userData ? JSON.parse(userData).role : null;
      
      // Store Owners should be redirected to their dashboard
      if (userRole === 'OWNER') {
        navigate('/owner-dashboard');
        return;
      }
      
      const res = await API.get("/stores");
      setStores(res.data);
    } catch (error) {
      setMessage("Failed to load stores");
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Redirect Store Owners to their own dashboard
      if (parsedUser.role === 'OWNER') {
        navigate('/owner-dashboard');
        return;
      }
    }
    fetchStores();
  }, [navigate]);

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

  // Delete store (Admin only)
  const deleteStore = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    try {
      await API.delete(`/stores/${storeId}`);
      setMessage("Store deleted successfully");
      setStores(stores.filter((s) => s.id !== storeId));
    } catch (error) {
      setMessage("Failed to delete store");
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

  return (
    <div className="container mt-4">
      <h2>Welcome, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>
        <strong>Role:</strong> {user?.role}
      </p>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Add Store Button for Admin/Owner */}
      {(user?.role === "admin" || user?.role === "owner") && (
        <button
          className="btn btn-success mb-3"
          onClick={() => navigate("/add-store")}
        >
          Add New Store
        </button>
      )}

      {/* Stores Table */}
      <table className="table table-bordered" style={{ border: "2px solid black" }}>
        <thead>
          <tr>
            <th style={{ border: "2px solid black" }}>Store Name</th>
            <th style={{ border: "2px solid black" }}>Address</th>
            <th style={{ border: "2px solid black" }}>Average Rating</th>
            <th style={{ border: "2px solid black" }}>Your Rating</th>
            <th style={{ border: "2px solid black" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.length > 0 ? (
            stores.map((store) => (
              <tr key={store.id}>
                <td style={{ border: "2px solid black" }}>{store.name}</td>
                <td style={{ border: "2px solid black" }}>{store.address}</td>
                <td style={{ border: "2px solid black" }}>{store.avgRating || "-"}</td>
                <td style={{ border: "2px solid black" }}>
                  {store.userRating
                    ? [...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi ${
                            i < store.userRating ? "bi-star-fill text-warning" : "bi-star"
                          }`}
                        ></i>
                      ))
                    : "-"}
                </td>
                <td style={{ border: "2px solid black" }}>
                  {user?.role === "user" && (
                    <>
                      {!store.userRating ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => openRatingModal(store)}
                        >
                          Rate
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openRatingModal(store)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      )}
                    </>
                  )}
                  {(user?.role === "owner" || user?.role === "admin") && (
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => navigate(`/edit-store/${store.id}`)}
                    >
                      Edit
                    </button>
                  )}
                  {user?.role === "admin" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteStore(store.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center" style={{ border: "2px solid black" }}>
                No stores available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Rating Modal */}
      {selectedStore && user?.role === "user" && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedStore.name} -{" "}
                  {selectedStore.userRating ? "Update Rating" : "Rate"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedStore(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                {renderRatingButtons()}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedStore(null)}
                >
                  Close
                </button>
                <button
                  className="btn btn-success"
                  onClick={submitRating}
                  disabled={rating === 0}
                >
                  Save Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;