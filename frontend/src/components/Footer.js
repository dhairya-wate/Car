import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">MOTOR<span>.</span></Link>
          <p className="footer-tagline">Premium automotive marketplace.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/cars">Inventory</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/signup">Get Started</Link>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} Motor. All rights reserved.</p>
      </div>
    </footer>
  );
}
