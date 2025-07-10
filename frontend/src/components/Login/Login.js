import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserLock } from 'react-icons/fa';
import API_BASE_URL from "../../config/api";
import styles from "./Login.module.css";
import loginImg from "../../assets/images/login-illustration.jpeg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token } = res.data;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      localStorage.setItem("token", token);
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "user") navigate("/user/dashboard");
      else if (role === "owner") navigate("/owner/dashboard");
    } catch (err) {
      setErrorMsg("Invalid email or password");
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
                />
              </div>

              <button className={styles["login-button"]}>Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
