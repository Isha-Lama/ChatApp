// palm-chat/frontend/src/Login.js
import React, { useState } from 'react';

const API_BASE = 'http://localhost:5000/api/users'; // Adjust port if needed

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? `${API_BASE}/register` : `${API_BASE}/login`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login/Registration failed');
      }

      // Save token (in real app, use better storage) and update state
      localStorage.setItem('userToken', data.token);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isRegister ? 'Register' : 'Login'}
      </h2>
      {error && <p className="text-red-500 mb-3 text-sm text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="mt-3 w-full text-sm text-indigo-600 hover:underline"
      >
        {isRegister ? 'Go to Login' : 'Need an account? Register'}
      </button>
    </div>
  );
}

export default Login;