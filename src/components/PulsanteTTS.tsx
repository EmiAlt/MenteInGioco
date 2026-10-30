import { useTextToSpeech, useTTSSettings } from '../hooks/useTextToSpeech';
import { ThemeType } from '../hooks/useTheme';

interface PulsanteTTSProps {
  testo: string;
  theme?: ThemeType;
  className?: string;
}

export default function PulsanteTTS({ testo, theme = 'light', className = '' }: PulsanteTTSProps) {
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();
  const { ttsEnabled } = useTTSSettings();

  if (!isSupported || !ttsEnabled) {
    return null;
  }

  const isDark = theme === 'dark';

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(testo);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        isSpeaking
          ? 'bg-blue-500 text-white animate-pulse'
          : isDark
          ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
      } ${className}`}
      aria-label={isSpeaking ? 'Ferma lettura' : 'Leggi ad alta voce'}
      title={isSpeaking ? 'Ferma lettura' : 'Leggi ad alta voce'}
    >
      <span className="text-2xl">{isSpeaking ? '🔊' : '🔈'}</span>
    </button>
  );
}
