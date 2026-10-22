import { useState, useCallback, useRef, useEffect } from "react";
import { useCognitiveSession } from "./hooks/useCognitiveSession";
import { simulaChiamataAI } from "./services/aiSimulator";
import { useProfiloPaziente } from "./hooks/useProfiloPaziente";
import { useImpostazioniSessione } from "./hooks/useImpostazioniSessione";
import PannelloCaregiver from "./components/PannelloCaregiver";
import GiocoCruciverba from "./components/GiocoCruciverba";
import GiocoPuzzle from "./components/GiocoPuzzle";
import IntrusoLogico from "./components/IntrusoLogico";
import MemorySemplificato from "./components/MemorySemplificato";
import OmbreSagome from "./components/OmbreSagome";
import CompletaCanzone from "./components/CompletaCanzone";
import ProverbiPopolari from "./components/ProverbiPopolari";
import ValigiaSpesa from "./components/ValigiaSpesa";
import OrologioDigitale from "./components/OrologioDigitale";

/** Durata del feedback visivo in millisecondi */
const FEEDBACK_DURATION_MS = 2500;

type FaseSessione = "benvenuto" | "domanda" | "feedback" | "fine";
type VistaApp = "paziente" | "caregiver";
type GiocoAttivo = 
  | "quiz" 
  | "cruciverba" 
  | "puzzle" 
  | "intruso" 
  | "memory" 
  | "ombre" 
  | "canzone" 
  | "proverbi" 
  | "valigia" 
  | "orologio" 
  | null;

function App() {
  const [profiloPaziente] = useProfiloPaziente();
  const [impostazioni] = useImpostazioniSessione();
  const [vistaCorrente, setVistaCorrente] = useState<VistaApp>("paziente");
  const [giocoAttivo, setGiocoAttivo] = useState<GiocoAttivo>(null);
  
  // Numero di domande per sessione (configurabile dal caregiver)
  const numeroDomande = impostazioni.numeroDomande;
  const {
    domandaCorrente,
    indiceDomandaCorrente,
    sessioneAttiva,
    sessioneCompletata,
    avviaSessione,
    rispondi,
    caricaProssimaDomanda,
    terminaSessione,
    iniettaDomandeAI,
    domandeAIGenerate,
    tempoDiReazione,
    cronologiaRisposte,
  } = useCognitiveSession();

  const [fase, setFase] = useState<FaseSessione>("benvenuto");
  const [feedbackTipo, setFeedbackTipo] = useState<"corretto" | "errato" | null>(null);
  const [rispostaSelezionata, setRispostaSelezionata] = useState<number | null>(null);
  const [disabilitaBottoni, setDisabilitaBottoni] = useState(false);
  const [caricamentoAI, setCaricamentoAI] = useState(false);
  const [staLeggendo, setStaLeggendo] = useState(false);

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

  // ─── GENERA ESERCIZIO PERSONALIZZATO AI ───
  const handleGeneraAI = useCallback(async () => {
    console.log("═══════════════════════════════════════");
    console.log("[UI] 🤖 PULSANTE AI CLICCATO");
    console.log(`[UI] Profilo paziente: ${profiloPaziente.nome}`);
    console.log("═══════════════════════════════════════");

    setCaricamentoAI(true);

    try {
      // Simula chiamata API
      const domandePersonalizzate = await simulaChiamataAI(profiloPaziente);

      // Inietta le domande nel flusso di gioco
      iniettaDomandeAI(domandePersonalizzate);

      console.log("[UI] ✅ Domande AI iniettate con successo nel flusso");
      console.log(`[UI] 📊 Totale domande AI disponibili: ${domandePersonalizzate.length}`);
    } catch (error) {
      console.error("[UI] ❌ Errore durante la generazione AI:", error);
    } finally {
      setCaricamentoAI(false);
    }
  }, [iniettaDomandeAI]);

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
        if (indiceDomandaCorrente >= numeroDomande) {
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

  // ─── Leggi domanda ad alta voce ───
  const handleLeggiDomanda = useCallback(() => {
    if (!domandaCorrente) return;

    // Ferma eventuali sintesi vocali in corso
    window.speechSynthesis.cancel();

    // Costruisci il testo da leggere
    const lettere = ["A", "B", "C"];
    const testoCompleto = `${domandaCorrente.testoDomanda}. ${domandaCorrente.opzioni
      .map((opzione, idx) => `Opzione ${lettere[idx]}: ${opzione}`)
      .join(". ")}.`;

    // Crea l'utterance
    const utterance = new SpeechSynthesisUtterance(testoCompleto);
    
    // Configura la voce italiana
    utterance.lang = "it-IT";
    utterance.rate = 0.8; // Velocità leggermente più lenta
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Cerca una voce italiana
    const voci = window.speechSynthesis.getVoices();
    const voceItaliana = voci.find(voce => voce.lang.startsWith("it"));
    if (voceItaliana) {
      utterance.voice = voceItaliana;
    }

    // Gestisci inizio e fine
    utterance.onstart = () => setStaLeggendo(true);
    utterance.onend = () => setStaLeggendo(false);
    utterance.onerror = () => setStaLeggendo(false);

    // Avvia la sintesi vocale
    window.speechSynthesis.speak(utterance);
  }, [domandaCorrente]);

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════

  // Vista Pannello Caregiver
  if (vistaCorrente === "caregiver") {
    return <PannelloCaregiver onTornaAlGioco={() => setVistaCorrente("paziente")} />;
  }

  // Vista Paziente
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Pulsante nascosto per accedere al Pannello Caregiver */}
      <button
        onClick={() => setVistaCorrente("caregiver")}
        className="fixed top-3 right-3 z-50 w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-700 text-xs font-bold flex items-center justify-center transition-colors opacity-30 hover:opacity-100 focus:opacity-100"
        aria-label="Accedi al Pannello Caregiver"
        title="Pannello Caregiver"
      >
        ⚙
      </button>

      {/* ─── SCHERMATA BENVENUTO ─── */}
      {fase === "benvenuto" && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 max-h-screen overflow-hidden">
          <div className="max-w-5xl w-full text-center space-y-3">
            {/* Header compatto */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-5xl" aria-hidden="true">🧠</div>
              <div className="text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                  Allenamento della mente
                </h1>
                <p className="text-sm text-slate-600">
                  Scegli un'attività • Prenditi il tuo tempo
                </p>
              </div>
            </div>

            {/* Sezione: Quiz e Giochi di Parole */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700 text-left">📝 Quiz e Giochi di Parole</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleInizia}
                  className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg shadow transition-all duration-200"
                >
                  <div className="text-3xl mb-1">📝</div>
                  <div className="text-sm font-bold">Quiz</div>
                  <div className="text-xs opacity-90">{numeroDomande} domande</div>
                </button>
                <button
                  onClick={() => setGiocoAttivo("cruciverba")}
                  className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg shadow transition-all duration-200"
                >
                  <div className="text-3xl mb-1">🧩</div>
                  <div className="text-sm font-bold">Cruciverba</div>
                  <div className="text-xs opacity-90">Parole</div>
                </button>
                <button
                  onClick={() => setGiocoAttivo("proverbi")}
                  className="p-3 bg-gradient-to-br from-amber-600 to-yellow-700 hover:from-amber-700 hover:to-yellow-800 text-white rounded-lg shadow transition-all duration-200"
                >
                  <div className="text-3xl mb-1">📜</div>
                  <div className="text-sm font-bold">Proverbi</div>
                  <div className="text-xs opacity-90">Modi di dire</div>
                </button>
              </div>
            </div>

            {/* Sezione: Memoria e Associazione */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700 text-left">🧠 Memoria e Associazione</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setGiocoAttivo("memory")}
                  className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg shadow transition-all duration-200"
                >
                  <div className="text-3xl mb-1">🃏</div>
                  <div className="text-sm font-bold">Memory</div>
                  <div className="text-xs opacity-90">Coppie</div>
                </button>
                <button
                  onClick={() => setGiocoAttivo("intruso")}
                  className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg shadow transition-all duration-200"
                >
                  <div className="text-3xl mb-1">🔍</div>
                  <div className="text-sm font-bold">Intruso</div>
                  <div className="text-xs opacity-90">Diverso</div>
                </button>
                <button
                  onClick={() => setGiocoAttivo("ombre")}
                  className="p-3 bg-gradient-to-br from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white rounded-lg shadow transition-all duration-200"
                >
                  <div className="text-3xl mb-1">🌑</div>
                  <div className="text-sm font-bold">Ombre</div>
                  <div className="text-xs opacity-90">Sagome</div>
                </button>
              </div>
            </div>

            {/* Sezione: Musica e Ricordi */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700 text-left">🎵 Musica e Ricordi</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setGiocoAttivo("canzone")}
                  className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg shadow transition-all duration-200"
                >
                  <div className="text-3xl mb-1">🎶</div>
                  <div className="text-sm font-bold">Canzoni</div>
                  <div className="text-xs opacity-90">Testo</div>
                </button>
                <button
                  onClick={() => setGiocoAttivo("puzzle")}
                  className="p-3 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg shadow transition-all duration-200"
                >
                  <div className="text-3xl mb-1">🖼️</div>
                  <div className="text-sm font-bold">Puzzle</div>
                  <div className="text-xs opacity-90">Immagini</div>
                </button>
                <button
                  onClick={() => setGiocoAttivo("valigia")}
                  className="p-3 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-lg shadow transition-all duration-200"
                >
                  <div className="text-3xl mb-1">🧳</div>
                  <div className="text-sm font-bold">Valigia</div>
                  <div className="text-xs opacity-90">Oggetti</div>
                </button>
              </div>
            </div>

            {/* Sezione: Orientamento + AI */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-700 text-left">⏰ Orientamento</h3>
                <button
                  onClick={() => setGiocoAttivo("orologio")}
                  className="w-full p-3 bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-lg shadow transition-all duration-200"
                >
                  <div className="text-3xl mb-1">⏰</div>
                  <div className="text-sm font-bold">Orologio</div>
                  <div className="text-xs opacity-90">Che ore sono?</div>
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-700 text-left">🤖 AI</h3>
                <button
                  onClick={handleGeneraAI}
                  disabled={caricamentoAI}
                  className="w-full p-3 bg-gradient-to-br from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg shadow transition-all duration-200"
                >
                  {caricamentoAI ? (
                    <div className="text-3xl mb-1 animate-spin">⚙️</div>
                  ) : (
                    <div className="text-3xl mb-1">🤖</div>
                  )}
                  <div className="text-sm font-bold">
                    {caricamentoAI ? "Generando..." : "Personalizza"}
                  </div>
                  <div className="text-xs opacity-90">
                    {caricamentoAI ? "Attendi..." : `Per ${profiloPaziente.nome}`}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SCHERMATA DOMANDA ─── */}
      {(fase === "domanda" || fase === "feedback") && domandaCorrente && (
        <div className="flex-1 flex flex-col px-4 py-6 md:px-8 md:py-10">
          {/* Timer e progresso */}
          <div className="max-w-2xl w-full mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm font-medium">
                Domanda {Math.min(indiceDomandaCorrente, numeroDomande)} di {numeroDomande}
              </span>
              <div className="flex items-center gap-3">
                {domandaCorrente.id.startsWith("ai-") && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    🤖 Personalizzata
                  </span>
                )}
                {domandaCorrente.id.startsWith("custom-") && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    📝 Importata
                  </span>
                )}
                <span className="text-slate-400 text-sm">
                  {domandaCorrente.categoria}
                </span>
                {/* Timer discreto */}
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
                  <span className="text-slate-400 text-xs">⏱️</span>
                  <span className="text-slate-600 text-sm font-mono font-medium">
                    {tempoDiReazione}s
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(Math.min(indiceDomandaCorrente, numeroDomande) / numeroDomande) * 100}%`,
                }}
              />
            </div>
            {/* Riepilogo risposte precedenti */}
            {cronologiaRisposte.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-slate-500 font-medium">Risposte:</span>
                <div className="flex gap-1.5">
                  {cronologiaRisposte.map((entry, idx) => (
                    <div
                      key={idx}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        entry.corretta
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                      title={`Domanda ${idx + 1}: ${entry.corretta ? "Corretta" : "Errata"} (${entry.tempoReazione}s)`}
                    >
                      {entry.corretta ? "✓" : "·"}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contenuto principale */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full mx-auto">
            {/* Testo della domanda con pulsante altoparlante */}
            <div className="w-full flex items-start gap-4 mb-10 md:mb-14">
              <h2
                className="flex-1 text-3xl md:text-4xl font-bold text-slate-900 text-center leading-snug"
                aria-live="polite"
              >
                {domandaCorrente.testoDomanda}
              </h2>
              <button
                onClick={handleLeggiDomanda}
                disabled={staLeggendo}
                className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-lg transition-all ${
                  staLeggendo
                    ? "bg-blue-500 text-white animate-pulse"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                }`}
                aria-label="Leggi domanda ad alta voce"
                title="Leggi domanda ad alta voce"
              >
                🔊
              </button>
            </div>

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

      {/* ─── GIOCHI EXTRA ─── */}
      {giocoAttivo === "cruciverba" && (
        <GiocoCruciverba onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "puzzle" && (
        <GiocoPuzzle onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "intruso" && (
        <IntrusoLogico onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "memory" && (
        <MemorySemplificato onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "ombre" && (
        <OmbreSagome onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "canzone" && (
        <CompletaCanzone onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "proverbi" && (
        <ProverbiPopolari onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "valigia" && (
        <ValigiaSpesa onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "orologio" && (
        <OrologioDigitale onChiudi={() => setGiocoAttivo(null)} />
      )}
    </div>
  );
}

export default App;
