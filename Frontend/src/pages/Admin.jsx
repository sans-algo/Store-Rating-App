import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [userFilter, setUserFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'USER'
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStats = await API.get('/admin/stats');
        const resUsers = await API.get('/admin/users');
        const resStores = await API.get('/admin/stores');
        setStats(resStats.data);
        setUsers(resUsers.data);
        setStores(resStores.data);
        setFilteredUsers(resUsers.data);
        setFilteredStores(resStores.data);
      } catch (error) {
        console.error('Error loading admin data', error);
      }
    };
    fetchData();
  }, []);

  // Filter users
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(userFilter.toLowerCase()) ||
      user.email.toLowerCase().includes(userFilter.toLowerCase()) ||
      user.address?.toLowerCase().includes(userFilter.toLowerCase()) ||
      user.role.toLowerCase().includes(userFilter.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [userFilter, users]);

  // Filter stores
  useEffect(() => {
    const filtered = stores.filter(store =>
      store.name.toLowerCase().includes(storeFilter.toLowerCase()) ||
      store.address?.toLowerCase().includes(storeFilter.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [storeFilter, stores]);

  // Sort function
  const handleSort = (key, type = 'users') => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...(type === 'users' ? filteredUsers : filteredStores)].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    if (type === 'users') {
      setFilteredUsers(sortedData);
    } else {
      setFilteredStores(sortedData);
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validation
    if (newUser.name.length < 20 || newUser.name.length > 60) {
      setMessage('Name must be between 20 and 60 characters');
      return;
    }
    if (newUser.address.length > 400) {
      setMessage('Address must not exceed 400 characters');
      return;
    }
    if (newUser.password.length < 8 || newUser.password.length > 16) {
      setMessage('Password must be between 8 and 16 characters');
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(newUser.password)) {
      setMessage('Password must include uppercase letter and special character');
      return;
    }

    try {
      await API.post('/admin/users', newUser);
      setMessage('User added successfully');
      setShowAddUser(false);
      setNewUser({ name: '', email: '', address: '', password: '', role: 'USER' });
      
      // Refresh data
      const resUsers = await API.get('/admin/users');
      setUsers(resUsers.data);
      setFilteredUsers(resUsers.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      
      {message && <div className="alert alert-info">{message}</div>}
      
      <div className="d-flex gap-3 mt-3">
        <div className="card p-3">
          <h5>Total Users</h5>
          <p className="display-6">{stats.users}</p>
        </div>
        <div className="card p-3">
          <h5>Total Stores</h5>
          <p className="display-6">{stats.stores}</p>
        </div>
        <div className="card p-3">
          <h5>Total Ratings</h5>
          <p className="display-6">{stats.ratings}</p>
        </div>
      </div>

      {/* Users Section */}
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h3>Users</h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddUser(!showAddUser)}
          >
            {showAddUser ? 'Cancel' : 'Add New User'}
          </button>
        </div>
        
        {/* Add User Form */}
        {showAddUser && (
          <div className="card mt-3">
            <div className="card-body">
              <h5>Add New User</h5>
              <form onSubmit={handleAddUser}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Name (20-60 characters)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        minLength={20}
                        maxLength={60}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Address (max 400 characters)</label>
                  <textarea
                    className="form-control"
                    value={newUser.address}
                    onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                    maxLength={400}
                    rows={2}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Password (8-16 characters)</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        minLength={8}
                        maxLength={16}
                        required
                      />
                      <small className="text-muted">Must include uppercase letter and special character</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      >
                        <option value="USER">User</option>
                        <option value="OWNER">Owner</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-success me-2">Add User</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUser(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* User Filter */}
        <div className="mt-3 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter users by name, email, address, or role..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th style={{cursor: 'pointer'}} onClick={() => handleSort('name', 'users')}>
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{cursor: 'pointer'}} onClick={() => handleSort('email', 'users')}>
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{cursor: 'pointer'}} onClick={() => handleSort('address', 'users')}>
                  Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{cursor: 'pointer'}} onClick={() => handleSort('role', 'users')}>
                  Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address || 'N/A'}</td>
                  <td>
                    <span className={`badge bg-${u.role === 'ADMIN' ? 'danger' : u.role === 'OWNER' ? 'warning' : 'primary'}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stores Section */}
      <div className="mt-4">
        <h3>Stores</h3>
        
        {/* Store Filter */}
        <div className="mt-3 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter stores by name or address..."
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th style={{cursor: 'pointer'}} onClick={() => handleSort('name', 'stores')}>
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{cursor: 'pointer'}} onClick={() => handleSort('address', 'stores')}>
                  Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{cursor: 'pointer'}} onClick={() => handleSort('avgRating', 'stores')}>
                  Average Rating {sortConfig.key === 'avgRating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.address}</td>
                  <td>
                    {s.avgRating ? (
                      <div className="d-flex align-items-center">
                        <span className="me-2">{s.avgRating}/5</span>
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`bi ${i < Math.round(s.avgRating) ? 'bi-star-fill text-warning' : 'bi-star'}`}></i>
                        ))}
                      </div>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;
