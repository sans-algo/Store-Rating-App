import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user") || "{}") : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Store Rating</Link>
        <div>
          <ul className="navbar-nav ms-auto">
            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Signup</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              </>
            ) : (
              <>
                {/* Role-based navigation */}
                {user?.role === 'ADMIN' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin</Link>
                  </li>
                )}
                
                {user?.role === 'ADMIN' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                )}
                
                {user?.role === 'OWNER' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/owner-dashboard">My Store Dashboard</Link>
                  </li>
                )}
                
                {user?.role === 'USER' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                )}
                
                {(user?.role === 'USER' || user?.role === 'OWNER') && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/rate-stores">Rate Stores</Link>
                  </li>
                )}
                
                {(user?.role === 'ADMIN' || user?.role === 'OWNER') && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/add-store">Add Store</Link>
                  </li>
                )}
                
                <li className="nav-item">
                  <Link className="nav-link" to="/update-password">Update Password</Link>
                </li>
                
                <li className="nav-item">
                  <button className="btn btn-danger btn-sm ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;