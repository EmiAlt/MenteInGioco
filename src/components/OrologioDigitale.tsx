import { useState, useEffect } from "react";

interface OrologioDigitaleProps {
  onChiudi: () => void;
}

interface RoundOrologio {
  ore: number;
  minuti: number;
  periodo: string;
  opzioni: { testo: string; èCorretta: boolean }[];
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

const ROUNDS_DEFAULT: RoundOrologio[] = [
  {
    ore: 8,
    minuti: 0,
    periodo: "Mattina",
    opzioni: [
      { testo: "Ore 7:00", èCorretta: false },
      { testo: "Ore 8:00", èCorretta: true },
      { testo: "Ore 9:00", èCorretta: false },
    ],
  },
  {
    ore: 12,
    minuti: 30,
    periodo: "Mezzogiorno",
    opzioni: [
      { testo: "Ore 12:00", èCorretta: false },
      { testo: "Ore 12:30", èCorretta: true },
      { testo: "Ore 1:00", èCorretta: false },
    ],
  },
  {
    ore: 3,
    minuti: 0,
    periodo: "Pomeriggio",
    opzioni: [
      { testo: "Ore 2:00", èCorretta: false },
      { testo: "Ore 3:00", èCorretta: true },
      { testo: "Ore 4:00", èCorretta: false },
    ],
  },
  {
    ore: 7,
    minuti: 45,
    periodo: "Sera",
    opzioni: [
      { testo: "Ore 7:15", èCorretta: false },
      { testo: "Ore 7:45", èCorretta: true },
      { testo: "Ore 8:15", èCorretta: false },
    ],
  },
  {
    ore: 10,
    minuti: 15,
    periodo: "Mattina",
    opzioni: [
      { testo: "Ore 10:00", èCorretta: false },
      { testo: "Ore 10:15", èCorretta: true },
      { testo: "Ore 10:30", èCorretta: false },
    ],
  },
];

export default function OrologioDigitale({ onChiudi }: OrologioDigitaleProps) {
  const [rounds, setRounds] = useState<RoundOrologio[]>([]);
  const [roundCorrente, setRoundCorrente] = useState(0);
  const [feedback, setFeedback] = useState<"corretto" | "sbagliato" | null>(null);
  const [punteggio, setPunteggio] = useState(0);
  const [completato, setCompletato] = useState(false);

  // Carica rounds personalizzati o default e mescola
  useEffect(() => {
    const customRounds = localStorage.getItem("orologio_custom_rounds");
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
    
    // Mescola i rounds e le opzioni di ogni round
    const shuffledRounds = shuffleArray(roundsToUse).map(round => ({
      ...round,
      opzioni: shuffleArray(round.opzioni)
    }));
    
    setRounds(shuffledRounds);
  }, []);

  if (rounds.length === 0) return null;
  
  const round = rounds[roundCorrente];

  const gestisciClick = (èCorretta: boolean) => {
    if (feedback) return;

    if (èCorretta) {
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

  // Calcola gli angoli delle lancette
  const angoloOre = (round.ore % 12) * 30 + round.minuti * 0.5;
  const angoloMinuti = round.minuti * 6;

  if (completato) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-center space-y-6">
          <div className="text-7xl">⏰</div>
          <h2 className="text-3xl font-bold text-slate-900">Bravissimo!</h2>
          <p className="text-xl text-slate-600">
            Hai letto {punteggio} orologi su {rounds.length}
          </p>
          <p className="text-lg text-slate-500">Ottima capacità di orientamento!</p>
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
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">⏰ L'Orologio</h2>
          <button
            onClick={onChiudi}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg"
          >
            ← Chiudi
          </button>
        </div>
      </div>

      {/* Contenuto */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          {/* Istruzioni */}
          <div className="text-center">
            <p className="text-2xl text-slate-700 font-medium mb-2">
              Che ore sono?
            </p>
            <p className="text-lg text-slate-500">
              Guarda l'orologio e scegli l'orario corretto
            </p>
          </div>

          {/* Orologio analogico */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 bg-white rounded-full border-8 border-slate-800 shadow-lg">
              {/* Numeri */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, idx) => {
                const angolo = (idx * 30 - 90) * (Math.PI / 180);
                const x = 50 + 40 * Math.cos(angolo);
                const y = 50 + 40 * Math.sin(angolo);
                return (
                  <div
                    key={num}
                    className="absolute text-2xl font-bold text-slate-900"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {num}
                  </div>
                );
              })}

              {/* Lancetta ore */}
              <div
                className="absolute top-1/2 left-1/2 w-2 h-20 bg-slate-900 origin-bottom rounded-full"
                style={{
                  transform: `translate(-50%, -100%) rotate(${angoloOre}deg)`,
                }}
              />

              {/* Lancetta minuti */}
              <div
                className="absolute top-1/2 left-1/2 w-1.5 h-28 bg-slate-700 origin-bottom rounded-full"
                style={{
                  transform: `translate(-50%, -100%) rotate(${angoloMinuti}deg)`,
                }}
              />

              {/* Centro */}
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-slate-900 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Opzioni */}
          <div className="space-y-3">
            {round.opzioni.map((opzione, idx) => (
              <button
                key={idx}
                onClick={() => gestisciClick(opzione.èCorretta)}
                disabled={feedback !== null}
                className={`w-full p-5 rounded-2xl border-4 text-left transition-all ${
                  feedback && opzione.èCorretta
                    ? "bg-emerald-100 border-emerald-500"
                    : feedback && !opzione.èCorretta
                    ? "bg-slate-100 border-slate-300 opacity-50"
                    : "bg-white border-slate-200 hover:border-blue-400 hover:scale-102"
                }`}
              >
                <p className="text-xl font-semibold text-slate-900">
                  {opzione.testo}
                </p>
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
                {feedback === "corretto" ? "✅ Perfetto! Hai letto bene l'orologio!" : "❌ Riprova!"}
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
