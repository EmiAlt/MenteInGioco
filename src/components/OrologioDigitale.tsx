import { useState } from "react";

interface OrologioDigitaleProps {
  onChiudi: () => void;
}

interface RoundOrologio {
  ore: number;
  minuti: number;
  periodo: string;
  opzioni: { testo: string; èCorretta: boolean }[];
}

const ROUNDS: RoundOrologio[] = [
  {
    ore: 8,
    minuti: 0,
    periodo: "Mattina",
    opzioni: [
      { testo: "Ore 8:00 - Mattina", èCorretta: true },
      { testo: "Ore 20:00 - Sera", èCorretta: false },
      { testo: "Ore 14:00 - Pomeriggio", èCorretta: false },
    ],
  },
  {
    ore: 12,
    minuti: 30,
    periodo: "Mezzogiorno",
    opzioni: [
      { testo: "Ore 12:30 - Mezzogiorno", èCorretta: true },
      { testo: "Ore 00:30 - Notte", èCorretta: false },
      { testo: "Ore 18:30 - Sera", èCorretta: false },
    ],
  },
  {
    ore: 15,
    minuti: 0,
    periodo: "Pomeriggio",
    opzioni: [
      { testo: "Ore 3:00 - Mattina", èCorretta: false },
      { testo: "Ore 15:00 - Pomeriggio", èCorretta: true },
      { testo: "Ore 21:00 - Sera", èCorretta: false },
    ],
  },
  {
    ore: 19,
    minuti: 45,
    periodo: "Sera",
    opzioni: [
      { testo: "Ore 7:45 - Mattina", èCorretta: false },
      { testo: "Ore 13:45 - Pomeriggio", èCorretta: false },
      { testo: "Ore 19:45 - Sera", èCorretta: true },
    ],
  },
  {
    ore: 22,
    minuti: 15,
    periodo: "Notte",
    opzioni: [
      { testo: "Ore 10:15 - Mattina", èCorretta: false },
      { testo: "Ore 22:15 - Notte", èCorretta: true },
      { testo: "Ore 16:15 - Pomeriggio", èCorretta: false },
    ],
  },
];

export default function OrologioDigitale({ onChiudi }: OrologioDigitaleProps) {
  const [roundCorrente, setRoundCorrente] = useState(0);
  const [feedback, setFeedback] = useState<"corretto" | "sbagliato" | null>(null);
  const [punteggio, setPunteggio] = useState(0);
  const [completato, setCompletato] = useState(false);

  const round = ROUNDS[roundCorrente];

  const gestisciClick = (èCorretta: boolean) => {
    if (feedback) return;

    if (èCorretta) {
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
            Hai letto {punteggio} orologi su {ROUNDS.length}
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
            Round {roundCorrente + 1} di {ROUNDS.length}
          </div>
        </div>
      </div>
    </div>
  );
}
