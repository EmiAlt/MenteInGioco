import { useState } from 'react';
import { ThemeType } from '../hooks/useTheme';

interface OrientamentoSpazioTemporaleProps {
  onChiudi: () => void;
  theme?: ThemeType;
}

const GIORNI_SETTIMANA = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
const MESI = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const STAGIONI = [
  { nome: 'Primavera', icona: '🌸', colore: 'from-green-400 to-emerald-500' },
  { nome: 'Estate', icona: '☀️', colore: 'from-yellow-400 to-orange-500' },
  { nome: 'Autunno', icona: '🍂', colore: 'from-orange-400 to-red-500' },
  { nome: 'Inverno', icona: '❄️', colore: 'from-blue-400 to-indigo-500' }
];
const TEMPO_ATMOSFERICO = [
  { nome: 'Sole', icona: '☀️' },
  { nome: 'Nuvoloso', icona: '☁️' },
  { nome: 'Pioggia', icona: '🌧️' },
  { nome: 'Neve', icona: '🌨️' },
  { nome: 'Vento', icona: '💨' }
];
const MOMENTI_GIORNATA = [
  { nome: 'Mattina', icona: '🌅', colore: 'from-yellow-300 to-orange-400' },
  { nome: 'Pomeriggio', icona: '☀️', colore: 'from-orange-400 to-red-400' },
  { nome: 'Sera', icona: '🌆', colore: 'from-purple-400 to-pink-500' },
  { nome: 'Notte', icona: '🌙', colore: 'from-indigo-600 to-purple-700' }
];

export default function OrientamentoSpazioTemporale({ onChiudi, theme = 'light' }: OrientamentoSpazioTemporaleProps) {
  const [step, setStep] = useState(0);
  const [risposte, setRisposte] = useState({
    giorno: '',
    data: '',
    mese: '',
    anno: '',
    stagione: '',
    tempo: '',
    momento: ''
  });
  const [feedback, setFeedback] = useState<'corretto' | 'sbagliato' | null>(null);

  const isDark = theme === 'dark';

  const domande = [
    {
      titolo: 'Che giorno della settimana è oggi?',
      tipo: 'giorno',
      opzioni: GIORNI_SETTIMANA
    },
    {
      titolo: 'Che giorno del mese è oggi?',
      tipo: 'data',
      opzioni: Array.from({ length: 31 }, (_, i) => String(i + 1))
    },
    {
      titolo: 'In che mese siamo?',
      tipo: 'mese',
      opzioni: MESI
    },
    {
      titolo: 'In che anno siamo?',
      tipo: 'anno',
      opzioni: ['2023', '2024', '2025', '2026']
    },
    {
      titolo: 'Che stagione è?',
      tipo: 'stagione',
      opzioni: STAGIONI.map(s => s.nome),
      renderCustom: (opzione: string) => {
        const stagione = STAGIONI.find(s => s.nome === opzione);
        return (
          <button
            key={opzione}
            onClick={() => handleRisposta('stagione', opzione)}
            className={`p-4 bg-gradient-to-br ${stagione?.colore} text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[100px]`}
          >
            <div className="text-5xl mb-2">{stagione?.icona}</div>
            <div className="text-lg font-bold">{opzione}</div>
          </button>
        );
      }
    },
    {
      titolo: 'Com\'è il tempo oggi?',
      tipo: 'tempo',
      opzioni: TEMPO_ATMOSFERICO.map(t => t.nome),
      renderCustom: (opzione: string) => {
        const tempo = TEMPO_ATMOSFERICO.find(t => t.nome === opzione);
        return (
          <button
            key={opzione}
            onClick={() => handleRisposta('tempo', opzione)}
            className={`p-4 ${isDark ? 'bg-slate-700' : 'bg-white'} border-2 ${isDark ? 'border-slate-600' : 'border-slate-200'} rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[100px]`}
          >
            <div className="text-5xl mb-2">{tempo?.icona}</div>
            <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{opzione}</div>
          </button>
        );
      }
    },
    {
      titolo: 'Che momento della giornata è?',
      tipo: 'momento',
      opzioni: MOMENTI_GIORNATA.map(m => m.nome),
      renderCustom: (opzione: string) => {
        const momento = MOMENTI_GIORNATA.find(m => m.nome === opzione);
        return (
          <button
            key={opzione}
            onClick={() => handleRisposta('momento', opzione)}
            className={`p-4 bg-gradient-to-br ${momento?.colore} text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[100px]`}
          >
            <div className="text-5xl mb-2">{momento?.icona}</div>
            <div className="text-lg font-bold">{opzione}</div>
          </button>
        );
      }
    }
  ];

  const handleRisposta = (tipo: string, valore: string) => {
    setRisposte(prev => ({ ...prev, [tipo]: valore }));
    setFeedback('corretto');
    
    setTimeout(() => {
      setFeedback(null);
      if (step < domande.length - 1) {
        setStep(step + 1);
      } else {
        setStep(step + 1); // Vai alla schermata finale
      }
    }, 1500);
  };

  const ricomincia = () => {
    setStep(0);
    setRisposte({
      giorno: '',
      data: '',
      mese: '',
      anno: '',
      stagione: '',
      tempo: '',
      momento: ''
    });
    setFeedback(null);
  };

  const domandaCorrente = domande[step];

  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            📅 Orientamento Spazio-Temporale
          </h2>
          <button
            onClick={onChiudi}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            ← Chiudi
          </button>
        </div>

        {/* Progress indicator */}
        {step < domande.length && (
          <div className="mb-6">
            <div className="flex gap-1">
              {domande.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    idx < step
                      ? 'bg-green-500'
                      : idx === step
                      ? 'bg-blue-500'
                      : isDark
                      ? 'bg-slate-700'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Domanda {step + 1} di {domande.length}
            </p>
          </div>
        )}

        {/* Schermata finale */}
        {step === domande.length && (
          <div className="text-center space-y-6">
            <div className="text-7xl">🎉</div>
            <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Ottimo lavoro!
            </h3>
            <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Hai completato tutte le domande di orientamento
            </p>
            
            <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
              <h4 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Le tue risposte:
              </h4>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Giorno:</span>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{risposte.giorno}</p>
                </div>
                <div>
                  <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Data:</span>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{risposte.data}</p>
                </div>
                <div>
                  <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Mese:</span>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{risposte.mese}</p>
                </div>
                <div>
                  <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Anno:</span>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{risposte.anno}</p>
                </div>
                <div>
                  <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Stagione:</span>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{risposte.stagione}</p>
                </div>
                <div>
                  <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Tempo:</span>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{risposte.tempo}</p>
                </div>
                <div>
                  <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Momento:</span>
                  <p className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{risposte.momento}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={ricomincia}
                className="flex-1 p-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl shadow-lg transition-colors"
              >
                🔄 Ricomincia
              </button>
              <button
                onClick={onChiudi}
                className={`flex-1 p-4 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} text-xl font-bold rounded-xl transition-colors ${isDark ? 'text-white' : 'text-slate-700'}`}
              >
                ← Torna al Menu
              </button>
            </div>
          </div>
        )}

        {/* Domanda corrente */}
        {step < domande.length && (
          <div className="space-y-6">
            <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-2xl md:text-3xl font-bold text-center mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {domandaCorrente.titolo}
              </h3>

              {/* Opzioni */}
              {domandaCorrente.renderCustom ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {domandaCorrente.opzioni.map(opzione => domandaCorrente.renderCustom!(opzione))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {domandaCorrente.opzioni.map(opzione => (
                    <button
                      key={opzione}
                      onClick={() => handleRisposta(domandaCorrente.tipo, opzione)}
                      className={`p-4 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} rounded-xl shadow-lg hover:scale-105 transition-all text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
                    >
                      {opzione}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`text-center p-4 rounded-xl ${
                feedback === 'corretto'
                  ? 'bg-emerald-100 border-2 border-emerald-300'
                  : 'bg-amber-100 border-2 border-amber-300'
              }`}>
                <p className="text-2xl font-bold">
                  {feedback === 'corretto' ? '✅ Perfetto!' : '❌ Riprova!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
