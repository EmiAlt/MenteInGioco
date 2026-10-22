import { useState, useEffect } from "react";

interface IntrusoLogicoProps {
  onChiudi: () => void;
}

interface RoundIntruso {
  categoria: string;
  elementi: { testo: string; emoji: string; èIntruso: boolean }[];
}

const ROUNDS_DEFAULT: RoundIntruso[] = [
  {
    categoria: "Frutti",
    elementi: [
      { testo: "Mela", emoji: "🍎", èIntruso: false },
      { testo: "Banana", emoji: "🍌", èIntruso: false },
      { testo: "Sedia", emoji: "🪑", èIntruso: true },
      { testo: "Pera", emoji: "🍐", èIntruso: false },
    ],
  },
  {
    categoria: "Animali",
    elementi: [
      { testo: "Cane", emoji: "🐕", èIntruso: false },
      { testo: "Gatto", emoji: "🐈", èIntruso: false },
      { testo: "Auto", emoji: "🚗", èIntruso: true },
      { testo: "Uccello", emoji: "🐦", èIntruso: false },
    ],
  },
  {
    categoria: "Mobili",
    elementi: [
      { testo: "Tavolo", emoji: "🪵", èIntruso: false },
      { testo: "Armadio", emoji: "🚪", èIntruso: false },
      { testo: "Fiore", emoji: "🌸", èIntruso: true },
      { testo: "Letto", emoji: "🛏️", èIntruso: false },
    ],
  },
  {
    categoria: "Cibo",
    elementi: [
      { testo: "Pane", emoji: "🍞", èIntruso: false },
      { testo: "Libro", emoji: "📖", èIntruso: true },
      { testo: "Formaggio", emoji: "🧀", èIntruso: false },
      { testo: "Pasta", emoji: "🍝", èIntruso: false },
    ],
  },
  {
    categoria: "Vestiti",
    elementi: [
      { testo: "Camicia", emoji: "👔", èIntruso: false },
      { testo: "Pantaloni", emoji: "👖", èIntruso: false },
      { testo: "Scarpe", emoji: "👟", èIntruso: false },
      { testo: "Albero", emoji: "🌳", èIntruso: true },
    ],
  },
];

// Funzione per mescolare array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function IntrusoLogico({ onChiudi }: IntrusoLogicoProps) {
  const [rounds, setRounds] = useState<RoundIntruso[]>([]);
  const [roundCorrente, setRoundCorrente] = useState(0);
  const [feedback, setFeedback] = useState<"corretto" | "sbagliato" | null>(null);
  const [punteggio, setPunteggio] = useState(0);
  const [completato, setCompletato] = useState(false);

  // Carica rounds personalizzati o default e mescola
  useEffect(() => {
    const customRounds = localStorage.getItem("intruso_custom_rounds");
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
    
    // Mescola i rounds e gli elementi di ogni round
    const shuffledRounds = shuffleArray(roundsToUse).map(round => ({
      ...round,
      elementi: shuffleArray(round.elementi)
    }));
    
    setRounds(shuffledRounds);
  }, []);

  if (rounds.length === 0) return null;
  
  const round = rounds[roundCorrente];

  const gestisciClick = (èIntruso: boolean) => {
    if (feedback) return;

    if (èIntruso) {
      setFeedback("corretto");
      setPunteggio(punteggio + 1);
    } else {
      setFeedback("sbagliato");
    }

    setTimeout(() => {
      if (roundCorrente < rounds.length - 1) {
        setRoundCorrente(roundCorrente + 1);
        setFeedback(null);
      } else {
        setCompletato(true);
      }
    }, 2000);
  };

  if (completato) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 text-center space-y-4 md:space-y-6 my-auto">
          <div className="text-6xl md:text-7xl">🎉</div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Bravissimo!</h2>
          <p className="text-lg md:text-xl text-slate-600">
            Hai trovato {punteggio} intrusi su {rounds.length}
          </p>
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
          <h2 className="text-2xl font-bold text-slate-900">🔍 L'Intruso Logico</h2>
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
        <div className="max-w-2xl w-full space-y-8">
          {/* Istruzioni */}
          <div className="text-center">
            <p className="text-2xl text-slate-700 font-medium mb-2">
              Trova l'intruso!
            </p>
            <p className="text-lg text-slate-500">
              Quale di questi non c'entra con gli altri?
            </p>
          </div>

          {/* Griglia elementi */}
          <div className="grid grid-cols-2 gap-4">
            {round.elementi.map((elem, idx) => (
              <button
                key={idx}
                onClick={() => gestisciClick(elem.èIntruso)}
                disabled={feedback !== null}
                className={`p-8 rounded-2xl border-4 transition-all ${
                  feedback && elem.èIntruso
                    ? "bg-emerald-100 border-emerald-500"
                    : feedback && !elem.èIntruso
                    ? "bg-slate-100 border-slate-300 opacity-50"
                    : "bg-white border-slate-200 hover:border-blue-400 hover:scale-105"
                }`}
              >
                <div className="text-6xl mb-3">{elem.emoji}</div>
                <div className="text-xl font-semibold text-slate-900">{elem.testo}</div>
              </button>
            ))}
          </div>

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
                {feedback === "corretto" ? "✅ Bravo! Hai trovato l'intruso!" : "❌ Riprova!"}
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
