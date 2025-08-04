import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { user } = useUser();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (user?.settings?.darkMode !== undefined) {
      const preferred = user.settings.darkMode ? 'dark' : 'light';
      setTheme(preferred);
      localStorage.setItem('theme', preferred);
    }
  }, [user?.settings?.darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
