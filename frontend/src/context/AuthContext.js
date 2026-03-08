import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE;

const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return null;

        try {
            const response = await fetch(`${API_BASE}/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access_token);
                return data.access_token;
            } else {
                // Refresh token is invalid/expired — clear everything
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return null;
            }
        } catch {
            return null;
        }
    }, []);

    const fetchUser = useCallback(async () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setIsLoading(false);
            return;
        }

        try {
            let response = await fetch(`${API_BASE}/profile/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // If access token expired, try refreshing
            if (response.status === 401) {
                accessToken = await refreshAccessToken();
                if (!accessToken) {
                    setUser(null);
                    setIsLoading(false);
                    return;
                }
                response = await fetch(`${API_BASE}/profile/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            }

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setUser(null);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [refreshAccessToken]);

    // Validate session on mount
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = (accessToken, refreshToken, userData) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuth };
