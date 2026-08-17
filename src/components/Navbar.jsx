import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

export default function Navbar() {
  const location = useLocation();
  const { cartItems } = useCart ? useCart() : { cartItems: [] };
  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // State to handle mobile menu toggle
  const [isOpen, setIsOpen] = useState(false);

  // Helper to check if a route is currently active
  const isActive = (path) => location.pathname === path;

  // Navigation Links List
  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'PRODUCTS', path: '/products' },
    { name: 'ABOUT', path: '/about' },
    { name: 'SERVICE', path: '/service' },
    { name: 'CONTACT', path: '/contact' },
    { name: 'LOGIN', path: '/login' },
  ];

  return (
    <>
      {/* CSS Styles for Responsive Toggle */}
      <style>{`
        .nav-links-container {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .hamburger-btn {
          display: none;
          background: transparent;
          border: none;
          color: #FFFFFF;
          font-size: 1.8rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        /* Mobile View Styles (768px and below) */
        @media (max-width: 768px) {
          .hamburger-btn {
            display: block;
          }

          .nav-links-container {
            display: ${isOpen ? 'flex' : 'none'};
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: #2B1E16;
            padding: 1.5rem 2rem 2rem 2rem;
            align-items: flex-start;
            gap: 1.2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 20px rgba(0,0,0,0.4);
            z-index: 9999;
          }

          .cart-btn-mobile {
            width: 100%;
            justify-content: center;
            margin-top: 0.5rem;
          }
        }
      `}</style>

      <nav
        style={{
          backgroundColor: '#2B1E16',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* BRAND LOGO */}
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          style={{
            color: '#FFFFFF',
            textDecoration: 'none',
            fontFamily: 'serif',
            fontSize: '1.6rem',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
          }}
        >
          Crumbs & Cups
        </Link>

        {/* HAMBURGER TOGGLE BUTTON */}
        <button
          className="hamburger-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* NAV LINKS & CART CONTAINER */}
        <div className="nav-links-container">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)} // Closes mobile menu upon clicking a link
              style={{
                color: isActive(link.path) ? '#D97706' : '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: '600',
                letterSpacing: '1px',
                borderBottom: isActive(link.path) ? '2px solid #D97706' : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'all 0.2s ease',
              }}
            >
              {link.name}
            </Link>
          ))}

          {/* SHOPPING CART BUTTON */}
          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="cart-btn-mobile"
            style={{
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#D97706',
              padding: '0.4rem 0.9rem',
              borderRadius: '20px',
            }}
          >
            🛒 Cart ({cartCount})
          </Link>
        </div>
      </nav>
    </>
  );
}