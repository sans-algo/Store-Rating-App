import { useState, useEffect } from "react";
import API from "../api";

function AddStore() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 10;

  // Fetch stores from backend
  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await API.get("/stores");
      setStores(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Handle adding a new store
  const handleAddStore = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData || userData.role.toUpperCase() !== "OWNER") {
      setMessage("Only OWNER users can add stores");
      return;
    }

    const owner_user_id = userData.id;

    try {
      await API.post("/stores", { name, email, address, owner_user_id });
      setMessage("Store added successfully!");
      setName("");
      setEmail("");
      setAddress("");
      setShowForm(false);
      fetchStores(); // Refresh the store list
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to add store");
    }
  };

  // Pagination logic
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = stores.slice(indexOfFirstStore, indexOfLastStore);
  const totalPages = Math.ceil(stores.length / storesPerPage);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Stores</h2>
        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          Add Store
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Add Store Modal */}
      {showForm && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Store</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddStore}>
                  <div className="mb-3">
                    <label className="form-label">Store Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email (Optional)</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    Save Store
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading stores...</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Average Rating</th>
                <th>Your Rating</th>
              </tr>
            </thead>
            <tbody>
              {currentStores.map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.email || "-"}</td>
                  <td>{store.address}</td>
                  <td>{store.avgRating || "-"}</td>
                  <td>{store.userRating || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav>
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <span className="page-link">Previous</span>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  <span className="page-link">{i + 1}</span>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <span className="page-link">Next</span>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}

export default AddStore;
