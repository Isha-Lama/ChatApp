// palm-chat/frontend/src/ProfileSettings.js
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/users';

function ProfileSettings({ user, setUser }) {
    // ⚠️ NOTE: We use the existing user data from props for initialization
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('userToken');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');

        // Prepare data to send (only include fields that have data)
        const updateData = {};
        if (username !== user.username) {
            updateData.username = username;
        }
        if (password) {
            updateData.password = password;
        }

        if (Object.keys(updateData).length === 0) {
            setMessage({ type: 'error', text: 'No changes detected.' });
            return;
        }

        try {
            // Send the PUT request to the secure, self-authorized endpoint
            const res = await axios.put(`${API_BASE}/${user._id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Update local state and parent state (App.js)
            const updatedUser = res.data;
            setUser({ ...user, username: updatedUser.username }); 
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setPassword(''); // Clear password field after successful update

        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Update failed. Check server logs.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white shadow-2xl rounded-xl">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6 border-b pb-2">User Settings</h2>
            
            {message.text && (
                <div className={`p-3 mb-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Change Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
}

export default ProfileSettings;