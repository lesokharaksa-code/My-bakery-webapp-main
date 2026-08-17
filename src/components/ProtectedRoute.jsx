import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingStatus(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingStatus) {
    return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Verifying authentication...</p>;
  }

  // Redirect to login page if no authenticated admin is found
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}