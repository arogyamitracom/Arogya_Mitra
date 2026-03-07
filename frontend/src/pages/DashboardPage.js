import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

function DashboardPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-card">
                <span className="welcome-icon">👋</span>
                <h1>Welcome{user ? `, ${user.first_name}` : ''}</h1>
                <p className="greeting">
                    Your dashboard is being built. Stay tuned!
                </p>
                <button className="dashboard-logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default DashboardPage;
