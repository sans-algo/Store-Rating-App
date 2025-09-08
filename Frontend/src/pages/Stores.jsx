import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // Fetch all stores
  const fetchStores = async () => {
    try {
      const res = await API.get("/stores");
      setStores(res.data);
    } catch (error) {
      console.error("Error fetching stores", error);
    } finally {
      setLoading(false);
    }
  };

  // Submit rating
  const submitRating = async (storeId, rating) => {
    try {
      await API.post("/ratings", { storeId, rating });
      fetchStores();
    } catch (error) {
      console.error("Error submitting rating", error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Stores</h2>

      {/* Add New Store button visible to all */}
      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/add-store")}
      >
        Add New Store
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Average Rating</th>
            <th>Your Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{store.avgRating || "-"}</td>
              <td>{store.userRating || "-"}</td>
              <td>
                {/* Users can rate */}
                <select
                  className="form-select form-select-sm"
                  onChange={(e) => submitRating(store.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Rate
                  </option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stores;
