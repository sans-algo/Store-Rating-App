import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Login = ({ setActiveTab }) => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');
      await login(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border rounded"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
      <p className="text-center mt-4">
        Don't have an account?{' '}
        <button
          onClick={() => setActiveTab('register')}
          className="text-blue-600 hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
