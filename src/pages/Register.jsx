import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('🎉 Account created successfully!');
      navigate('/dashboard'); // Redirect to dashboard after registration
    } catch (err) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '12px', border: '1px solid #E5E7EB', width: '100%', maxWidth: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
        
        <h2 style={{ fontFamily: 'serif', margin: '0 0 0.5rem 0', color: '#2B1E16', textAlign: 'center' }}>Create Account</h2>
        <p style={{ color: '#666', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' }}>Register to manage Crumbs & Cups dashboard</p>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.3rem' }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CCC', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.3rem' }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CCC', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.3rem' }}>Confirm Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#D97706', fontWeight: 'bold', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}