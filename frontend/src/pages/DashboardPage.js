import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user || null;

    const handleLogout = () => {
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
