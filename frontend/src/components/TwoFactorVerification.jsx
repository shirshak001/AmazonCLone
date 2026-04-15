import React, { useState } from 'react';
import { FiLock, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function TwoFactorVerification({ email, onSuccess, onBack }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!code || code.length < 6) {
      setError('Please enter a valid code');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        'http://localhost:5000/api/auth/verify-2fa',
        { email: email.toLowerCase(), code }
      );

      localStorage.setItem('token', response.data.token);
      toast.success('Login successful with 2FA!');
      onSuccess(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
      toast.error(error.response?.data?.message || 'Verification failed');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleVerify();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      animation: 'slideUp 0.4s ease cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <FiLock size={48} style={{ color: '#febd69', marginBottom: '12px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
          Two-Factor Authentication
        </h2>
        <p style={{ color: '#565959', fontSize: '14px' }}>
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div style={{ width: '100%', marginBottom: '16px' }}>
        <input
          type="text"
          maxLength="6"
          placeholder="000000"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/[^0-9]/g, ''));
            setError('');
          }}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            border: error ? '2px solid #cc0c39' : '2px solid #e8e8e8',
            borderRadius: '6px',
            fontSize: '20px',
            letterSpacing: '8px',
            textAlign: 'center',
            fontWeight: '600',
            fontFamily: 'monospace',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            outline: 'none',
          }}
          onFocus={(e) => {
            if (!error) e.target.style.borderColor = '#febd69';
          }}
          onBlur={(e) => {
            if (!error) e.target.style.borderColor = '#e8e8e8';
          }}
        />
      </div>

      {error && (
        <div style={{
          width: '100%',
          padding: '12px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          color: '#cc0c39',
          fontSize: '13px',
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
        You can also use one of your backup codes
      </p>

      <div style={{ width: '100%', display: 'flex', gap: '12px' }}>
        <button
          onClick={onBack}
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            background: '#f7f8f8',
            color: '#0f1111',
            border: '1px solid #d5d9d9',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <FiArrowLeft size={16} /> Back
        </button>

        <button
          onClick={handleVerify}
          disabled={loading || code.length !== 6}
          style={{
            flex: 1,
            padding: '12px',
            background: code.length === 6 ? 'linear-gradient(135deg, #febd69 0%, #f3a847 100%)' : '#ccc',
            color: '#0f1111',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: code.length === 6 && !loading ? 'pointer' : 'not-allowed',
            fontSize: '15px',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            if (code.length === 6 && !loading) {
              e.target.style.boxShadow = '0 6px 20px rgba(243, 168, 71, 0.4)';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseOut={(e) => {
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'none';
          }}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );
}
