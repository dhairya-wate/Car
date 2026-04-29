import React from 'react';
import { Link } from 'react-router-dom';
import './CarCard.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800';

export default function CarCard({ car, onEdit, onDelete, owned }) {
  const formatPrice = (p) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="car-card">
      <Link to={`/cars/${car.id}`} className="car-card-img-wrap">
        <img
          src={car.image || PLACEHOLDER}
          alt={car.name}
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        <span className="car-brand-tag">{car.brand}</span>
      </Link>
      <div className="car-card-body">
        <div className="car-card-top">
          <Link to={`/cars/${car.id}`} className="car-name">{car.name}</Link>
          <span className="car-price">{formatPrice(car.price)}</span>
        </div>
        {car.description && (
          <p className="car-desc">{car.description.slice(0, 90)}{car.description.length > 90 ? '...' : ''}</p>
        )}
        <div className="car-card-footer">
          <Link to={`/cars/${car.id}`} className="btn btn-secondary btn-sm">View Details</Link>
          {owned && (
            <div className="car-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => onEdit(car)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(car.id)}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
