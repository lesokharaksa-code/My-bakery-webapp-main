import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  // Safe helper function to resolve public assets for GitHub Pages
  const getAssetPath = (path) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const base = import.meta.env.BASE_URL || '/';
    return `${base}${cleanPath}`;
  };

  const heroImages = [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1400',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1400',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1400',
  ];

  const tickerItems = [
    'Freshly Baked Daily',
    '100% Organic Flour',
    'Artisan Specialty Coffee',
    'Handcrafted Breads',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#FAF7F2', color: '#333' }}>
      
      {/* KEYFRAME ANIMATION INJECTION */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .clickable-btn {
          transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease, box-shadow 0.2s ease !important;
          cursor: pointer;
        }
        .clickable-btn:hover {
          transform: translateY(-2px);
        }
        .clickable-btn:active {
          transform: scale(0.94) translateY(0px) !important;
        }
        .card-motion {
          transition: transform 0.25s ease, box-shadow 0.25s ease !important;
        }
        .card-motion:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.08) !important;
        }
        .card-motion:active {
          transform: scale(0.98) !important;
        }
      `}</style>

      {/* ════════════════ HERO SECTION ════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#FFFFFF',
          padding: '3rem 1rem',
          overflow: 'hidden',
          backgroundColor: '#1E1815',
        }}
      >
        {/* Slideshow Background Layers */}
        {heroImages.map((imgUrl, index) => (
          <div
            key={imgUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${imgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentImageIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: 1,
            }}
          />
        ))}

        {/* Hero Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '750px',
            padding: '0 1rem',
          }}
        >
          <p
            style={{
              color: '#D97706',
              letterSpacing: '2px',
              fontSize: '0.8rem',
              fontWeight: '600',
              marginBottom: '1.2rem',
              textTransform: 'uppercase',
            }}
          >
            ARTISAN BAKERY & CAFÉ · EST. 2020
          </p>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontFamily: 'serif',
              margin: '0.5rem 0',
              lineHeight: 1.15,
              fontWeight: 'bold',
            }}
          >
            Freshly Baked, <br />
            <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>
              Just for You!
            </span>
          </h1>

          <p
            style={{
              margin: '1.5rem auto 2.2rem auto',
              fontSize: '0.95rem',
              color: '#EFEFEF',
              maxWidth: '600px',
              lineHeight: 1.5,
              fontWeight: '300',
            }}
          >
            Handcrafted breads, pastries & specialty drinks made fresh every morning with love.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/products"
              className="clickable-btn"
              style={{
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                textDecoration: 'none',
                padding: '0.8rem 2rem',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              EXPLORE MENU
            </Link>

            <Link
              to="/about"
              className="clickable-btn"
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                textDecoration: 'none',
                border: '1px solid #FFFFFF',
                padding: '0.8rem 2rem',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              OUR STORY
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════ TICKER TAPE ════════════════ */}
      <div style={{ backgroundColor: '#2B1E16', color: '#F3E5D8', padding: '1rem 0', overflow: 'hidden', borderTop: '1px solid rgba(229,166,99,0.2)' }}>
        <div style={{ display: 'flex', gap: '2.5rem', whiteSpace: 'nowrap', animation: 'scroll 25s linear infinite' }}>
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '500' }}>
              <span style={{ color: '#D97706' }}>✦</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════ FEATURED ITEMS ════════════════ */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto 5rem auto', padding: '0 1.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p
            style={{
              color: '#D97706',
              fontSize: '0.75rem',
              letterSpacing: '2px',
              fontWeight: '600',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            FRESHLY MADE TODAY
          </p>
          <h2
            style={{
              fontSize: '2.5rem',
              fontFamily: 'serif',
              color: '#2B1E16',
              margin: 0,
              fontWeight: 'bold',
            }}
          >
            Featured <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>Items</span>
          </h2>
          <p style={{ color: '#666666', marginTop: '0.6rem', fontSize: '0.9rem' }}>
            Find your favourite bakes and brews, made fresh this morning.
          </p>
        </div>

        {/* Featured Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
          
          {/* Main Hero Card with Motion */}
          <div className="card-motion" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            <img 
              src={getAssetPath('images/BrownBread.jpg')} 
              alt="Brown Bread" 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(43, 30, 22, 0.95) 0%, rgba(0,0,0,0.2) 70%)' }} />
            <div style={{ position: 'relative', zIndex: 2, color: '#fff' }}>
              <span style={{ backgroundColor: '#D97706', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Signature Loaf</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', margin: '0.6rem 0 0.3rem 0', fontWeight: '400' }}>Brown Bread</h3>
              <p style={{ color: '#F3E5D8', fontSize: '0.9rem', marginBottom: '1.2rem', opacity: 0.9 }}>Crispy crust with a soft, naturally fermented center.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#E5A663' }}>$4.50</span>
                <Link to="/products" className="clickable-btn" style={{ padding: '0.6rem 1.4rem', backgroundColor: '#fff', color: '#2B1E16', textDecoration: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.85rem' }}>View Item</Link>
              </div>
            </div>
          </div>

          {/* Secondary Cards with Motion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between' }}>
            
            <div className="card-motion" style={{ display: 'flex', gap: '1.2rem', backgroundColor: '#fff', padding: '1.2rem', borderRadius: '16px', border: '1px solid #EFEAE3', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <img 
                src={getAssetPath('images/Croissant.jpg')} 
                alt="Croissant" 
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <span style={{ color: '#D97706', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Pastries</span>
                  <h4 style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontFamily: "'Playfair Display', serif", color: '#2B1E16' }}>Golden Croissant</h4>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: 0, lineHeight: 1.4 }}>Flaky, butter-rich layers baked to golden perfection.</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontWeight: '700', color: '#D97706', fontSize: '1.1rem' }}>$3.20</span>
                  <Link to="/products" className="clickable-btn" style={{ padding: '0.4rem 1rem', backgroundColor: '#2B1E16', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>View Item</Link>
                </div>
              </div>
            </div>

            <div className="card-motion" style={{ display: 'flex', gap: '1.2rem', backgroundColor: '#fff', padding: '1.2rem', borderRadius: '16px', border: '1px solid #EFEAE3', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <img 
                src={getAssetPath('images/Affogato.jpg')} 
                alt="Affogato" 
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <span style={{ color: '#D97706', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Specialty Brew</span>
                  <h4 style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontFamily: "'Playfair Display', serif", color: '#2B1E16' }}>Affogato</h4>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: 0, lineHeight: 1.4 }}>Rich espresso paired with steamed milk and vanilla drizzle.</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontWeight: '700', color: '#D97706', fontSize: '1.1rem' }}>$4.00</span>
                  <Link to="/products" className="clickable-btn" style={{ padding: '0.4rem 1rem', backgroundColor: '#2B1E16', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>View Item</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════ MORNING BUNDLE PROMO ════════════════ */}
      <section style={{ backgroundColor: '#2B1E16', color: '#fff', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center', margin: '4rem 0' }}>
        <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000" alt="Morning Special" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '380px' }} />
        <div style={{ padding: '4rem 3rem' }}>
          <span style={{ color: '#E5A663', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>Limited Time Daily Combo</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', margin: '0.5rem 0 1rem 0', fontWeight: '400' }}>
            Morning <em style={{ color: '#E5A663' }}>Special</em>
          </h2>
          <p style={{ color: '#F3E5D8', lineHeight: '1.7', marginBottom: '2rem', opacity: 0.9, maxWidth: '500px' }}>
            Every morning until 10 AM — pair any freshly baked loaf or pastry with your favorite hot coffee for a special bundle price.
          </p>
          <Link to="/products" className="clickable-btn" style={{ padding: '0.9rem 2rem', backgroundColor: '#D97706', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: '600', display: 'inline-block' }}>
            GET YOUR BUNDLE
          </Link>
        </div>
      </section>

      {/* ════════════════ WHY CHOOSE US ════════════════ */}
      <section style={{ maxWidth: '1200px', margin: '5rem auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ color: '#D97706', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: '700', textTransform: 'uppercase' }}>Our Craft</p>
          <h2 style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", color: '#2B1E16', margin: '0.3rem 0' }}>
            Why <em style={{ color: '#D97706' }}>Choose Us?</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="card-motion" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #EFEAE3', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🥖</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', margin: '0 0 0.8rem 0' }}>Artisan Breads</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>Every loaf is shaped by hand using traditional slow-fermentation techniques for perfect crust and flavor.</p>
          </div>

          <div className="card-motion" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #EFEAE3', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🥐</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', margin: '0 0 0.8rem 0' }}>Sweet Pastries</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>From flaky croissants to rich fruit tarts, our pastry kitchen relies exclusively on real butter and fresh local ingredients.</p>
          </div>

          <div className="card-motion" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #EFEAE3', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>☕</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', margin: '0 0 0.8rem 0' }}>Custom Brews</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>Locally roasted coffee beans pulled by passionate baristas to complement your morning treat perfectly.</p>
          </div>
        </div>
      </section>

    </div>
  );
}