import { useState, useEffect } from 'react';

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Controlla se il browser supporta la sintesi vocale
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = (text: string) => {
    if (!isSupported) return;

    // Ferma qualsiasi sintesi in corso
    window.speechSynthesis.cancel();

    // Crea un nuovo utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configura la voce italiana
    utterance.lang = 'it-IT';
    utterance.rate = 0.9; // Velocità leggermente più lenta per chiarezza
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Cerca una voce italiana
    const voices = window.speechSynthesis.getVoices();
    const italianVoice = voices.find(voice => voice.lang.startsWith('it'));
    if (italianVoice) {
      utterance.voice = italianVoice;
    }

    // Gestisci eventi
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Avvia la sintesi
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    speak,
    stop,
    isSpeaking,
    isSupported
  };
}

// Hook per controllare le impostazioni TTS globali
export function useTTSSettings() {
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    const saved = localStorage.getItem('tts_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('tts_enabled', JSON.stringify(ttsEnabled));
  }, [ttsEnabled]);

  return {
    ttsEnabled,
    setTtsEnabled
  };
}
