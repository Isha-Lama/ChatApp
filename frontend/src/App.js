// palm-chat/frontend/src/App.js
import React, { useState, useEffect } from 'react';
import Login from './Login';
import Chat from './Chat';
import ProfileSettings from './ProfileSettings'; 
import AdminDashboard from './AdminDashboard'; 

function App() {
    const [user, setUser] = useState(null); 
    const [view, setView] = useState('chat'); 

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData); 
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userToken', userData.token);
        setView('chat');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        setView('chat');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Login onLoginSuccess={handleLoginSuccess} />
            </div>
        );
    }

    // RENDER: Authenticated User View
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            
            {/* 🎨 Header Bar for Navigation and Logout (Fixed Top) */}
            <header className="w-full bg-white shadow-md p-4 flex justify-between items-center fixed top-0 z-10">
                <h1 className="text-2xl font-bold text-indigo-600">Palm Chat App</h1>
                
                <div className="space-x-3 flex items-center">
                    
                    {/* View Switcher: Settings/Chat */}
                    {view === 'chat' ? (
                        <button 
                            onClick={() => setView('settings')}
                            className="py-2 px-4 text-sm bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                            Profile Settings
                        </button>
                    ) : (
                        <button 
                            onClick={() => setView('chat')}
                            className="py-2 px-4 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                        >
                            Back to Chat
                        </button>
                    )}

                    {/* Admin Dashboard Link */}
                    {user.isAdmin && view !== 'admin' && (
                        <button 
                            onClick={() => setView('admin')}
                            className="py-2 px-4 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                        >
                            Admin Dashboard
                        </button>
                    )}
                    
                    {/* Exit Admin Button */}
                    {view === 'admin' && (
                        <button 
                            onClick={() => setView('chat')}
                            className="py-2 px-4 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                        >
                            Exit Admin
                        </button>
                    )}

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="py-2 px-4 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Logout ({user.username})
                    </button>
                </div>
            </header>

            {/* Main Content Area (Padded to clear fixed header) */}
            <main className="flex-grow pt-20 flex items-center justify-center p-4"> 
                {view === 'chat' && <Chat user={user} />}
                {view === 'settings' && <ProfileSettings user={user} setUser={setUser} />}
                {view === 'admin' && user.isAdmin && <AdminDashboard user={user} />} 
            </main>
        </div>
    );
}

export default App;