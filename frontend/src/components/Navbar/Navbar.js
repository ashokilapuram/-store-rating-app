import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaStore, FaUser, FaCog } from 'react-icons/fa';
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FaStore className="navbar-logo-icon" />
        <span className="navbar-logo-text">StoreRate</span>
      </div>
      
      <ul className="navbar-links">
        {!token && (
          <>
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <FaHome className="nav-icon" />
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                <FaSignInAlt className="nav-icon" />
                <span>Login</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link register-link">
                <FaUserPlus className="nav-icon" />
                <span>Register</span>
              </Link>
            </li>
          </>
        )}

        {token && role === "admin" && (
          <li className="nav-item">
            <Link to="/admin/dashboard" className="nav-link">
              <FaCog className="nav-icon" />
              <span>Admin Dashboard</span>
            </Link>
          </li>
        )}

        {token && role === "owner" && (
          <li className="nav-item">
            <Link to="/owner/dashboard" className="nav-link">
              <FaStore className="nav-icon" />
              <span>Owner Dashboard</span>
            </Link>
          </li>
        )}

        {token && role === "user" && (
          <li className="nav-item">
            <Link to="/user/dashboard" className="nav-link">
              <FaUser className="nav-icon" />
              <span>User Dashboard</span>
            </Link>
          </li>
        )}

        {token && (
          <li className="nav-item">
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt className="nav-icon" />
              <span>Logout</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
