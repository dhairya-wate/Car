import React, { useState, useEffect } from 'react';
import './CarModal.css';

export default function CarModal({ car, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', brand: '', price: '', image: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (car) setForm({ name: car.name, brand: car.brand, price: car.price, image: car.image || '', description: car.description || '' });
  }, [car]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.brand || !form.price) { setError('Name, brand, and price are required.'); return; }
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{car ? 'Edit Car' : 'Add New Car'}</h2>
          <button className="modal-close" onClick={onClose}>&#215;</button>
        </div>
        <form onSubmit={submit} className="modal-body">
          {error && <div className="error-msg">{error}</div>}
          <div className="form-row">
            <div className="form-group">
              <label>Car Name</label>
              <input name="name" value={form.name} onChange={handle} placeholder="e.g. 911 Carrera" />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input name="brand" value={form.brand} onChange={handle} placeholder="e.g. Porsche" />
            </div>
          </div>
          <div className="form-group">
            <label>Price (USD)</label>
            <input name="price" type="number" value={form.price} onChange={handle} placeholder="e.g. 112000" min="0" />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input name="image" value={form.image} onChange={handle} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handle} placeholder="Brief description..." rows={3} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner"></span>Saving...</> : car ? 'Update Car' : 'Add Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
