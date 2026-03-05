import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import './App.css';

const RegisterPage = lazy(() => import('./pages/RegisterPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#8b5cf6' }}>Loading...</div>}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
