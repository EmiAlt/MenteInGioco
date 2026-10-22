import { useState, useEffect } from "react";

interface ValigiaSpesaProps {
  onChiudi: () => void;
}

interface RoundValigia {
  titolo: string;
  emoji: string;
  contesto: string;
  oggetti: { nome: string; emoji: string; èCorretto: boolean }[];
}

// Funzione per mescolare array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const ROUNDS_DEFAULT: RoundValigia[] = [
  {
    titolo: "Andiamo al mare",
    emoji: "🏖️",
    contesto: "Dobbiamo andare al mare, cosa mettiamo in valigia?",
    oggetti: [
      { nome: "Costume", emoji: "🩱", èCorretto: true },
      { nome: "Ombrellone", emoji: "⛱️", èCorretto: true },
      { nome: "Sciarpa", emoji: "🧣", èCorretto: false },
      { nome: "Crema solare", emoji: "🧴", èCorretto: true },
      { nome: "Guanti", emoji: "🧤", èCorretto: false },
      { nome: "Asciugamano", emoji: "🏖️", èCorretto: true },
    ],
  },
  {
    titolo: "Facciamo una torta",
    emoji: "🎂",
    contesto: "Dobbiamo fare una torta, cosa compriamo?",
    oggetti: [
      { nome: "Farina", emoji: "🌾", èCorretto: true },
      { nome: "Zucchero", emoji: "🍬", èCorretto: true },
      { nome: "Martello", emoji: "🔨", èCorretto: false },
      { nome: "Uova", emoji: "🥚", èCorretto: true },
      { nome: "Detersivo", emoji: "🧼", èCorretto: false },
      { nome: "Burro", emoji: "🧈", èCorretto: true },
    ],
  },
  {
    titolo: "Andiamo a sciare",
    emoji: "⛷️",
    contesto: "Dobbiamo andare a sciare, cosa mettiamo in valigia?",
    oggetti: [
      { nome: "Cappotto", emoji: "🧥", èCorretto: true },
      { nome: "Guanti", emoji: "🧤", èCorretto: true },
      { nome: "Costume", emoji: "🩱", èCorretto: false },
      { nome: "Sciarpa", emoji: "🧣", èCorretto: true },
      { nome: "Occhiali da sole", emoji: "🕶️", èCorretto: false },
      { nome: "Cappello", emoji: "🎿", èCorretto: true },
    ],
  },
  {
    titolo: "Prepariamo l'insalata",
    emoji: "🥗",
    contesto: "Dobbiamo preparare un'insalata, cosa compriamo?",
    oggetti: [
      { nome: "Lattuga", emoji: "🥬", èCorretto: true },
      { nome: "Pomodori", emoji: "🍅", èCorretto: true },
      { nome: "Cioccolato", emoji: "🍫", èCorretto: false },
      { nome: "Cetrioli", emoji: "🥒", èCorretto: true },
      { nome: "Detersivo", emoji: "🧼", èCorretto: false },
      { nome: "Carote", emoji: "🥕", èCorretto: true },
    ],
  },
];

export default function ValigiaSpesa({ onChiudi }: ValigiaSpesaProps) {
  const [rounds, setRounds] = useState<RoundValigia[]>([]);
  const [roundCorrente, setRoundCorrente] = useState(0);
  const [oggettiSelezionati, setOggettiSelezionati] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<"corretto" | "sbagliato" | null>(null);
  const [punteggio, setPunteggio] = useState(0);
  const [completato, setCompletato] = useState(false);

  // Carica rounds personalizzati o default e mescola
  useEffect(() => {
    const customRounds = localStorage.getItem("valigia_custom_rounds");
    let roundsToUse = ROUNDS_DEFAULT;
    
    if (customRounds) {
      try {
        const parsed = JSON.parse(customRounds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          roundsToUse = parsed;
        }
      } catch (e) {
        console.error("Errore nel caricare rounds personalizzati:", e);
      }
    }
    
    // Mescola i rounds e gli oggetti di ogni round
    const shuffledRounds = shuffleArray(roundsToUse).map(round => ({
      ...round,
      oggetti: shuffleArray(round.oggetti)
    }));
    
    setRounds(shuffledRounds);
  }, []);

  if (rounds.length === 0) return null;
  
  const round = rounds[roundCorrente];

  const gestisciClick = (idx: number) => {
    if (feedback) return;

    const nuoviSelezionati = new Set(oggettiSelezionati);
    if (nuoviSelezionati.has(idx)) {
      nuoviSelezionati.delete(idx);
    } else {
      nuoviSelezionati.add(idx);
    }
    setOggettiSelezionati(nuoviSelezionati);
  };

  const conferma = () => {
    // Controlla se tutti gli oggetti corretti sono stati selezionati
    const oggettiCorretti = round.oggetti.filter(o => o.èCorretto);
    const tuttiCorrettiSelezionati = oggettiCorretti.every((_, idx) => {
      const idxOriginale = round.oggetti.indexOf(oggettiCorretti[idx]);
      return oggettiSelezionati.has(idxOriginale);
    });

    // Controlla se non ci sono oggetti sbagliati selezionati
    const nessunSbagliato = !Array.from(oggettiSelezionati).some(idx => !round.oggetti[idx].èCorretto);

    if (tuttiCorrettiSelezionati && nessunSbagliato) {
      setFeedback("corretto");
      setPunteggio(punteggio + 1);
    } else {
      setFeedback("sbagliato");
    }

    setTimeout(() => {
      if (roundCorrente < rounds.length - 1) {
        setRoundCorrente(roundCorrente + 1);
        setOggettiSelezionati(new Set());
        setFeedback(null);
      } else {
        setCompletato(true);
      }
    }, 2500);
  };

  if (completato) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 text-center space-y-4 md:space-y-6 my-auto">
          <div className="text-6xl md:text-7xl">🎉</div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Bravissimo!</h2>
          <p className="text-lg md:text-xl text-slate-600">
            Hai preparato {punteggio} liste su {rounds.length}
          </p>
          <p className="text-lg text-slate-500">Ottima memoria per le cose quotidiane!</p>
          <button
            onClick={onChiudi}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl"
          >
            Torna al Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">🧳 La Valigia / La Spesa</h2>
          <button
            onClick={onChiudi}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg"
          >
            ← Chiudi
          </button>
        </div>
      </div>

      {/* Contenuto */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-6">
        <div className="max-w-3xl w-full space-y-6">
          {/* Contesto */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-4 border-blue-300 p-6 text-center">
            <div className="text-5xl mb-3">{round.emoji}</div>
            <p className="text-2xl font-bold text-slate-900 mb-2">{round.titolo}</p>
            <p className="text-xl text-slate-700">{round.contesto}</p>
          </div>

          {/* Istruzioni */}
          <div className="text-center">
            <p className="text-lg text-slate-600">
              Seleziona gli oggetti giusti ({round.oggetti.filter(o => o.èCorretto).length} oggetti)
            </p>
          </div>

          {/* Griglia oggetti */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {round.oggetti.map((oggetto, idx) => (
              <button
                key={idx}
                onClick={() => gestisciClick(idx)}
                disabled={feedback !== null}
                className={`p-4 rounded-xl border-4 transition-all ${
                  oggettiSelezionati.has(idx)
                    ? feedback
                      ? oggetto.èCorretto
                        ? "bg-emerald-100 border-emerald-500"
                        : "bg-red-100 border-red-500"
                      : "bg-blue-100 border-blue-500 scale-95"
                    : feedback
                    ? oggetto.èCorretto
                      ? "bg-emerald-50 border-emerald-300 opacity-60"
                      : "bg-slate-100 border-slate-300 opacity-50"
                    : "bg-white border-slate-200 hover:border-blue-400 hover:scale-105"
                }`}
              >
                <div className="text-4xl mb-2">{oggetto.emoji}</div>
                <div className="text-lg font-semibold text-slate-900">{oggetto.nome}</div>
              </button>
            ))}
          </div>

          {/* Pulsante conferma */}
          {!feedback && (
            <button
              onClick={conferma}
              disabled={oggettiSelezionati.size === 0}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xl font-bold rounded-xl transition-colors"
            >
              ✓ Conferma ({oggettiSelezionati.size} selezionati)
            </button>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              className={`text-center p-4 rounded-xl ${
                feedback === "corretto"
                  ? "bg-emerald-100 border-2 border-emerald-300"
                  : "bg-amber-100 border-2 border-amber-300"
              }`}
            >
              <p className="text-2xl font-bold">
                {feedback === "corretto" ? "✅ Perfetto! Hai scelto tutto!" : "❌ Quasi! Controlla meglio!"}
              </p>
            </div>
          )}

          {/* Progresso */}
          <div className="text-center text-slate-500">
            Round {roundCorrente + 1} di {rounds.length}
          </div>
        </div>
      </div>
    </div>
  );
}
