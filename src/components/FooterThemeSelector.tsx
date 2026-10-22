import { ThemeType } from '../hooks/useTheme';

interface FooterThemeSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export default function FooterThemeSelector({ currentTheme, onThemeChange }: FooterThemeSelectorProps) {
  const themes = [
    { id: 'light' as ThemeType, label: '☀️ Chiaro', description: 'Sfondo chiaro e rilassante' },
    { id: 'gradient' as ThemeType, label: '🌈 Sfumato', description: 'Sfumatura delicata' },
    { id: 'dark' as ThemeType, label: '🌙 Scuro', description: 'Alto contrasto' },
  ];

  const isDark = currentTheme === 'dark';

  return (
    <footer className={`w-full py-6 px-4 mt-8 border-t transition-colors duration-300 ${
      isDark ? 'border-slate-700' : 'border-slate-200/50'
    }`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <p className={`text-sm font-medium transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-slate-500'
          }`}>
            Scegli il tuo tema preferito
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => onThemeChange(themeOption.id)}
              className={`
                px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                ${currentTheme === themeOption.id
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : isDark
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:shadow-md border border-slate-700'
                    : 'bg-white/80 text-slate-700 hover:bg-white hover:shadow-md border border-slate-200'
                }
              `}
              title={themeOption.description}
            >
              {themeOption.label}
            </button>
          ))}
        </div>

        <div className="text-center mt-4">
          <p className={`text-xs transition-colors duration-300 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            La tua preferenza verrà salvata automaticamente
          </p>
        </div>
      </div>
    </footer>
  );
}
