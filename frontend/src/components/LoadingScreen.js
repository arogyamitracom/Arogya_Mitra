import React from 'react';
import './LoadingScreen.css';

function LoadingScreen() {
    return (
        <div className="loading-screen">
            <img src="/logo-1.png" alt="Arogya Mitra" className="loading-logo" />
            <div className="loading-spinner" />
        </div>
    );
}

export default LoadingScreen;
