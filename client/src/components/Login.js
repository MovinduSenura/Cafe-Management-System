// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [customerNIC, setCustomerNIC] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // You can handle login logic here
//     // For simplicity, let's just redirect to a dashboard page
//     navigate(`/profile/${customerNIC}`);
//   };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make login request
      const response = await axios.get(`http://localhost:8000/customer/login/${customerNIC}`);
      // Handle successful login, here redirecting to the user profile page
      navigate(`/profile/${customerNIC}`);
    } catch (error) {
      // Handle error, display error message to the user
      setError('Failed to login. Please check your NIC and try again.');
    }
  };


  return (
    <div className="mt-5">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerNIC">Customer NIC:</label>
          <input
            type="text"
            id="customerNIC"
            value={customerNIC}
            onChange={(e) => setCustomerNIC(e.target.value)}
          />
        </div>
        <button type='submit'>Login</button>
       
      </form>
    </div>
  );
};

export default Login;
