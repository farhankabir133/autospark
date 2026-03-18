import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // If running in a browser, check hostname and localStorage
    if (typeof window !== 'undefined') {
      const host = window.location.hostname || '';
      // Force dark mode when served on the custom domain (autosparkbd.com)
      if (host.endsWith('autosparkbd.com')) {
        try { localStorage.setItem('theme', 'dark'); } catch {}
        return 'dark';
      }

      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') {
        return stored as Theme;
      }
    }

    // Default to dark mode for all other first-time visitors
    return 'dark';
  });

  useEffect(() => {
    try { localStorage.setItem('theme', theme); } catch {}
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Ensure that if the site is visited on the custom domain in the future,
  // the theme will be set to dark overriding any previous setting.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname || '';
    if (host.endsWith('autosparkbd.com') && theme !== 'dark') {
      setTheme('dark');
      try { localStorage.setItem('theme', 'dark'); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
