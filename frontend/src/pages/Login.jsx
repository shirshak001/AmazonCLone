import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiCheck } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import TwoFactorVerification from '../components/TwoFactorVerification';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      if (result.requiresTwoFactor) {
        setRequiresTwoFactor(true);
      } else {
        toast.success('Login successful!');
        if (formData.rememberMe) {
          localStorage.setItem('rememberEmail', formData.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }
        navigate('/');
      }
    } else {
      setErrors({ submit: result.error || 'Login failed' });
      toast.error(result.error || 'Login failed');
    }

    setLoading(false);
  };

  const handle2FAVerifySuccess = (userData) => {
    if (formData.rememberMe) {
      localStorage.setItem('rememberEmail', formData.email);
    } else {
      localStorage.removeItem('rememberEmail');
    }
    navigate('/');
  };

  if (requiresTwoFactor) {
    return (
      <>
        <Navbar />
        <div className="auth-container">
          <div className="auth-card">
            <TwoFactorVerification
              email={formData.email}
              onSuccess={handle2FAVerifySuccess}
              onBack={() => {
                setRequiresTwoFactor(false);
                setFormData({ ...formData, password: '' });
              }}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">Welcome back to Amazon Clone</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                <FiMail size={16} /> Email Address
              </label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && (
                <div className="error-message">
                  <span>✕</span> {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiLock size={16} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#565959',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? '✕' : '◯'}
                </button>
              </div>
              {errors.password && (
                <div className="error-message">
                  <span>✕</span> {errors.password}
                </div>
              )}
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="checkbox-input"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <label htmlFor="rememberMe" className="checkbox-label">
                Keep me signed in
              </label>
            </div>

            {errors.submit && (
              <div className="error-message" style={{ marginBottom: '12px' }}>
                <span>⚠</span> {errors.submit}
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">Create one</Link>
            </p>
            <p style={{ fontSize: '12px', color: '#0066c0', marginBottom: '8px' }}>
              <Link to="/forgot-password" className="auth-link">Forgot your password?</Link>
            </p>
            <p className="auth-disclaimer">
              <FiCheck size={12} style={{ display: 'inline' }} /> Secured by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
