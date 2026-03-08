import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import './App.css';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
