import React from 'react';
import { Link } from 'react-router-dom';

export default function FeaturedItems({ products = [] }) {
  // Example dummy fallback items if products prop isn't passed yet
  const items = products.length > 0 ? products : [
    { id: '1', name: 'BrownBread', category: 'LOAF', price: '$3.50', image: 'https://via.placeholder.com/400' },
    { id: '2', name: 'WhiteBread', category: 'BREADS', price: '$2.00', image: 'https://via.placeholder.com/150' },
    { id: '3', name: 'Blueberry Loaf Cake', category: 'CAKE LOAF', price: '$4.00', image: 'https://via.placeholder.com/150' },
  ];

  const mainItem = items[0];
  const sideItems = items.slice(1, 3);

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#c88032', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
          FRESHLY MADE TODAY
        </p>
        <h2 style={{ fontFamily: 'serif', fontSize: '2.2rem', margin: 0, color: '#222' }}>
          Featured <i>Items</i>
        </h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Find your favourite bakes and brews, made fresh this morning.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Main Large Hero Card */}
        {mainItem && (
          <div
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), transparent), url(${mainItem.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '1.5rem',
              color: '#fff',
            }}
          >
            <span style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.8 }}>{mainItem.category}</span>
            <h3 style={{ margin: '0.3rem 0', fontSize: '1.5rem' }}>{mainItem.name}</h3>
            <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold' }}>{mainItem.price}</p>
            <div>
              <Link
                to={`/products/${mainItem.id}`}
                style={{
                  backgroundColor: '#c88032',
                  color: '#fff',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  display: 'inline-block',
                }}
              >
                VIEW ITEM
              </Link>
            </div>
          </div>
        )}

        {/* Side Stack Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {sideItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                padding: '1rem',
                gap: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.7rem', color: '#999', letterSpacing: '1px' }}>{item.category}</span>
                <h4 style={{ margin: '0.2rem 0', color: '#222' }}>{item.name}</h4>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#c88032', fontSize: '0.9rem' }}>{item.price}</p>
              </div>
              <Link
                to={`/products/${item.id}`}
                style={{
                  backgroundColor: '#c88032',
                  color: '#fff',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                }}
              >
                VIEW ITEM
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}