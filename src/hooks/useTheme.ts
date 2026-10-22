import { useState, useEffect } from 'react';

export type ThemeType = 'light' | 'gradient' | 'dark';

interface ThemeConfig {
  background: string;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
}

const themes: Record<ThemeType, ThemeConfig> = {
  light: {
    background: 'bg-slate-100',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    cardBg: 'bg-white',
  },
  gradient: {
    background: 'bg-gradient-to-b from-indigo-50 to-slate-50',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    cardBg: 'bg-white/80 backdrop-blur-sm',
  },
  dark: {
    background: 'bg-slate-900',
    textPrimary: 'text-slate-50',
    textSecondary: 'text-slate-300',
    cardBg: 'bg-slate-800',
  },
};

export function useTheme() {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as ThemeType) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    themeConfig: themes[theme],
  };
}
