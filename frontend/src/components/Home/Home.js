import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaGoogle, FaSignInAlt, FaUserPlus, FaStore } from 'react-icons/fa';
import styles from './Home.module.css';
import storeImg from '../../assets/images/store-icon.jpeg';

function Home() {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(false);
    }, 4000); // Hide modal after 4s
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles['home-bg']}>
      <div className={styles['home-container']}>
        {/* MODAL */}
        {showModal && (
          <div className={styles['modal-overlay']}>
            <div className={styles['modal-box']}>
              <FaStore className={styles['modal-icon']} />
              <h3>Store Rating App</h3>
              <p>Built by <strong>Ashok Ilapuram</strong></p>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className={styles['home-left']}>
          <h1 className={styles['home-title']}>
            Welcome to <span className={styles['brand-gradient']}>Store Rating App</span>
          </h1>
          <p className={styles['home-subtitle']}>
            Rate stores, see feedback, and manage ratings.
          </p>
          <div className={styles['home-btn-group']}>
            <Link to="/login" className={`${styles['home-btn']} ${styles['home-btn-primary']}`}>
              <FaSignInAlt className={styles['btn-icon']} /> Login
            </Link>
            <Link to="/register" className={`${styles['home-btn']} ${styles['home-btn-secondary']}`}>
              <FaUserPlus className={styles['btn-icon']} /> Register
            </Link>
          </div>
        </div>

        <div className={styles['home-right']}>
          <div className={styles['home-card']}>  
            <img src={storeImg} alt="Store Icon" className={styles['store-img']} />
            <div className={styles['home-stars']}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={styles['star']} />
              ))}
            </div>
            <p className={styles['home-review']}>
              Great store with excellent service.<br />Highly recommend!
            </p>
            <div className={styles['home-google']}>
              <FaGoogle className={styles['google-icon']} /> Google
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
