import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "./Login.css";

const Login = () => {
  const [customerNIC, setCustomerNIC] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make login request
      await axios.get(`http://localhost:8000/customer/login/${customerNIC}`);
      // Handle successful login, here redirecting to the user profile page
      navigate(`/profile/${customerNIC}`);
    } catch (error) {
      // Handle error, display error message to the user
      setError('Failed to login. Please check your NIC and try again.');
    }
  };


  return (
    <div className="login-background">
      <div className="login-center">
        <div className="form-name">
          <h2>Login</h2>
          <div className="login-form-container">
            <div className="loginForm">
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <form onSubmit={handleSubmit} className="login-form">
              <div form-group>
                {/* <label htmlFor="customerNIC">Customer NIC:</label> */}
                <input
                type="text"
                id="customerNIC"
                placeholder='NIC'
                value={customerNIC}
                onChange={(e) => setCustomerNIC(e.target.value)}
              />
              </div>
              <button type='submit' className="submit-button">Login</button>
              </form>
            </div>
          </div>
        </div>
        <div className='maincopyright'> 
          <div className='copyright'>
            <p>©</p>
            <p>Copyright 2024 <b>ESPRESSO ELEGANCE.</b></p>
            <p>All Rights Reserved</p>
            <small>Designed by <w className='daedra'>DAEDRA</w></small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
