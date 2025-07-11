import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import storeIcon from '../../assets/images/store-icon.jpeg';

function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className={styles['home-bg']}></div>
      <div className={styles['home-container']}>
        <div className={styles['home-left']}>
          <h1 className={styles['home-title']}>
            Welcome to <span className={styles['brand-gradient']}>StoreRate</span>
          </h1>
          <p className={styles['home-subtitle']}>
            Discover, rate, and review your favorite stores. Join our community of shoppers and help others make informed decisions.
          </p>
          <div className={styles['home-btn-group']}>
            <Link to="/login" className={`${styles['home-btn']} ${styles['home-btn-primary']}`}>
              <span className={styles['btn-icon']}>🚀</span>
              Get Started
            </Link>
            <Link to="/register" className={`${styles['home-btn']} ${styles['home-btn-secondary']}`}>
              <span className={styles['btn-icon']}>✨</span>
              Join Now
            </Link>
          </div>
        </div>
        
        <div className={styles['home-right']}>
          <div className={styles['home-card']}>
            <img src={storeIcon} alt="Store Rating" className={styles['store-img']} />
            <div className={styles['home-stars']}>
              <span className={styles['star']}>⭐</span>
              <span className={styles['star']}>⭐</span>
              <span className={styles['star']}>⭐</span>
              <span className={styles['star']}>⭐</span>
              <span className={styles['star']}>⭐</span>
            </div>
            <p className={styles['home-review']}>
              "Amazing platform! Found the best coffee shop in town thanks to StoreRate reviews."
            </p>
            <div className={styles['home-google']}>
              <span className={styles['google-icon']}>📱</span>
              Trusted by 10,000+ users
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles['modal-overlay']} onClick={() => setShowModal(false)}>
          <div className={styles['modal-box']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-icon']}>🎉</div>
            <h3>Welcome to StoreRate!</h3>
            <p>Start exploring stores and sharing your experiences with the community.</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
