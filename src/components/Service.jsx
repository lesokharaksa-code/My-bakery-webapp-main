import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function Service() {
  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      price: 45,
      sub: 'Perfect for small gatherings (up to 10 people)',
      features: [
        '10 assorted pastries',
        '1 loaf of your choice',
        '10 drinks (coffee or tea)',
        'Paper packaging included',
        '24hr advance order',
      ],
    },
    {
      id: 'party',
      name: 'Party Pack',
      price: 110,
      featured: true,
      sub: 'Great for birthday parties (up to 25 people)',
      features: [
        '25 assorted pastries',
        '2 loaves of your choice',
        '1 custom celebration cake',
        '25 drinks of your choice',
        'Premium box packaging',
        '48hr advance order',
      ],
    },
    {
      id: 'corporate',
      name: 'Corporate Pack',
      price: 220,
      sub: 'Ideal for office events (up to 50 people)',
      features: [
        '50 assorted pastries & breads',
        '4 loaves of your choice',
        '2 custom cakes',
        '50 drinks of your choice',
        'Branded packaging available',
        'Free delivery within city',
        '72hr advance order',
      ],
    },
  ];

  const [selectedPack, setSelectedPack] = useState('Party Pack');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [loaves, setLoaves] = useState(2);
  const [pastries, setPastries] = useState(20);
  const [drinks, setDrinks] = useState(15);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitPartyOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'orders'), {
        customerName,
        email,
        eventDate,
        packageType: selectedPack,
        customRequirements: {
          loavesCount: loaves,
          pastriesCount: pastries,
          drinksCount: drinks,
        },
        status: 'Pending Inquiry',
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting party order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', color: '#2B1E16', minHeight: '100vh', padding: '3rem 1.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* HERO HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: '#D97706', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Catering & Events
          </span>
          <h1 style={{ fontSize: '3rem', fontFamily: 'serif', margin: '0.5rem 0', color: '#2B1E16' }}>
            Our <i style={{ color: '#D97706' }}>Services</i>
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Freshly baked packages crafted perfectly for your special gatherings.
          </p>
        </div>

        {/* PACKAGE CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '2rem',
                border: pkg.featured ? '2px solid #D97706' : '1px solid #E5E7EB',
                boxShadow: pkg.featured ? '0 10px 25px rgba(217, 119, 6, 0.15)' : '0 4px 6px rgba(0,0,0,0.05)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {pkg.featured && (
                <span style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: '#D97706', color: '#FFF', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  MOST POPULAR
                </span>
              )}

              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', color: '#2B1E16' }}>{pkg.name}</h3>
              <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#D97706', marginBottom: '0.5rem' }}>
                ${pkg.price}
              </div>
              <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>{pkg.sub}</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
                {pkg.features.map((feat, idx) => (
                  <li key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6', fontSize: '0.9rem', color: '#374151' }}>
                    ✓ {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPack(pkg.name)}
                style={{
                  backgroundColor: selectedPack === pkg.name ? '#2B1E16' : '#D97706',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.85rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                {selectedPack === pkg.name ? '✓ Selected' : 'Select Package'}
              </button>
            </div>
          ))}
        </div>

        {/* CUSTOM ORDER BOOKING FORM */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '12px', border: '1px solid #E5E7EB', maxWidth: '700px', margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontFamily: 'serif', marginTop: 0, color: '#2B1E16', fontSize: '1.8rem' }}>Book Party Catering</h2>
          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Selected Baseline: <strong style={{ color: '#D97706' }}>{selectedPack}</strong>
          </p>

          {submitted ? (
            <div style={{ backgroundColor: '#ECFDF5', color: '#047857', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>🎉 Inquiry Sent Successfully!</h3>
              <p style={{ margin: 0 }}>We received your request and will contact you directly to confirm delivery details.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitPartyOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 'bold', color: '#374151' }}>Your Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 'bold', color: '#374151' }}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 'bold', color: '#374151' }}>Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}
                />
              </div>

              <h4 style={{ margin: '1.5rem 0 0.8rem 0', color: '#2B1E16', fontSize: '1.1rem' }}>Customize Item Counts</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#4B5563', fontWeight: 'bold' }}>Loaves of Bread</label>
                  <input
                    type="number"
                    min="1"
                    value={loaves}
                    onChange={(e) => setLoaves(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #D1D5DB', marginTop: '0.2rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#4B5563', fontWeight: 'bold' }}>Pastries</label>
                  <input
                    type="number"
                    min="5"
                    value={pastries}
                    onChange={(e) => setPastries(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #D1D5DB', marginTop: '0.2rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#4B5563', fontWeight: 'bold' }}>Drinks</label>
                  <input
                    type="number"
                    min="5"
                    value={drinks}
                    onChange={(e) => setDrinks(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #D1D5DB', marginTop: '0.2rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.9rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Submitting...' : 'Send Party Order Request'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}