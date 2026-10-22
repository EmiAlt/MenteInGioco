import { ThemeType } from '../hooks/useTheme';

interface FooterThemeSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export default function FooterThemeSelector({ currentTheme, onThemeChange }: FooterThemeSelectorProps) {
  const themes = [
    { 
      id: 'light' as ThemeType, 
      label: '☀️ Chiaro', 
      description: 'Sfondo chiaro e rilassante',
      preview: { backgroundColor: '#f1f5f9' }
    },
    { 
      id: 'gradient' as ThemeType, 
      label: '🌈 Sfumato', 
      description: 'Sfumatura tricolore pastello',
      preview: { background: 'linear-gradient(135deg, #e0e7ff 0%, #fae8ff 50%, #f0fdf4 100%)' }
    },
    { 
      id: 'dark' as ThemeType, 
      label: '🌙 Scuro', 
      description: 'Alto contrasto blu notte',
      preview: { backgroundColor: '#0f172a' }
    },
  ];

  const isDark = currentTheme === 'dark';

  return (
    <footer className={`w-full py-6 px-4 mt-8 border-t transition-all duration-300 ${
      isDark ? 'border-slate-700' : 'border-slate-200/50'
    }`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <p className={`text-sm font-medium transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Scegli il tuo tema preferito
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => onThemeChange(themeOption.id)}
              className={`
                relative px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-200 overflow-hidden
                ${currentTheme === themeOption.id
                  ? 'ring-4 ring-blue-500 shadow-xl scale-105'
                  : 'hover:scale-105 hover:shadow-lg'
                }
              `}
              title={themeOption.description}
              style={themeOption.preview}
            >
              <span className={`relative z-10 ${
                themeOption.id === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {themeOption.label}
              </span>
              {currentTheme === themeOption.id && (
                <div className="absolute inset-0 bg-blue-500/20 z-0" />
              )}
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
