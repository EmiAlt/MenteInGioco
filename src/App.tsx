import { useState, useCallback, useRef, useEffect } from "react";
import { useCognitiveSession } from "./hooks/useCognitiveSession";

/** Numero massimo di domande per sessione */
const MAX_DOMANDE = 5;

/** Durata del feedback visivo in millisecondi */
const FEEDBACK_DURATION_MS = 2500;

type FaseSessione = "benvenuto" | "domanda" | "feedback" | "fine";

function App() {
  const {
    domandaCorrente,
    indiceDomandaCorrente,
    sessioneAttiva,
    sessioneCompletata,
    avviaSessione,
    rispondi,
    caricaProssimaDomanda,
    terminaSessione,
  } = useCognitiveSession();

  const [fase, setFase] = useState<FaseSessione>("benvenuto");
  const [feedbackTipo, setFeedbackTipo] = useState<"corretto" | "errato" | null>(null);
  const [rispostaSelezionata, setRispostaSelezionata] = useState<number | null>(null);
  const [disabilitaBottoni, setDisabilitaBottoni] = useState(false);

  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer al unmount
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  // ─── AVVIA SESSIONE ───
  const handleInizia = useCallback(() => {
    avviaSessione();
    setFase("domanda");
    setFeedbackTipo(null);
    setRispostaSelezionata(null);
    setDisabilitaBottoni(false);
  }, [avviaSessione]);

  // ─── GESTISCE RISPOSTA ───
  const handleRispondi = useCallback(
    (indiceOpzione: number) => {
      if (disabilitaBottoni || !domandaCorrente) return;

      // Blocca ulteriori click
      setDisabilitaBottoni(true);
      setRispostaSelezionata(indiceOpzione);

      // Registra la risposta nell'hook
      const risultato = rispondi(indiceOpzione);

      // Mostra feedback
      setFeedbackTipo(risultato.corretta ? "corretto" : "errato");
      setFase("feedback");

      // Dopo il duration del feedback, passa alla prossima domanda o alla fine
      feedbackTimerRef.current = setTimeout(() => {
        // Controlla se abbiamo raggiunto il massimo di domande
        if (indiceDomandaCorrente >= MAX_DOMANDE) {
          terminaSessione();
          setFase("fine");
        } else {
          // Carica la prossima domanda
          caricaProssimaDomanda();
          setFase("domanda");
          setFeedbackTipo(null);
          setRispostaSelezionata(null);
          setDisabilitaBottoni(false);
        }
      }, FEEDBACK_DURATION_MS);
    },
    [
      disabilitaBottoni,
      domandaCorrente,
      rispondi,
      indiceDomandaCorrente,
      caricaProssimaDomanda,
      terminaSessione,
    ]
  );

  // ─── Torna al benvenuto ───
  const handleTornaAllInizio = useCallback(() => {
    setFase("benvenuto");
    setFeedbackTipo(null);
    setRispostaSelezionata(null);
    setDisabilitaBottoni(false);
  }, []);

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ─── SCHERMATA BENVENUTO ─── */}
      {fase === "benvenuto" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-xl w-full text-center space-y-8">
            {/* Icona gentile */}
            <div className="text-7xl" aria-hidden="true">
              🧠
            </div>

            {/* Titolo */}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Allenamento della mente
            </h1>

            {/* Sottotitolo rassicurante */}
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
              Rispondi a qualche domanda semplice per tenere la mente attiva.
              <br />
              <span className="text-slate-500">Non c'è fretta, prenditi il tuo tempo.</span>
            </p>

            {/* Info sessione */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-2">
              <p className="text-slate-700 text-lg">
                📝 <strong>{MAX_DOMANDE} domande</strong> semplici e divertenti
              </p>
              <p className="text-slate-500">
                Nessuna pressione, nessun voto. Solo un momento per te.
              </p>
            </div>

            {/* Pulsante inizia */}
            <button
              onClick={handleInizia}
              className="w-full max-w-md mx-auto py-6 px-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-2xl md:text-3xl font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label="Inizia la sessione di allenamento"
            >
              Iniziamo! ☀️
            </button>
          </div>
        </div>
      )}

      {/* ─── SCHERMATA DOMANDA ─── */}
      {(fase === "domanda" || fase === "feedback") && domandaCorrente && (
        <div className="flex-1 flex flex-col px-4 py-6 md:px-8 md:py-10">
          {/* Barra progresso gentile */}
          <div className="max-w-2xl w-full mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm font-medium">
                Domanda {Math.min(indiceDomandaCorrente, MAX_DOMANDE)} di {MAX_DOMANDE}
              </span>
              <span className="text-slate-400 text-sm">
                {domandaCorrente.categoria}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(Math.min(indiceDomandaCorrente, MAX_DOMANDE) / MAX_DOMANDE) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Contenuto principale */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full mx-auto">
            {/* Testo della domanda */}
            <h2
              className="text-3xl md:text-4xl font-bold text-slate-900 text-center leading-snug mb-10 md:mb-14"
              aria-live="polite"
            >
              {domandaCorrente.testoDomanda}
            </h2>

            {/* Opzioni di risposta */}
            <div className="w-full space-y-4" role="group" aria-label="Opzioni di risposta">
              {domandaCorrente.opzioni.map((opzione, idx) => {
                // Stili per il feedback
                let buttonStyle = "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white";
                let extraClasses = "";

                if (fase === "feedback" && rispostaSelezionata === idx) {
                  if (feedbackTipo === "corretto") {
                    buttonStyle = "bg-emerald-500 text-white ring-4 ring-emerald-300";
                  } else {
                    buttonStyle = "bg-amber-400 text-white ring-4 ring-amber-200";
                  }
                }

                if (disabilitaBottoni && fase === "feedback" && rispostaSelezionata !== idx) {
                  extraClasses = "opacity-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleRispondi(idx)}
                    disabled={disabilitaBottoni}
                    className={`w-full py-6 px-6 md:py-7 md:px-8 text-xl md:text-2xl font-semibold rounded-2xl shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 ${buttonStyle} ${extraClasses}`}
                    aria-label={`Opzione ${String.fromCharCode(65 + idx)}: ${opzione}`}
                  >
                    <span className="flex items-center gap-4">
                      <span className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 text-lg md:text-xl font-bold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-left">{opzione}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback visivo */}
            {fase === "feedback" && (
              <div
                className="mt-8 text-center"
                role="status"
                aria-live="assertive"
              >
                {feedbackTipo === "corretto" ? (
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-8 py-5 inline-block">
                    <p className="text-2xl md:text-3xl font-bold text-emerald-700">
                      Bravissimo! 👏
                    </p>
                  </div>
                ) : (
                  <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl px-8 py-5 inline-block">
                    <p className="text-2xl md:text-3xl font-bold text-sky-700">
                      Ci siamo quasi, proviamo la prossima! 💪
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SCHERMATA FINALE ─── */}
      {fase === "fine" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-xl w-full text-center space-y-8">
            {/* Icona celebrativa ma sobria */}
            <div className="text-7xl" aria-hidden="true">
              🌟
            </div>

            {/* Messaggio caloroso */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Grazie per aver allenato la tua mente oggi!
            </h2>

            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
              Hai fatto un ottimo lavoro.
              <br />
              <span className="text-slate-500">
                Ogni piccolo esercizio è un regalo per il tuo benessere.
              </span>
            </p>

            {/* Messaggio motivazionale */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <p className="text-lg text-amber-800 font-medium">
                🌻 Torna quando vuoi, saremo felici di allenarci ancora insieme!
              </p>
            </div>

            {/* Pulsante per tornare all'inizio */}
            <button
              onClick={handleTornaAllInizio}
              className="w-full max-w-md mx-auto py-6 px-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-2xl md:text-3xl font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label="Torna alla schermata iniziale"
            >
              Torna all'inizio 🏠
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
