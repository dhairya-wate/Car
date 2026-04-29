import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import CarCard from '../components/CarCard';
import CarModal from '../components/CarModal';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [error, setError] = useState('');

  const fetchCars = () => {
    api.get('/cars').then((r) => {
      setCars(r.data.filter((c) => c.user_id === user.id));
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCars(); }, []);

  const handleAdd = async (form) => {
    await api.post('/cars', form);
    fetchCars();
  };

  const handleEdit = async (form) => {
    await api.put(`/cars/${editCar.id}`, form);
    setEditCar(null);
    fetchCars();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await api.delete(`/cars/${id}`);
      fetchCars();
    } catch {
      setError('Failed to delete car.');
    }
  };

  const openAdd = () => { setEditCar(null); setModalOpen(true); };
  const openEdit = (car) => { setEditCar(car); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditCar(null); };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div className="dash-header-inner">
            <div>
              <p className="dash-greeting">Welcome back,</p>
              <h1 className="dash-name">{user.name}</h1>
              <p className="dash-email">{user.email}</p>
            </div>
            <button className="btn btn-secondary dash-add-btn" onClick={openAdd}>
              + Add New Listing
            </button>
          </div>

          <div className="dash-stats">
            <div className="dash-stat">
              <span className="dash-stat-num">{cars.length}</span>
              <span className="dash-stat-label">Active Listings</span>
            </div>
            <div className="dash-stat">
              <span className="dash-stat-num">
                {cars.length > 0
                  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                      Math.max(...cars.map((c) => c.price))
                    )
                  : '$0'}
              </span>
              <span className="dash-stat-label">Highest Listed Price</span>
            </div>
            <div className="dash-stat">
              <span className="dash-stat-num">
                {cars.length > 0
                  ? [...new Set(cars.map((c) => c.brand))].length
                  : 0}
              </span>
              <span className="dash-stat-label">Brands Listed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container dash-body">
        <div className="dash-section-header">
          <h2 className="dash-section-title">Your Listings</h2>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Car</button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {loading ? (
          <div className="page-loading"><span className="spinner"></span>Loading your listings...</div>
        ) : cars.length === 0 ? (
          <div className="dash-empty">
            <p className="dash-empty-title">No listings yet</p>
            <p className="dash-empty-sub">Start by adding your first vehicle to the marketplace.</p>
            <button className="btn btn-primary" onClick={openAdd}>Add Your First Car</button>
          </div>
        ) : (
          <div className="cars-grid-dash">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} owned onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <CarModal
          car={editCar}
          onSave={editCar ? handleEdit : handleAdd}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
