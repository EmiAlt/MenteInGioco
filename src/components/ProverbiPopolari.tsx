import { useState } from "react";

interface ProverbiPopolariProps {
  onChiudi: () => void;
}

interface RoundProverbio {
  inizio: string;
  finale: string;
  opzioni: { testo: string; èCorretto: boolean }[];
}

const ROUNDS: RoundProverbio[] = [
  {
    inizio: "Rosso di sera...",
    finale: "bel tempo si spera",
    opzioni: [
      { testo: "bel tempo si spera", èCorretto: true },
      { testo: "la notte si perde", èCorretto: false },
      { testo: "il giorno si ferma", èCorretto: false },
    ],
  },
  {
    inizio: "Chi dorme non piglia...",
    finale: "pesci",
    opzioni: [
      { testo: "pesci", èCorretto: true },
      { testo: "sole", èCorretto: false },
      { testo: "tempo", èCorretto: false },
    ],
  },
  {
    inizio: "Il mattino ha l'oro...",
    finale: "in bocca",
    opzioni: [
      { testo: "in bocca", èCorretto: true },
      { testo: "in mano", èCorretto: false },
      { testo: "nel cuore", èCorretto: false },
    ],
  },
  {
    inizio: "Piano piano si va...",
    finale: "lontano",
    opzioni: [
      { testo: "lontano", èCorretto: true },
      { testo: "vicino", èCorretto: false },
      { testo: "a casa", èCorretto: false },
    ],
  },
  {
    inizio: "A Natale ti puoi...",
    finale: "invischiare",
    opzioni: [
      { testo: "invischiare", èCorretto: true },
      { testo: "riposare", èCorretto: false },
      { testo: "divertire", èCorretto: false },
    ],
  },
  {
    inizio: "Chi la dura la...",
    finale: "vince",
    opzioni: [
      { testo: "vince", èCorretto: true },
      { testo: "perde", èCorretto: false },
      { testo: "ottiene", èCorretto: false },
    ],
  },
  {
    inizio: "Meglio soli che...",
    finale: "male accompagnati",
    opzioni: [
      { testo: "male accompagnati", èCorretto: true },
      { testo: "tristi sempre", èCorretto: false },
      { testo: "senza amici", èCorretto: false },
    ],
  },
];

export default function ProverbiPopolari({ onChiudi }: ProverbiPopolariProps) {
  const [roundCorrente, setRoundCorrente] = useState(0);
  const [feedback, setFeedback] = useState<"corretto" | "sbagliato" | null>(null);
  const [punteggio, setPunteggio] = useState(0);
  const [completato, setCompletato] = useState(false);

  const round = ROUNDS[roundCorrente];

  const gestisciClick = (èCorretto: boolean) => {
    if (feedback) return;

    if (èCorretto) {
      setFeedback("corretto");
      setPunteggio(punteggio + 1);
    } else {
      setFeedback("sbagliato");
    }

    setTimeout(() => {
      if (roundCorrente < ROUNDS.length - 1) {
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
          <div className="text-7xl">📚</div>
          <h2 className="text-3xl font-bold text-slate-900">Bravissimo!</h2>
          <p className="text-xl text-slate-600">
            Hai completato {punteggio} proverbi su {ROUNDS.length}
          </p>
          <p className="text-lg text-slate-500">La saggezza popolare è un tesoro!</p>
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
          <h2 className="text-2xl font-bold text-slate-900">📜 I Proverbi Popolari</h2>
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
              Completa il proverbio!
            </p>
            <p className="text-lg text-slate-500">
              Come continua questo detto popolare?
            </p>
          </div>

          {/* Inizio proverbio */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-4 border-amber-300 p-8 text-center">
            <div className="text-5xl mb-4">📖</div>
            <p className="text-3xl text-slate-900 font-bold italic">
              "{round.inizio}..."
            </p>
          </div>

          {/* Opzioni */}
          <div className="space-y-3">
            {round.opzioni.map((opzione, idx) => (
              <button
                key={idx}
                onClick={() => gestisciClick(opzione.èCorretto)}
                disabled={feedback !== null}
                className={`w-full p-5 rounded-2xl border-4 text-left transition-all ${
                  feedback && opzione.èCorretto
                    ? "bg-emerald-100 border-emerald-500"
                    : feedback && !opzione.èCorretto
                    ? "bg-slate-100 border-slate-300 opacity-50"
                    : "bg-white border-slate-200 hover:border-amber-400 hover:scale-102"
                }`}
              >
                <p className="text-xl font-semibold text-slate-900">
                  "...{opzione.testo}"
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
                {feedback === "corretto" 
                  ? `✅ Perfetto! "${round.inizio} ${round.finale}"` 
                  : `❌ Il finale corretto era: "${round.finale}"`}
              </p>
            </div>
          )}

          {/* Progresso */}
          <div className="text-center text-slate-500">
            Proverbio {roundCorrente + 1} di {ROUNDS.length}
          </div>
        </div>
      </div>
    </div>
  );
}
