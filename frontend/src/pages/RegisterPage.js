import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import '../styles/global.css';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Register the user
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/users',
        { name, email, password },
        config
      );

      // Log in the user after registration
      const loginResponse = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password },
        config
      );
      
      // Store user info in local storage
      localStorage.setItem('userInfo', JSON.stringify(loginResponse.data));
      
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      alert(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join our community today</p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <Form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter your full name"
              name="name"
              value={name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Create a password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              placeholder="Confirm your password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="btn-register"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Creating Account...' : 'Sign Up'}
          </button>
        </Form>

        <div className="register-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
