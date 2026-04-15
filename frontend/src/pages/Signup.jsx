import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiPhone, FiCheck, FiShield } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import AuthenticatorSetup from '../components/AuthenticatorSetup';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAuthenticatorSetup, setShowAuthenticatorSetup] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const getPasswordStrength = (password) => {
    if (!password) return { level: '', text: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 'weak', text: 'Weak' };
    if (strength <= 4) return { level: 'medium', text: 'Medium' };
    return { level: 'strong', text: 'Strong' };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
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

    if (!validateForm()) return;

    setLoading(true);

    const result = await signup({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || null,
    });

    if (result.success) {
      toast.success('Account created successfully!');
      setAccountCreated(true);
      setShowAuthenticatorSetup(true);
    } else {
      setErrors({ submit: result.error || 'Account creation failed' });
      toast.error(result.error || 'Account creation failed');
    }

    setLoading(false);
  };

  const handleAuthenticatorSuccess = () => {
    setShowAuthenticatorSetup(false);
    toast.success('2FA enabled successfully! Your account is now secure.');
    navigate('/');
  };

  const handleSkip2FA = () => {
    setShowAuthenticatorSetup(false);
    navigate('/');
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join Amazon Clone today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FiUser size={16} /> First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.firstName && (
                  <div className="error-message">
                    <span>✕</span> {errors.firstName}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiUser size={16} /> Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.lastName && (
                  <div className="error-message">
                    <span>✕</span> {errors.lastName}
                  </div>
                )}
              </div>
            </div>

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
                <FiPhone size={16} /> Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
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
                  placeholder="Create a strong password"
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
                  }}
                  disabled={loading}
                >
                  {showPassword ? '✕' : '◯'}
                </button>
              </div>

              {formData.password && (
                <>
                  <div className="password-strength">
                    <div 
                      className={`password-strength-bar ${passwordStrength.level}`}
                    />
                  </div>
                  <div className={`password-strength-text ${passwordStrength.level}`}>
                    Password strength: {passwordStrength.text}
                  </div>
                </>
              )}

              {errors.password && (
                <div className="error-message">
                  <span>✕</span> {errors.password}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiLock size={16} /> Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  }}
                  disabled={loading}
                >
                  {showConfirmPassword ? '✕' : '◯'}
                </button>
              </div>

              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="error-message" style={{ color: '#007600', marginTop: '4px' }}>
                  <FiCheck size={14} /> Passwords match
                </div>
              )}

              {errors.confirmPassword && (
                <div className="error-message">
                  <span>✕</span> {errors.confirmPassword}
                </div>
              )}
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                className="checkbox-input"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                disabled={loading}
              />
              <label htmlFor="agreeToTerms" className="checkbox-label">
                I agree to the <Link to="/terms" className="auth-link">terms and conditions</Link>
              </label>
            </div>

            {errors.agreeToTerms && (
              <div className="error-message">
                <span>✕</span> {errors.agreeToTerms}
              </div>
            )}

            {errors.submit && (
              <div className="error-message" style={{ marginBottom: '12px' }}>
                <span>⚠</span> {errors.submit}
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in here</Link>
            </p>
            <p className="auth-disclaimer">
              <FiCheck size={12} style={{ display: 'inline' }} /> Secured by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>

      <AuthenticatorSetup
        isOpen={showAuthenticatorSetup}
        onClose={() => setShowAuthenticatorSetup(false)}
        onSuccess={handleAuthenticatorSuccess}
      />

      {showAuthenticatorSetup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 999,
        }}>
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            gap: '12px',
            zIndex: 1001,
          }}>
            <button
              onClick={handleSkip2FA}
              style={{
                padding: '10px 24px',
                background: '#f7f8f8',
                color: '#0f1111',
                border: '1px solid #d5d9d9',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#999';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#d5d9d9';
              }}
            >
              Skip for Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
