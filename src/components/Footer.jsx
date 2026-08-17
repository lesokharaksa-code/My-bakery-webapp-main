import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <footer>
        <div>
          <div className="footer-logo-txt">Crumbs & Cups</div>
          <p>A neighbourhood artisan bakery and café serving handcrafted bakes and specialty drinks since 2020.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/service">Service</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Opening Hours</h4>
          <p>
            Mon–Fri: 7 AM – 8 PM<br />
            Saturday: 8 AM – 9 PM<br />
            Sunday: Closed
          </p>
        </div>
      </footer>
      <div className="footer-bot">
<p>© 2026 Crumbs & Cups. All rights reserved.</p>
        <p>Handcrafted with love 🍞</p>
      </div>
    </>
  );
}