import React, { useState, useEffect } from 'react';
import { FiCopy, FiCheck, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function AuthenticatorSetup({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Display QR, 2: Verify code, 3: Backup codes
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(-1);

  useEffect(() => {
    if (isOpen && step === 1) {
      generateAuthenticator();
    }
  }, [isOpen, step]);

  const generateAuthenticator = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/auth/authenticator/setup',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
    } catch (error) {
      toast.error('Failed to generate authenticator');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code || code.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/auth/authenticator/verify',
        { secret, code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBackupCodes(response.data.backupCodes);
      setStep(3);
      toast.success('2FA enabled successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(-1), 2000);
  };

  const handleClose = () => {
    if (step === 3) {
      onSuccess && onSuccess();
    }
    setStep(1);
    setCode('');
    setQrCode('');
    setSecret('');
    setBackupCodes([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.4s ease cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Step 1: Display QR Code */}
        {step === 1 && (
          <>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              Set Up Authenticator
            </h2>
            <p style={{ color: '#565959', marginBottom: '24px', fontSize: '14px' }}>
              Scan this QR code with your authenticator app (Google Authenticator, Microsoft Authenticator, Authy, etc.)
            </p>

            {qrCode && (
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{
                    width: '200px',
                    height: '200px',
                    border: '2px solid #f0f0f0',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                />
              </div>
            )}

            {secret && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '12px', color: '#565959', marginBottom: '8px', fontWeight: '600' }}>
                  Or enter this key manually:
                </p>
                <div style={{
                  background: '#f7f8f8',
                  padding: '12px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  wordBreak: 'break-all',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span>{secret}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(secret);
                      toast.success('Copied!');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#febd69',
                      fontSize: '18px',
                    }}
                  >
                    <FiCopy />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #febd69 0%, #f3a847 100%)',
                color: '#0f1111',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow = '0 6px 20px rgba(243, 168, 71, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'none';
              }}
            >
              Next: Verify Code
            </button>
          </>
        )}

        {/* Step 2: Verify Code */}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              Verify Your Code
            </h2>
            <p style={{ color: '#565959', marginBottom: '24px', fontSize: '14px' }}>
              Enter the 6-digit code from your authenticator app
            </p>

            <div style={{ marginBottom: '24px' }}>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e8e8e8',
                  borderRadius: '6px',
                  fontSize: '20px',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontFamily: 'monospace',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#febd69'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e8e8e8'; }}
                disabled={loading}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f7f8f8',
                  color: '#0f1111',
                  border: '1px solid #d5d9d9',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                }}
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={verifyCode}
                disabled={loading || code.length !== 6}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: code.length === 6 ? 'linear-gradient(135deg, #febd69 0%, #f3a847 100%)' : '#ccc',
                  color: '#0f1111',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: code.length === 6 ? 'pointer' : 'not-allowed',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </>
        )}

        {/* Step 3: Backup Codes */}
        {step === 3 && (
          <>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#007600' }}>
              <FiCheck size={24} />
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                Save Your Backup Codes
              </h2>
            </div>

            <div style={{
              background: '#e8f5e9',
              border: '1px solid #a5d6a7',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '24px',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
            }}>
              <FiAlertCircle size={16} style={{ color: '#007600', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '13px', color: '#1b5e20', margin: 0 }}>
                Save these backup codes in a safe place. You can use them to access your account if you lose access to your authenticator app.
              </p>
            </div>

            <div style={{
              background: '#f7f8f8',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}>
              {backupCodes.map((backupCode, index) => (
                <div
                  key={index}
                  onClick={() => copyBackupCode(backupCode, index)}
                  style={{
                    background: '#fff',
                    padding: '12px',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#febd69';
                    e.currentTarget.style.background = '#fffbf0';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.background = '#fff';
                  }}
                >
                  <span>{backupCode}</span>
                  {copiedIndex === index ? (
                    <FiCheck size={14} style={{ color: '#007600' }} />
                  ) : (
                    <FiCopy size={14} style={{ color: '#999' }} />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #febd69 0%, #f3a847 100%)',
                color: '#0f1111',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow = '0 6px 20px rgba(243, 168, 71, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'none';
              }}
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
