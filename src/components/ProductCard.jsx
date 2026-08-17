import React from 'react';

export default function ProductCard({ product }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        overflow: 'hidden',
        border: '1px solid #eee',
      }}
    >
      {/* IMAGE CONTAINER WITH STRICT MAX HEIGHT */}
      <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '8px' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Crops image cleanly without stretching
            display: 'block',
          }}
        />
      </div>

      {/* DETAILS SECTION */}
      <div style={{ marginTop: '12px', textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#333' }}>
          {product.name}
        </h3>
        <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666', minHeight: '36px' }}>
          {product.description}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '10px',
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#2c3e50' }}>
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <button
            style={{
              backgroundColor: '#d97706',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}