import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
const cors = require('cors'); 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

      try {
        const response = await axios.post('http://localhost:5000/api/auth/login',{
          email,
          password
      });
      const {token} = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('loggedIn', true);
        navigate('/dashboard');
      }
      catch(error){
        console.error("Error logging in", error);
      }
      finally{
        setLoading(false);
      }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-boxes login-left"></div>
        <div className="login-boxes login-right">
          <h2 className="login-heading">Login</h2>
          <form onSubmit={submitHandler}>
            <input
               required onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              type="text"
              placeholder="Email"
            />
            <input
               required onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              type="password"
              placeholder="Password"
            />
            <button className="login-input login-btn" type="submit">
              {isLoading ? <i className="fa-solid fa-spinner fa-spin-pulse"></i> : "Login"}
            </button>
          </form>
          <Link to="/register" className="register-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
