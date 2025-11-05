// palm-chat/frontend/src/AdminDashboard.js
import React, { useState, useEffect, useCallback } from 'react'; // ⬅️ useCallback IMPORTED
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/users'; 

function AdminDashboard({ user }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('userToken');

    // --- Fetch All Users (Wrapped in useCallback) ---
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(API_BASE, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Authorization failed or server error.';
            setError(errorMsg);
            setLoading(false);
        }
    }, [token]); // ⬅️ DEPENDENCY: token

    // --- Run fetchUsers on mount ---
    useEffect(() => {
        // Runs only when fetchUsers or user.isAdmin changes
        if (user.isAdmin) {
            fetchUsers();
        } else {
            setError('Access Denied. You are not an administrator.');
            setLoading(false);
        }
    }, [fetchUsers, user.isAdmin]); // ⬅️ DEPENDENCY ARRAY FIXED

    // --- Delete User ---
    const handleDelete = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to PERMANENTLY delete user: ${username}?`)) {
            return;
        }

        try {
            await axios.delete(`${API_BASE}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert('Failed to delete user. Reason: ' + (err.response?.data?.message || 'Server error.'));
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <div className="w-full max-w-2xl text-center p-10 text-lg text-indigo-600">Loading Users...</div>;
    }

    if (error) {
        return <div className="w-full max-w-2xl text-center p-10 text-lg text-red-600">Error: {error}</div>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-2xl rounded-xl">
            <h2 className="text-2xl font-bold text-red-600 mb-6 border-b pb-2">Admin Dashboard 👑</h2>
            <p className="mb-4 text-gray-600">You have administrative access, **{user.username}**.</p>
            
            <h3 className="text-xl font-semibold mb-3">User List ({users.length} Total)</h3>
            
            <ul className="space-y-3">
                {users.map((u) => (
                    <li key={u._id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                        <span className="font-medium">{u.username}</span>
                        <div className="text-sm text-gray-500">
                             {u.isAdmin ? 'Admin' : 'Standard User'}
                        </div>
                        
                        {u._id !== user._id ? (
                            <button
                                onClick={() => handleDelete(u._id, u.username)}
                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        ) : (
                            <span className="px-3 py-1 text-sm text-gray-500 font-bold">You (Cannot Delete Self)</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDashboard;