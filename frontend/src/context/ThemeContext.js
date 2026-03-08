import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Check local storage or default to 'dark'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app-theme') || 'dark';
    });

    useEffect(() => {
        // Apply theme to document element
        document.documentElement.setAttribute('data-theme', theme);
        // Persist to local storage
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
