import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import CarCard from '../components/CarCard';
import './Home.css';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cars').then((r) => { setCars(r.data.slice(0, 3)); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-content">
              <p className="hero-eyebrow">Premium Automotive Marketplace</p>
              <h1 className="hero-title">
                Find Your<br />
                <span className="hero-accent">Perfect</span><br />
                Machine.
              </h1>
              <p className="hero-sub">
                Discover, list, and manage high-performance vehicles. Browse our curated inventory or create your own listing.
              </p>
              <div className="hero-cta">
                <Link to="/cars" className="btn btn-primary">Browse Inventory</Link>
                <Link to="/signup" className="btn btn-secondary">Start Selling</Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-stat-grid">
                <div className="hero-stat">
                  <span className="stat-num">500+</span>
                  <span className="stat-label">Listed Vehicles</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-num">120+</span>
                  <span className="stat-label">Brands</span>
                </div>
                <div className="hero-stat hero-stat-full">
                  <span className="stat-num">$0</span>
                  <span className="stat-label">Listing Fee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {['Porsche', 'Ferrari', 'BMW', 'Mercedes', 'Lamborghini', 'Aston Martin', 'Bentley', 'McLaren'].map((b, i) => (
            <span key={i} className="marquee-item">{b} <span className="marquee-sep">&#47;</span></span>
          ))}
          {['Porsche', 'Ferrari', 'BMW', 'Mercedes', 'Lamborghini', 'Aston Martin', 'Bentley', 'McLaren'].map((b, i) => (
            <span key={`r-${i}`} className="marquee-item">{b} <span className="marquee-sep">&#47;</span></span>
          ))}
        </div>
      </div>

      {/* Featured */}
      <section className="featured">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Listings</h2>
            <Link to="/cars" className="section-link">View All &#8594;</Link>
          </div>
          {loading ? (
            <div className="page-loading"><span className="spinner"></span>Loading...</div>
          ) : (
            <div className="cars-grid">
              {cars.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-inner">
            <div>
              <h2 className="cta-title">Ready to List Your Car?</h2>
              <p className="cta-sub">Create a free account and add your vehicle in under 2 minutes.</p>
            </div>
            <Link to="/signup" className="btn btn-secondary">Get Started</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
