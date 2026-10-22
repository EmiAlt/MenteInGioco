import { useState, useEffect } from "react";
import { useRicordi, Ricordo } from "../hooks/useRicordi";

interface MemoryVitaProps {
  onChiudi: () => void;
}

interface DomandaQuiz {
  ricordo: Ricordo;
  opzioni: { testo: string; èCorretta: boolean }[];
}

export default function MemoryVita({ onChiudi }: MemoryVitaProps) {
  const { ricordi } = useRicordi();
  const [domandaCorrente, setDomandaCorrente] = useState<DomandaQuiz | null>(null);
  const [indiceDomanda, setIndiceDomanda] = useState(0);
  const [rispostaSelezionata, setRispostaSelezionata] = useState<number | null>(null);
  const [punteggio, setPunteggio] = useState(0);
  const [completato, setCompletato] = useState(false);
  const [feedback, setFeedback] = useState<"corretto" | "sbagliato" | null>(null);

  // Genera le domande mescolando i ricordi
  useEffect(() => {
    if (ricordi.length > 0 && !domandaCorrente) {
      generaProssimaDomanda();
    }
  }, [ricordi]);

  const generaProssimaDomanda = () => {
    if (ricordi.length === 0) return;

    // Seleziona un ricordo casuale
    const ricordoCasuale = ricordi[Math.floor(Math.random() * ricordi.length)];

    // Crea le 3 opzioni e mescolale
    const opzioni = [
      { testo: ricordoCasuale.descrizioneCorretta, èCorretta: true },
      { testo: ricordoCasuale.descrizioneSbagliata1, èCorretta: false },
      { testo: ricordoCasuale.descrizioneSbagliata2, èCorretta: false },
    ].sort(() => Math.random() - 0.5);

    setDomandaCorrente({
      ricordo: ricordoCasuale,
      opzioni,
    });
  };

  const gestisciRisposta = (indice: number) => {
    if (rispostaSelezionata !== null) return; // Evita double-click

    setRispostaSelezionata(indice);
    const èCorretta = domandaCorrente?.opzioni[indice].èCorretta;

    if (èCorretta) {
      setFeedback("corretto");
      setPunteggio(punteggio + 1);
    } else {
      setFeedback("sbagliato");
    }

    // Passa alla prossima domanda dopo 2 secondi
    setTimeout(() => {
      if (indiceDomanda + 1 >= ricordi.length) {
        setCompletato(true);
      } else {
        setIndiceDomanda(indiceDomanda + 1);
        setRispostaSelezionata(null);
        setFeedback(null);
        generaProssimaDomanda();
      }
    }, 2000);
  };

  const ricomincia = () => {
    setIndiceDomanda(0);
    setPunteggio(0);
    setCompletato(false);
    setRispostaSelezionata(null);
    setFeedback(null);
    generaProssimaDomanda();
  };

  // Schermata iniziale - nessun ricordo disponibile
  if (ricordi.length === 0) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-center space-y-6">
          <div className="text-7xl">📸</div>
          <h2 className="text-3xl font-bold text-slate-900">Memorie di Vita</h2>
          <p className="text-xl text-slate-600">
            Non ci sono ancora ricordi salvati.
          </p>
          <p className="text-lg text-slate-500">
            Il caregiver deve caricare almeno una foto con le 3 descrizioni.
          </p>
          <button
            onClick={onChiudi}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl"
          >
            ← Torna al Menu
          </button>
        </div>
      </div>
    );
  }

  // Schermata completamento
  if (completato) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-center space-y-6">
          <div className="text-7xl">🎉</div>
          <h2 className="text-3xl font-bold text-slate-900">Complimenti!</h2>
          <p className="text-xl text-slate-600">
            Hai indovinato {punteggio} foto su {ricordi.length}
          </p>
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
            <p className="text-lg text-emerald-800 font-medium">
              {punteggio === ricordi.length
                ? "🌟 Perfetto! Le hai riconosciute tutte!"
                : punteggio >= ricordi.length * 0.7
                ? "👏 Ottimo lavoro!"
                : "💪 Continua ad allenarti!"}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={ricomincia}
              className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl"
            >
              🔄 Gioca Ancora
            </button>
            <button
              onClick={onChiudi}
              className="flex-1 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xl font-bold rounded-xl"
            >
              ← Torna al Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Schermata di gioco
  if (!domandaCorrente) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50">
        <div className="text-2xl text-slate-600">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">📸 Memorie di Vita</h2>
            <p className="text-sm text-slate-500">
              Foto {indiceDomanda + 1} di {ricordi.length} | Punteggio: {punteggio}
            </p>
          </div>
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
        <div className="max-w-4xl w-full space-y-6">
          {/* Istruzioni */}
          <div className="text-center">
            <p className="text-2xl text-slate-700 font-medium mb-2">
              Quale descrizione è corretta per questa foto?
            </p>
          </div>

          {/* Foto */}
          <div className="bg-white rounded-2xl shadow-lg border-4 border-blue-300 p-4">
            <img
              src={domandaCorrente.ricordo.foto}
              alt="Foto da riconoscere"
              className="w-full max-h-96 object-contain rounded-xl"
            />
          </div>

          {/* Opzioni */}
          <div className="space-y-3">
            {domandaCorrente.opzioni.map((opzione, idx) => {
              let buttonStyle = "bg-white border-slate-300 hover:border-blue-400 hover:bg-blue-50";
              
              if (rispostaSelezionata !== null) {
                if (opzione.èCorretta) {
                  buttonStyle = "bg-emerald-100 border-emerald-500";
                } else if (idx === rispostaSelezionata && !opzione.èCorretta) {
                  buttonStyle = "bg-red-100 border-red-500";
                } else {
                  buttonStyle = "bg-slate-100 border-slate-300 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => gestisciRisposta(idx)}
                  disabled={rispostaSelezionata !== null}
                  className={`w-full p-6 rounded-2xl border-4 text-left transition-all ${buttonStyle}`}
                >
                  <p className="text-xl md:text-2xl font-semibold text-slate-900">
                    {opzione.testo}
                  </p>
                </button>
              );
            })}
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
                {feedback === "corretto" ? "✅ Corretto!" : "❌ Non è corretto"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
