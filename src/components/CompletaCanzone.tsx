import { useState, useEffect } from "react";

interface CompletaCanzoneProps {
  onChiudi: () => void;
}

interface RoundCanzone {
  titolo: string;
  artista: string;
  anno: string;
  fraseIniziale: string;
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

const ROUNDS_DEFAULT: RoundCanzone[] = [
  {
    titolo: "Volare",
    artista: "Domenico Modugno",
    anno: "1958",
    fraseIniziale: "Pensare che è bellissimo, volare...",
    opzioni: [
      { testo: "...nel cielo azzurro", èCorretta: false },
      { testo: "...alto nel cielo blu", èCorretta: true },
      { testo: "...sopra le nuvole", èCorretta: false },
    ],
  },
  {
    titolo: "Nel blu dipinto di blu",
    artista: "Domenico Modugno",
    anno: "1958",
    fraseIniziale: "Felice di stare lassù, e cantare...",
    opzioni: [
      { testo: "...nel blu dipinto di blu", èCorretta: true },
      { testo: "...sotto il cielo stellato", èCorretta: false },
      { testo: "...con le stelle lassù", èCorretta: false },
    ],
  },
  {
    titolo: "Azzurro",
    artista: "Adriano Celentano",
    anno: "1968",
    fraseIniziale: "Azzurro, quando il giorno se ne va...",
    opzioni: [
      { testo: "...la tristezza resta qua", èCorretta: false },
      { testo: "...l'azzurro si dipinge qua", èCorretta: false },
      { testo: "...l'azzurro se ne va", èCorretta: true },
    ],
  },
  {
    titolo: "24 mila baci",
    artista: "Adriano Celentano",
    anno: "1961",
    fraseIniziale: "Faccio un salto fino a te...",
    opzioni: [
      { testo: "...24 mila baci e un po' di più", èCorretta: true },
      { testo: "...ti porto un mazzo di fiori", èCorretta: false },
      { testo: "...dammi la tua mano", èCorretta: false },
    ],
  },
  {
    titolo: "Tu vuò fà l'americano",
    artista: "Renato Carosone",
    anno: "1956",
    fraseIniziale: "Tu vuò fà l'americano, americano, americano...",
    opzioni: [
      { testo: "...whisky e soda e rock and roll", èCorretta: true },
      { testo: "...con la macchina americana", èCorretta: false },
      { testo: "...ballare tutta la notte", èCorretta: false },
    ],
  },
];

export default function CompletaCanzone({ onChiudi }: CompletaCanzoneProps) {
  const [rounds, setRounds] = useState<RoundCanzone[]>([]);
  const [roundCorrente, setRoundCorrente] = useState(0);
  const [feedback, setFeedback] = useState<"corretto" | "sbagliato" | null>(null);
  const [punteggio, setPunteggio] = useState(0);
  const [completato, setCompletato] = useState(false);

  // Carica rounds personalizzati o default e mescola
  useEffect(() => {
    const customRounds = localStorage.getItem("canzoni_custom_rounds");
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
    }, 2500);
  };

  if (completato) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 text-center space-y-4 md:space-y-6 my-auto">
          <div className="text-6xl md:text-7xl">🎵</div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Bravissimo!</h2>
          <p className="text-lg md:text-xl text-slate-600">
            Hai completato {punteggio} canzoni su {rounds.length}
          </p>
          <p className="text-lg text-slate-500">La musica è un bellissimo ricordo!</p>
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
          <h2 className="text-2xl font-bold text-slate-900">🎵 Completa la Canzone</h2>
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
          {/* Info canzone */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 text-center border-2 border-purple-300">
            <div className="text-5xl mb-3">🎶</div>
            <p className="text-xl font-bold text-slate-900 mb-1">{round.titolo}</p>
            <p className="text-lg text-slate-600">{round.artista} ({round.anno})</p>
          </div>

          {/* Istruzioni */}
          <div className="text-center">
            <p className="text-2xl text-slate-700 font-medium mb-2">
              Come continua questa canzone?
            </p>
          </div>

          {/* Frase iniziale */}
          <div className="bg-white rounded-2xl border-4 border-purple-300 p-6 text-center">
            <p className="text-2xl text-slate-900 italic font-medium">
              "{round.fraseIniziale}..."
            </p>
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
                    : "bg-white border-slate-200 hover:border-purple-400 hover:scale-102"
                }`}
              >
                <p className="text-xl font-semibold text-slate-900">
                  "{opzione.testo}"
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
                {feedback === "corretto" ? "✅ Perfetto! La ricordi bene!" : "❌ Quasi! Riprova!"}
              </p>
            </div>
          )}

          {/* Progresso */}
          <div className="text-center text-slate-500">
            Canzone {roundCorrente + 1} di {rounds.length}
          </div>
        </div>
      </div>
    </div>
  );
}
