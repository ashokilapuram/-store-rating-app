import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserLock } from 'react-icons/fa';
import api from "../../config/api";
import styles from "./Login.module.css";
import loginImg from "../../assets/images/login-illustration.jpeg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      console.log('Attempting login with:', { email, password: '***' });
      console.log('API URL:', api.login);
      
      const res = await axios.post(api.login, {
        email,
        password,
      });
      
      console.log('Login response:', res.data);
      
      const { token } = res.data;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        name: payload.name || email.split('@')[0],
        email: payload.email || email,
        role: role
      }));
      
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "user") navigate("/user/dashboard");
      else if (role === "owner") navigate("/owner/dashboard");
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      
      if (err.response) {
        // Server responded with error
        setErrorMsg(err.response.data.error || "Login failed");
      } else if (err.request) {
        // Network error
        setErrorMsg("Network error - please check your connection");
      } else {
        // Other error
        setErrorMsg("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["login-bg"]}>
      <div className={styles["login-container"]}>
        <div className={styles["login-wrapper"]}>
          <div className={styles["login-left"]}>
            <img src={loginImg} alt="Login Illustration" className={styles["login-illustration"]} />
            <div className={styles["login-icon-box"]}>
              <FaUserLock className={styles["login-icon"]} />
            </div>
          </div>

          <div className={styles["login-right"]}>
            <h2 className={styles["login-title"]}>Sign In</h2>
            <form onSubmit={handleLogin} className={styles["login-form"]}>
              {errorMsg && <p className={styles["login-error"]}>{errorMsg}</p>}

              <div className={styles["input-group"]}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles["login-input"]}
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>

              <div className={styles["input-group"]}>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles["login-input"]}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>

              <button 
                className={styles["login-button"]} 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
