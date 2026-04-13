import React, { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme: () => setIsDarkMode((v) => !v) }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);
