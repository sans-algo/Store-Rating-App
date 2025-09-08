import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'USER' // default role
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Client-side validation per requirements
    if (formData.name.length < 20 || formData.name.length > 60) {
      setMessage('Name must be between 20 and 60 characters long');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage('Please enter a valid email address');
      return;
    }
    if (formData.address.length > 400) {
      setMessage('Address must not exceed 400 characters');
      return;
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      setMessage('Password must be between 8 and 16 characters long');
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
      setMessage('Password must include at least one uppercase letter and one special character');
      return;
    }

    try {
      const res = await API.post('/auth/signup', formData);
      setMessage(res.data.message || 'Signup successful');

      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h2 className="mb-3">Signup</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name (20-60 characters)</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            minLength={20}
            maxLength={60}
            required
          />
          <small className="text-muted">{formData.name.length}/60 characters</small>
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address (max 400 characters)</label>
          <textarea
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            maxLength={400}
            rows={3}
            required
          />
          <small className="text-muted">{formData.address.length}/400 characters</small>
        </div>
        <div className="mb-3">
          <label className="form-label">Password (8-16 characters, include uppercase & special character)</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            maxLength={16}
            required
          />
          <small className="text-muted">Must include: uppercase letter, special character (!@#$%^&*)</small>
        </div>
        {/* Role Selector */}
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="USER">Normal User</option>
            <option value="OWNER">Store Owner</option>
            <option value="ADMIN">System Administrator</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
