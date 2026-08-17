import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div id="about">
      <div className="about-split">
        <div className="about-img-side">
          <img 
             src={`${window.location.origin}/My-bakery-webapp-main/images/CheeseCakeBerries.jpg`} 
             alt="Cheesecake with berries" 
          />
        </div>
        <div className="about-text-side">
          <div className="eyebrow">Our Story</div>
          <div className="sec-title">A Bakery Born<br /><em>from Passion</em></div>
          <p>Crumbs & Cups started in a small home kitchen in 2020. What began as weekend baking for friends and family grew into something we never imagined — a beloved neighbourhood café.</p>
          <p>Today we still follow the same philosophy: use the best ingredients, bake everything from scratch, and treat every customer like a guest in our home.</p>
          <Link to="/contact" className="btn-accent" style={{ marginTop: '1rem', width: 'fit-content', display: 'inline-block', textDecoration: 'none' }}>Get in Touch</Link>
        </div>
      </div>
      <section style={{ background: 'var(--cream-light)', padding: 0 }}>
        <div className="values-grid">
          <div className="val-item"><div className="val-num">01</div><div className="val-title">Local Ingredients</div><div className="val-desc">We source flour, butter, and produce from trusted local farmers and suppliers only.</div></div>
          <div className="val-item"><div className="val-num">02</div><div className="val-title">Handcrafted Always</div><div className="val-desc">Everything is shaped, folded, and baked by hand. No shortcuts, ever.</div></div>
          <div className="val-item"><div className="val-num">03</div><div className="val-title">Sustainable Practices</div><div className="val-desc">We minimise waste, use compostable packaging, and support eco-friendly suppliers.</div></div>
        </div>
      </section>
      <div className="stats-dark">
        <div className="stat-item"><div className="stat-num">5<span>+</span></div><div className="stat-lbl">Years of Baking</div></div>
        <div className="stat-item"><div className="stat-num">30<span>+</span></div><div className="stat-lbl">Menu Items</div></div>
        <div className="stat-item"><div className="stat-num">1k<span>+</span></div><div className="stat-lbl">Happy Customers</div></div>
      </div>
    </div>
  );
}