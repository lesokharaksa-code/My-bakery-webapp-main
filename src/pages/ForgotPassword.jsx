import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('📩 Password reset link sent! Check your email inbox.');
      setEmail('');
    } catch (err) {
      console.error('Reset password error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '12px', border: '1px solid #E5E7EB', width: '100%', maxWidth: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
        
        <h2 style={{ fontFamily: 'serif', margin: '0 0 0.5rem 0', color: '#2B1E16', textAlign: 'center' }}>Reset Password</h2>
        <p style={{ color: '#666', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' }}>Enter your email to receive a password reset link</p>

        {message && (
          <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.3rem' }}>Registered Email</label>
            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CCC', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#D97706',
              color: '#FFF',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <Link to="/login" style={{ color: '#6B7280', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}