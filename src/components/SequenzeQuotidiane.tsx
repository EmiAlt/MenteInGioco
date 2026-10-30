import { useState, useEffect } from 'react';
import { ThemeType } from '../hooks/useTheme';

interface SequenzeQuotidianeProps {
  onChiudi: () => void;
  theme?: ThemeType;
}

interface Sequenza {
  id: number;
  titolo: string;
  icona: string;
  passaggi: string[];
}

const SEQUENZE: Sequenza[] = [
  {
    id: 1,
    titolo: 'Preparare il Caffè',
    icona: '☕',
    passaggi: [
      'Prendi la moka',
      'Metti l\'acqua nella base',
      'Inserisci il caffè nel filtro',
      'Avvita la moka',
      'Metti sul fuoco',
      'Aspetta che salga il caffè',
      'Versa nella tazzina'
    ]
  },
  {
    id: 2,
    titolo: 'Lavarsi le Mani',
    icona: '🧼',
    passaggi: [
      'Bagnati le mani',
      'Prendi il sapone',
      'Strofina bene',
      'Sciacqua',
      'Asciuga con l\'asciugamano'
    ]
  },
  {
    id: 3,
    titolo: 'Vestirsi',
    icona: '👔',
    passaggi: [
      'Prendi la maglietta',
      'Infila la testa',
      'Infila le braccia',
      'Prendi i pantaloni',
      'Infila le gambe',
      'Allaccia la cintura',
      'Metti le scarpe'
    ]
  },
  {
    id: 4,
    titolo: 'Preparare la Pasta',
    icona: '🍝',
    passaggi: [
      'Prendi la pentola',
      'Metti l\'acqua',
      'Accendi il fuoco',
      'Aspetta che bolla',
      'Metti il sale',
      'Butta la pasta',
      'Scola quando è cotta',
      'Condisci'
    ]
  },
  {
    id: 5,
    titolo: 'Andare a Letto',
    icona: '🛏️',
    passaggi: [
      'Lavati i denti',
      'Lavati il viso',
      'Mettiti il pigiama',
      'Spegni le luci',
      'Sdraiati nel letto',
      'Chiudi gli occhi'
    ]
  },
  {
    id: 6,
    titolo: 'Fare la Colazione',
    icona: '🥐',
    passaggi: [
      'Prendi il piatto',
      'Metti il pane',
      'Prendi la tazza',
      'Versa il latte',
      'Metti il caffè',
      'Mangia e bevi'
    ]
  }
];

export default function SequenzeQuotidiane({ onChiudi, theme = 'light' }: SequenzeQuotidianeProps) {
  const [sequenzaCorrente, setSequenzaCorrente] = useState<Sequenza | null>(null);
  const [passaggiMescolati, setPassaggiMescolati] = useState<string[]>([]);
  const [passaggiSelezionati, setPassaggiSelezionati] = useState<string[]>([]);
  const [punteggio, setPunteggio] = useState(0);
  const [totaleSequenze, setTotaleSequenze] = useState(0);
  const [completato, setCompletato] = useState(false);
  const [feedback, setFeedback] = useState<'corretto' | 'sbagliato' | null>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    caricaProssimaSequenza();
  }, []);

  const caricaProssimaSequenza = () => {
    const sequenza = SEQUENZE[Math.floor(Math.random() * SEQUENZE.length)];
    setSequenzaCorrente(sequenza);
    
    // Mescola i passaggi
    const mescolati = [...sequenza.passaggi].sort(() => Math.random() - 0.5);
    setPassaggiMescolati(mescolati);
    setPassaggiSelezionati([]);
  };

  const handleSelezionaPassaggio = (passaggio: string) => {
    const nuoviSelezionati = [...passaggiSelezionati, passaggio];
    setPassaggiSelezionati(nuoviSelezionati);
    
    // Rimuovi dai passaggi mescolati
    const nuoviMescolati = passaggiMescolati.filter(p => p !== passaggio);
    setPassaggiMescolati(nuoviMescolati);

    // Controlla se l'ordine è corretto
    const indiceCorretto = nuoviSelezionati.length - 1;
    if (passaggio === sequenzaCorrente?.passaggi[indiceCorretto]) {
      setFeedback('corretto');
      setTimeout(() => setFeedback(null), 1000);
    } else {
      setFeedback('sbagliato');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const handleRimuoviPassaggio = (index: number) => {
    const passaggio = passaggiSelezionati[index];
    const nuoviSelezionati = passaggiSelezionati.filter((_, i) => i !== index);
    setPassaggiSelezionati(nuoviSelezionati);
    setPassaggiMescolati([...passaggiMescolati, passaggio]);
  };

  const controllaSoluzione = () => {
    if (passaggiSelezionati.length !== sequenzaCorrente?.passaggi.length) return;

    const corretta = passaggiSelezionati.every(
      (p, i) => p === sequenzaCorrente.passaggi[i]
    );

    if (corretta) {
      setPunteggio(punteggio + 1);
      setFeedback('corretto');
    } else {
      setFeedback('sbagliato');
    }

    setTimeout(() => {
      setFeedback(null);
      if (totaleSequenze + 1 >= 3) {
        setCompletato(true);
      } else {
        setTotaleSequenze(totaleSequenze + 1);
        caricaProssimaSequenza();
      }
    }, 2000);
  };

  const ricomincia = () => {
    setPunteggio(0);
    setTotaleSequenze(0);
    setCompletato(false);
    setFeedback(null);
    caricaProssimaSequenza();
  };

  if (completato) {
    return (
      <div className={`fixed inset-0 z-50 overflow-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="p-4 max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <div className="text-7xl">🎉</div>
            <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Complimenti!
            </h3>
            <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Hai completato {punteggio} sequenze su 3
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={ricomincia}
                className="flex-1 p-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl shadow-lg transition-colors"
              >
                🔄 Gioca Ancora
              </button>
              <button
                onClick={onChiudi}
                className={`flex-1 p-4 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} text-xl font-bold rounded-xl transition-colors ${isDark ? 'text-white' : 'text-slate-700'}`}
              >
                ← Torna al Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sequenzaCorrente) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className={`text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Caricamento...</div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            📋 Sequenze Quotidiane
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

        {/* Progress */}
        <div className="mb-6">
          <div className="flex gap-1">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all ${
                  idx < totaleSequenze
                    ? 'bg-green-500'
                    : idx === totaleSequenze
                    ? 'bg-blue-500'
                    : isDark
                    ? 'bg-slate-700'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Sequenza {totaleSequenze + 1} di 3 • Punteggio: {punteggio}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sequenza da riordinare */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {sequenzaCorrente.icona} {sequenzaCorrente.titolo}
            </h3>
            <p className={`text-center mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Passaggi mescolati - clicca nell'ordine corretto
            </p>
            
            <div className="space-y-2">
              {passaggiMescolati.map((passaggio, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelezionaPassaggio(passaggio)}
                  className={`w-full p-4 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} rounded-lg text-left transition-all hover:scale-105 ${isDark ? 'text-white' : 'text-slate-900'}`}
                >
                  {passaggio}
                </button>
              ))}
            </div>
          </div>

          {/* Ordine selezionato */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Il tuo ordine
            </h3>
            <p className={`text-center mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {passaggiSelezionati.length} di {sequenzaCorrente.passaggi.length} passaggi
            </p>
            
            <div className="space-y-2 mb-4">
              {passaggiSelezionati.map((passaggio, idx) => (
                <div
                  key={idx}
                  className={`w-full p-4 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border-2 rounded-lg text-left flex items-center justify-between ${isDark ? 'text-white' : 'text-slate-900'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isDark ? 'bg-blue-700' : 'bg-blue-500'} text-white`}>
                      {idx + 1}
                    </span>
                    <span>{passaggio}</span>
                  </div>
                  <button
                    onClick={() => handleRimuoviPassaggio(idx)}
                    className={`text-red-500 hover:text-red-600 font-bold ${isDark ? 'text-red-400' : 'text-red-500'}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {passaggiSelezionati.length === sequenzaCorrente.passaggi.length && (
              <button
                onClick={controllaSoluzione}
                className="w-full p-4 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-xl shadow-lg transition-colors"
              >
                ✓ Controlla Soluzione
              </button>
            )}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mt-6 text-center p-4 rounded-xl ${
            feedback === 'corretto'
              ? 'bg-emerald-100 border-2 border-emerald-300'
              : 'bg-amber-100 border-2 border-amber-300'
          }`}>
            <p className="text-2xl font-bold">
              {feedback === 'corretto' ? '✅ Perfetto!' : '❌ Ordine sbagliato, riprova!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
