import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, ActivitySquare, Target, BookOpen, User, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import './Sidebar.css';

const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ActivitySquare size={20} />, label: 'Health Log', path: '/health-log' },
    { icon: <FileText size={20} />, label: 'Predictions', path: '/predictions' },
    { icon: <Target size={20} />, label: 'Goals', path: '/goals' },
    { icon: <BookOpen size={20} />, label: 'Reports', path: '/reports' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
];

function Sidebar({ collapsed, onToggle }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Desktop / Tablet sidebar */}
            <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
                <div className="sidebar-top">
                    <Link to="/dashboard" className="sidebar-logo">
                        <img src="/logo-1.png" alt="Arogya Mitra" />
                        {!collapsed && <span>Arogya Mitra</span>}
                    </Link>
                    <button
                        className="sidebar-toggle"
                        onClick={onToggle}
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                            title={collapsed ? item.label : ''}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {!collapsed && <span className="sidebar-label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-divider" />
                <div className="sidebar-bottom">
                    <button
                        className="sidebar-link sidebar-link--danger"
                        onClick={handleLogout}
                        title={collapsed ? 'Logout' : ''}
                    >
                        <span className="sidebar-icon"><LogOut size={20} /></span>
                        {!collapsed && <span className="sidebar-label">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile bottom tab bar */}
            <nav className="mobile-tab-bar">
                {navItems.slice(0, 5).map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`tab-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="tab-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </>
    );
}

export default Sidebar;
