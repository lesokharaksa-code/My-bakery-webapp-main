import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. ADD ALL YOUR ADMIN EMAILS HERE (Use lowercase)
  const ADMIN_EMAILS = [
    'admin@bakery.com',
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      
      // Clean and normalize the logged-in email
      const loggedInEmail = (userCredential.user.email || cleanEmail).trim().toLowerCase();

      // Check if logged-in email matches any admin email in the array
      const isAdmin = ADMIN_EMAILS.some(
        (adminEmail) => adminEmail.trim().toLowerCase() === loggedInEmail
      );

      if (isAdmin) {
        // Route Admin to Dashboard
        navigate('/dashboard');
      } else {
        // Route Regular Customer to Home Page
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Friendly error handling based on Firebase code
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '4rem auto',
        padding: '2.5rem 2rem',
        border: '1px solid #fbc900',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#3b2a1a', fontFamily: 'serif' }}>
        Login
      </h2>

      {error && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.6rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', color: '#5C4033', fontSize: '0.9rem', fontWeight: '600' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@bakery.com"
            required
            style={{
              width: '100%',
              padding: '0.65rem 0.8rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', color: '#5C4033', fontSize: '0.9rem', fontWeight: '600' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              width: '100%',
              padding: '0.65rem 0.8rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#ccc' : '#d97706',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
          }}
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>

      {/* NAVIGATION LINKS */}
      <div
        style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
      >
        <div>
          <Link
            to="/forgot-password"
            style={{ color: '#d97706', textDecoration: 'none', fontWeight: '500' }}
          >
            Forgot Password?
          </Link>
        </div>
        <div style={{ color: '#666' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{ color: '#d97706', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}