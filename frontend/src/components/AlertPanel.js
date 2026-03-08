import React from 'react';
import { BellRing } from 'lucide-react';
import './AlertPanel.css';

function AlertPanel({ alerts }) {
    return (
        <div className="alert-panel">
            <div className="alert-panel-title">
                <span><BellRing size={18} style={{ verticalAlign: 'middle', marginRight: 6, color: '#f87171' }} /></span> Recent Alerts
            </div>
            <div className="alert-list">
                {alerts.map((alert, index) => (
                    <div className="alert-item" key={index}>
                        <div className={`alert-dot alert-dot--${alert.severity}`} />
                        <div className="alert-item-content">
                            <div className="alert-item-text">{alert.message}</div>
                            <div className="alert-item-time">{alert.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AlertPanel;
