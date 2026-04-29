import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await api.post('/auth/login', form);
      login(r.data.token, r.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">MOTOR<span>.</span></Link>
          <h2 className="auth-tagline">The Automotive<br />Marketplace.</h2>
        </div>
      </div>

      <div className="auth-panel auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-sub">Welcome back. Enter your credentials below.</p>

          <form onSubmit={submit} className="auth-form">
            {error && <div className="error-msg">{error}</div>}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handle} placeholder="Your password" required />
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <><span className="spinner"></span>Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            No account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
