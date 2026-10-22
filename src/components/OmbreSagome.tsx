import { useState, useEffect } from "react";

interface OmbreSagomeProps {
  onChiudi: () => void;
}

interface RoundOmbra {
  oggetto: string;
  emoji: string;
  sagome: { id: number; emoji: string; èCorretta: boolean }[];
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

const ROUNDS: RoundOmbra[] = [
  {
    oggetto: "Tazza",
    emoji: "☕",
    sagome: [
      { id: 0, emoji: "🍽️", èCorretta: false },
      { id: 1, emoji: "☕", èCorretta: true },
      { id: 2, emoji: "🥄", èCorretta: false },
    ],
  },
  {
    oggetto: "Cappello",
    emoji: "🎩",
    sagome: [
      { id: 0, emoji: "👟", èCorretta: false },
      { id: 1, emoji: "🎩", èCorretta: true },
      { id: 2, emoji: "🧤", èCorretta: false },
    ],
  },
  {
    oggetto: "Fiore",
    emoji: "🌸",
    sagome: [
      { id: 0, emoji: "🌸", èCorretta: true },
      { id: 1, emoji: "🍄", èCorretta: false },
      { id: 2, emoji: "🌵", èCorretta: false },
    ],
  },
  {
    oggetto: "Ombrello",
    emoji: "☂️",
    sagome: [
      { id: 0, emoji: "🧢", èCorretta: false },
      { id: 1, emoji: "🎒", èCorretta: false },
      { id: 2, emoji: "☂️", èCorretta: true },
    ],
  },
  {
    oggetto: "Chiave",
    emoji: "🔑",
    sagome: [
      { id: 0, emoji: "🔑", èCorretta: true },
      { id: 1, emoji: "🔒", èCorretta: false },
      { id: 2, emoji: "🔨", èCorretta: false },
    ],
  },
];

export default function OmbreSagome({ onChiudi }: OmbreSagomeProps) {
  const [rounds, setRounds] = useState<RoundOmbra[]>([]);
  const [roundCorrente, setRoundCorrente] = useState(0);
  const [feedback, setFeedback] = useState<"corretto" | "sbagliato" | null>(null);
  const [punteggio, setPunteggio] = useState(0);
  const [completato, setCompletato] = useState(false);

  // Mescola i rounds e le sagome di ogni round
  useEffect(() => {
    const shuffledRounds = shuffleArray(ROUNDS).map(round => ({
      ...round,
      sagome: shuffleArray(round.sagome)
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

  if (completato) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-center space-y-6">
          <div className="text-7xl">🎉</div>
          <h2 className="text-3xl font-bold text-slate-900">Bravissimo!</h2>
          <p className="text-xl text-slate-600">
            Hai associato {punteggio} oggetti su {rounds.length}
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
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">🌑 Ombre e Sagome</h2>
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
              Trova la sagoma corretta!
            </p>
            <p className="text-lg text-slate-500">
              Quale di queste è la sagoma di {round.oggetto.toLowerCase()}?
            </p>
          </div>

          {/* Oggetto colorato */}
          <div className="bg-white rounded-2xl border-4 border-blue-300 p-8 text-center">
            <div className="text-8xl mb-4">{round.emoji}</div>
            <p className="text-2xl font-bold text-slate-900">{round.oggetto}</p>
          </div>

          {/* Sagome */}
          <div className="grid grid-cols-3 gap-4">
            {round.sagome.map((sagoma) => (
              <button
                key={sagoma.id}
                onClick={() => gestisciClick(sagoma.èCorretta)}
                disabled={feedback !== null}
                className={`p-6 rounded-2xl border-4 transition-all ${
                  feedback && sagoma.èCorretta
                    ? "bg-emerald-100 border-emerald-500"
                    : feedback && !sagoma.èCorretta
                    ? "bg-slate-100 border-slate-300 opacity-50"
                    : "bg-slate-900 border-slate-700 hover:border-blue-400 hover:scale-105"
                }`}
              >
                <div className="text-6xl filter brightness-0 invert opacity-80">{sagoma.emoji}</div>
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
                {feedback === "corretto" ? "✅ Perfetto! Hai trovato la sagoma!" : "❌ Riprova!"}
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
