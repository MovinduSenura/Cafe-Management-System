import React, { useState } from "react";
import "../pages/CustomerLogin.css";

function LoginForm() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
  };

  return (
    <div className="login-background">
      <div className="login-center">
      <div className="form-name">
        <h2>Login</h2>
    <div className="login-form-container">
      <div className="loginForm"> {/* Separate div */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group ">
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
    </div>
    </div>
    </div>
    </div>
  );
}

export default LoginForm;
