import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import CarModal from '../components/CarModal';
import './CarDetail.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200';

export default function CarDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/cars/${id}`).then((r) => { setCar(r.data); setLoading(false); }).catch(() => { setError('Car not found.'); setLoading(false); });
  }, [id]);

  const handleEdit = async (form) => {
    const r = await api.put(`/cars/${id}`, form);
    setCar(r.data);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing permanently?')) return;
    await api.delete(`/cars/${id}`);
    navigate('/cars');
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);

  if (loading) return <div className="page-loading"><span className="spinner"></span>Loading...</div>;
  if (error || !car) return <div className="page-loading">{error || 'Not found.'}</div>;

  const isOwner = user && user.id === car.user_id;

  return (
    <div className="car-detail">
      <div className="car-detail-img-wrap">
        <img src={car.image || PLACEHOLDER} alt={car.name} onError={(e) => { e.target.src = PLACEHOLDER; }} />
        <div className="car-detail-img-overlay">
          <div className="container">
            <Link to="/cars" className="back-link">&#8592; Back to Inventory</Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="car-detail-body">
          <div className="car-detail-main">
            <div className="car-detail-header">
              <div>
                <span className="car-detail-brand">{car.brand}</span>
                <h1 className="car-detail-name">{car.name}</h1>
              </div>
              <div className="car-detail-price-block">
                <span className="car-detail-price">{formatPrice(car.price)}</span>
                <span className="car-detail-owner">Listed by {car.owner_name}</span>
              </div>
            </div>

            {car.description && (
              <div className="car-detail-desc">
                <h3 className="detail-section-label">Description</h3>
                <p>{car.description}</p>
              </div>
            )}

            <div className="car-detail-meta">
              <div className="meta-item">
                <span className="meta-label">Brand</span>
                <span className="meta-value">{car.brand}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Model</span>
                <span className="meta-value">{car.name}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Price</span>
                <span className="meta-value">{formatPrice(car.price)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Listed By</span>
                <span className="meta-value">{car.owner_name}</span>
              </div>
            </div>

            {isOwner && (
              <div className="car-detail-actions">
                <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Listing</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete Listing</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {editing && <CarModal car={car} onSave={handleEdit} onClose={() => setEditing(false)} />}
    </div>
  );
}
