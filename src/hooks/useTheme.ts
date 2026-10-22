import { useState, useEffect } from 'react';

export type ThemeType = 'light' | 'gradient' | 'dark';

interface ThemeConfig {
  background: string;
  backgroundStyle?: React.CSSProperties;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
}

const themes: Record<ThemeType, ThemeConfig> = {
  light: {
    background: '',
    backgroundStyle: { backgroundColor: '#f1f5f9' },
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    cardBg: 'bg-white',
  },
  gradient: {
    background: '',
    backgroundStyle: {
      background: 'linear-gradient(135deg, #e0e7ff 0%, #fae8ff 50%, #f0fdf4 100%)',
    },
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    cardBg: 'bg-white/80 backdrop-blur-sm',
  },
  dark: {
    background: '',
    backgroundStyle: { backgroundColor: '#0f172a' },
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
