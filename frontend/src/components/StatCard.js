import React from 'react';
import './StatCard.css';

function StatCard({ icon, iconColor, label, value, sub, badge, badgeColor }) {
    return (
        <div className="stat-card">
            <div className={`stat-card-icon stat-card-icon--${iconColor || 'blue'}`}>
                {icon}
            </div>
            <div className="stat-card-info">
                <div className="stat-card-label">{label}</div>
                <div className="stat-card-value">{value}</div>
                {sub && <div className="stat-card-sub">{sub}</div>}
                {badge && (
                    <span className={`stat-card-badge stat-card-badge--${badgeColor || 'green'}`}>
                        {badge}
                    </span>
                )}
            </div>
        </div>
    );
}

export default StatCard;
