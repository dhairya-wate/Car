import React, { useEffect, useState } from 'react';
import api from '../api';
import CarCard from '../components/CarCard';
import './Cars.css';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');

  useEffect(() => {
    api.get('/cars').then((r) => { setCars(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const brands = [...new Set(cars.map((c) => c.brand))].sort();

  const filtered = cars.filter((c) => {
    const q = search.toLowerCase();
    return (
      (!search || c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q)) &&
      (!brand || c.brand === brand)
    );
  });

  return (
    <div className="cars-page">
      <div className="cars-hero">
        <div className="container">
          <p className="cars-eyebrow">Full Inventory</p>
          <h1 className="cars-title">Every Car.<br />Every Brand.</h1>
        </div>
      </div>
      <div className="container">
        <div className="cars-filters">
          <input
            className="filter-input"
            type="text"
            placeholder="Search by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="filter-select" value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">All Brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          {(search || brand) && (
            <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setBrand(''); }}>
              Clear Filters
            </button>
          )}
          <span className="cars-count">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="page-loading"><span className="spinner"></span>Loading inventory...</div>
        ) : filtered.length === 0 ? (
          <div className="cars-empty">
            <p>No vehicles found matching your search.</p>
          </div>
        ) : (
          <div className="cars-grid-full">
            {filtered.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </div>
    </div>
  );
}
