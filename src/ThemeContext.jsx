import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const STORAGE_KEY = 'portfolio-theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'avocet-light';
    } catch {
      return 'avocet-light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
