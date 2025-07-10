import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaStore, FaCrown } from 'react-icons/fa';
import API_BASE_URL from "../../config/api";
import styles from './Register.module.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      alert("Registration successful! Please login to continue.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles["register-bg"]}>
      <div className={styles["register-container"]}>
        <div className={styles["register-wrapper"]}>
          <div className={styles["register-left"]}>
            <div className={styles["register-icon-box"]}>
              <FaUserPlus className={styles["register-icon"]} />
            </div>
            <h3 className={styles["register-welcome"]}>Join StoreRate</h3>
            <p className={styles["register-subtitle"]}>
              Create your account and start rating stores today!
            </p>
          </div>

          <div className={styles["register-right"]}>
            <h2 className={styles["register-title"]}>Create Account</h2>
            <form onSubmit={handleSubmit} className={styles["register-form"]}>
              {error && <p className={styles["register-error"]}>{error}</p>}

              <div className={styles["input-group"]}>
                <label>
                  <FaUser className={styles["input-icon"]} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className={styles["register-input"]}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <FaEnvelope className={styles["input-icon"]} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className={styles["register-input"]}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="Enter your email address"
                />
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <FaLock className={styles["input-icon"]} />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className={styles["register-input"]}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                />
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <FaCrown className={styles["input-icon"]} />
                  Account Type
                </label>
                <select
                  name="role"
                  className={styles["register-select"]}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">
                    <FaUser /> Regular User
                  </option>
                  <option value="owner">
                    <FaStore /> Store Owner
                  </option>
                </select>
              </div>

              <button className={styles["register-button"]}>
                <FaUserPlus className={styles["button-icon"]} />
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
