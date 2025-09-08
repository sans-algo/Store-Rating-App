import React, { useState } from 'react';
import API from '../api';

const UpdatePassword = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    // Validation per requirements
    if (passwordData.newPassword.length < 8 || passwordData.newPassword.length > 16) {
      setMessage('Password must be between 8 and 16 characters long');
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(passwordData.newPassword)) {
      setMessage('Password must include at least one uppercase letter and one special character');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    try {
      const res = await API.post('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage(res.data.message || 'Password updated successfully');
      setIsSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h2 className="mb-3">Update Password</h2>
      
      {message && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">New Password (8-16 characters, include uppercase & special character)</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            minLength={8}
            maxLength={16}
            required
          />
          <small className="text-muted">Must include: uppercase letter, special character (!@#$%^&*)</small>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary w-100">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;