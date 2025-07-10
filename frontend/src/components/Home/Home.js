import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import styles from './Home.module.css';

function Home() {
  const [testResult, setTestResult] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const testAPI = async () => {
    setIsTesting(true);
    setTestResult('');
    
    try {
      console.log('Testing API connection to:', `${API_BASE_URL}/api/test`);
      const response = await axios.get(`${API_BASE_URL}/api/test`);
      console.log('API test response:', response.data);
      setTestResult(`✅ API is working! Response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('API test error:', error);
      setTestResult(`❌ API test failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to StoreRate</h1>
      <p>Rate and review your favorite stores!</p>
      
      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>API Connection Test</h3>
        <p>Current API URL: <code>{API_BASE_URL}</code></p>
        <button 
          onClick={testAPI} 
          disabled={isTesting}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: isTesting ? 'not-allowed' : 'pointer'
          }}
        >
          {isTesting ? 'Testing...' : 'Test API Connection'}
        </button>
        {testResult && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <pre>{testResult}</pre>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/login" style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Login
        </a>
        <a href="/register" style={{ padding: '10px 20px', backgroundColor: '#17a2b8', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Register
        </a>
      </div>
    </div>
  );
}

export default Home;
