import React, { useState } from "react";
import "../pages/CustomerLogin.css";

function LoginForm() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
  };

  

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form loginForm">
        <div className="form-group FormGroup">
          <label htmlFor="username"></label>
          <input
            type="text"
            id="username"
            placeholder="NIC"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
