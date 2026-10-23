import { useState, useCallback, useRef, useEffect } from "react";
import { useCognitiveSession } from "./hooks/useCognitiveSession";
import { simulaChiamataAI } from "./services/aiSimulator";
import { useProfiloPaziente } from "./hooks/useProfiloPaziente";
import { useImpostazioniSessione } from "./hooks/useImpostazioniSessione";
import { useTheme } from "./hooks/useTheme";
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
import TestDatiPaziente from "./components/TestDatiPaziente";
import PannelloRicordi from "./components/PannelloRicordi";
import MemoryVita from "./components/MemoryVita";
import AssociazioniTematiche from "./components/AssociazioniTematiche";
import FooterThemeSelector from "./components/FooterThemeSelector";
import Forza4 from "./components/Forza4";
import Tris from "./components/Tris";

/** Durata del feedback visivo in millisecondi */
const FEEDBACK_DURATION_MS = 2500;

type FaseSessione = "benvenuto" | "domanda" | "feedback" | "fine";
type VistaApp = "paziente" | "caregiver" | "test" | "ricordi";
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
  | "memory-vita"
  | "associazioni"
  | "forza4"
  | "tris"
  | null;

function App() {
  const [profiloPaziente] = useProfiloPaziente();
  const [impostazioni] = useImpostazioniSessione();
  const [vistaCorrente, setVistaCorrente] = useState<VistaApp>("paziente");
  const [giocoAttivo, setGiocoAttivo] = useState<GiocoAttivo>(null);
  const { theme, setTheme, themeConfig } = useTheme();
  
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // ─── CARICA FILE JSON ───
  const handleCaricaJSON = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dati = JSON.parse(event.target?.result as string);
        
        // Salva in localStorage
        localStorage.setItem("menteingioco_dati_paziente", JSON.stringify(dati));
        
        console.log("[UI] ✅ File JSON caricato con successo");
        console.log("[UI] 👤 Paziente:", dati.profilo?.nome);
        console.log("[UI] 📝 Ricordi:", dati.ricordi?.length);
        console.log("[UI] 📊 Sessioni:", dati.storicoSessioni?.length);
        
        alert(`✅ Dati caricati con successo!\n\nPaziente: ${dati.profilo?.nome || "Sconosciuto"}\nRicordi: ${dati.ricordi?.length || 0}\nSessioni: ${dati.storicoSessioni?.length || 0}`);
        
        // Ricarica la pagina per applicare i nuovi dati
        window.location.reload();
      } catch (error) {
        console.error("[UI] ❌ Errore nel parsing del file JSON:", error);
        alert("❌ Errore nel caricamento del file. Assicurati che sia un file JSON valido.");
      }
    };
    reader.readAsText(file);
    
    // Reset input per permettere di caricare lo stesso file di nuovo
    e.target.value = "";
  }, []);

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

  // Vista Test Dati Paziente
  if (vistaCorrente === "test") {
    return (
      <div className="relative">
        <button
          onClick={() => setVistaCorrente("paziente")}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg shadow-lg transition-colors"
        >
          ← Torna alla Home
        </button>
        <TestDatiPaziente />
      </div>
    );
  }

  // Vista Pannello Ricordi
  if (vistaCorrente === "ricordi") {
    return <PannelloRicordi onChiudi={() => setVistaCorrente("paziente")} />;
  }

  // Vista Paziente
  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        ...themeConfig.backgroundStyle,
        transition: 'background 0.4s ease, background-color 0.4s ease, color 0.4s ease',
      }}
    >
      {/* Header fisso */}
      <header className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-sm border-b shadow-sm transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-800/95 border-slate-700' 
          : 'bg-white/95 border-slate-200/60'
      }`}>
        <div className="max-w-7xl mx-auto px-3 py-2 md:px-4 md:py-3 flex items-center justify-between flex-wrap gap-2">
          {/* Logo e titolo a sinistra */}
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-4xl" aria-hidden="true">🧠</span>
            <div>
              <h1 
                className={`text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight`}
                style={{ fontFamily: "'Nunito', 'Quicksand', 'Comic Sans MS', sans-serif" }}
              >
                MenteInGioco
              </h1>
              <p className={`text-[10px] md:text-xs font-medium hidden sm:block transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-500'
              }`}>
                La tua ginnastica mentale quotidiana
              </p>
            </div>
          </div>

          {/* Pulsanti a destra */}
          <div className="flex items-center gap-2">
            {/* Pulsante AI */}
            <button
              onClick={handleGeneraAI}
              disabled={caricamentoAI}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600 hover:text-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-sm font-bold flex items-center justify-center transition-all opacity-60 hover:opacity-100 focus:opacity-100"
              aria-label="Genera esercizio personalizzato AI"
              title="Personalizza con AI"
            >
              {caricamentoAI ? (
                <span className="animate-spin">⚙️</span>
              ) : (
                <span>🤖</span>
              )}
            </button>
            
            {/* Pulsante Carica Dati */}
            <button
              onClick={handleCaricaJSON}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center justify-center transition-all opacity-60 hover:opacity-100 focus:opacity-100"
              aria-label="Carica dati paziente da JSON"
              title="Carica Dati"
            >
              <span>📥</span>
            </button>
            
            {/* Pulsante Test (nascosto) */}
            <button
              onClick={() => setVistaCorrente("test")}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center justify-center transition-all opacity-50 hover:opacity-100 focus:opacity-100"
              aria-label="Test Dati Paziente JSON"
              title="Test Dati JSON"
            >
              🧪
            </button>
            
            {/* Pulsante Caregiver */}
            <button
              onClick={() => setVistaCorrente("caregiver")}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-sm font-bold flex items-center justify-center transition-all opacity-50 hover:opacity-100 focus:opacity-100"
              aria-label="Accedi al Pannello Caregiver"
              title="Pannello Caregiver"
            >
              ⚙️
            </button>
          </div>
          
          {/* Input file nascosto */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </header>

      {/* Spacer per l'header fisso */}
      <div className="h-16 md:h-24"></div>

      {/* ─── SCHERMATA BENVENUTO ─── */}
      {fase === "benvenuto" && (
        <div className="flex-1 flex flex-col items-center justify-start px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-6xl space-y-8">
            
            {/* Categoria 1: Giochi di Parole & Linguaggio */}
            <section>
              <h2 className={`text-xl md:text-2xl font-bold mb-4 transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-50' : 'text-slate-900'
              }`}>
                📝 Giochi di Parole & Linguaggio
              </h2>
              <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <button onClick={handleInizia} className={`p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">📝</div>
                  <div className="text-base md:text-lg font-bold">Quiz</div>
                </button>
                <button onClick={() => setGiocoAttivo("cruciverba")} className={`p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">🧩</div>
                  <div className="text-base md:text-lg font-bold">Cruciverba</div>
                </button>
                <button onClick={() => setGiocoAttivo("proverbi")} className={`p-6 bg-gradient-to-br from-amber-600 to-yellow-700 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">📜</div>
                  <div className="text-base md:text-lg font-bold">Proverbi</div>
                </button>
              </div>
            </section>

            {/* Categoria 2: Memoria & Reminiscenza */}
            <section>
              <h2 className={`text-xl md:text-2xl font-bold mb-4 transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-50' : 'text-slate-900'
              }`}>
                🧠 Memoria & Reminiscenza
              </h2>
              <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <button onClick={() => setGiocoAttivo("memory")} className={`p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">🃏</div>
                  <div className="text-base md:text-lg font-bold">Memory</div>
                </button>
                <button onClick={() => setGiocoAttivo("memory-vita")} className={`p-6 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">📸</div>
                  <div className="text-base md:text-lg font-bold">Memorie</div>
                </button>
                <button onClick={() => setGiocoAttivo("associazioni")} className={`p-6 bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">🔗</div>
                  <div className="text-base md:text-lg font-bold">Associa</div>
                </button>
                <button onClick={() => setGiocoAttivo("canzone")} className={`p-6 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">🎶</div>
                  <div className="text-base md:text-lg font-bold">Canzoni</div>
                </button>
              </div>
            </section>

            {/* Categoria 3: Logica & Osservazione */}
            <section>
              <h2 className={`text-xl md:text-2xl font-bold mb-4 transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-50' : 'text-slate-900'
              }`}>
                👁️ Logica & Osservazione
              </h2>
              <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <button onClick={() => setGiocoAttivo("intruso")} className={`p-6 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">🔍</div>
                  <div className="text-base md:text-lg font-bold">Intruso</div>
                </button>
                <button onClick={() => setGiocoAttivo("ombre")} className={`p-6 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">🌑</div>
                  <div className="text-base md:text-lg font-bold">Ombre</div>
                </button>
                <button onClick={() => setGiocoAttivo("puzzle")} className={`p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">🖼️</div>
                  <div className="text-base md:text-lg font-bold">Puzzle</div>
                </button>
                <button onClick={() => setGiocoAttivo("valigia")} className={`p-6 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">🧳</div>
                  <div className="text-base md:text-lg font-bold">Valigia</div>
                </button>
                <button onClick={() => setGiocoAttivo("orologio")} className={`p-6 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">⏰</div>
                  <div className="text-base md:text-lg font-bold">Orologio</div>
                </button>
                <button onClick={() => setGiocoAttivo("forza4")} className={`p-6 bg-gradient-to-br from-blue-600 to-cyan-700 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">🎯</div>
                  <div className="text-base md:text-lg font-bold">Forza 4</div>
                </button>
                <button onClick={() => setGiocoAttivo("tris")} className={`p-6 bg-gradient-to-br from-purple-600 to-pink-700 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  theme === 'dark' ? 'ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''
                }`}>
                  <div className="text-5xl md:text-6xl mb-2">⭕</div>
                  <div className="text-base md:text-lg font-bold">Tris</div>
                </button>
              </div>
            </section>
          </div>
          
          {/* Footer con selettore temi */}
          {fase === "benvenuto" && (
            <FooterThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          )}
        </div>
      )}

      {/* ─── SCHERMATA DOMANDA ─── */}
      {(fase === "domanda" || fase === "feedback") && domandaCorrente && (
        <div className="flex-1 flex flex-col px-4 py-4 md:px-8 md:py-10 overflow-y-auto">
          {/* Timer e progresso */}
          <div className="max-w-2xl w-full mx-auto mb-4 md:mb-6">
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
          <div className="flex-1 flex flex-col items-center justify-start max-w-2xl w-full mx-auto">
            {/* Testo della domanda con pulsante altoparlante */}
            <div className="w-full flex items-start gap-3 mb-6 md:mb-10">
              <h2
                className={`flex-1 text-2xl md:text-4xl font-bold text-center leading-snug transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
                aria-live="polite"
              >
                {domandaCorrente.testoDomanda}
              </h2>
              <button
                onClick={handleLeggiDomanda}
                disabled={staLeggendo}
                className={`shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-5xl shadow-lg transition-all ${
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
            <div className="w-full space-y-3 md:space-y-4" role="group" aria-label="Opzioni di risposta">
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
                    className={`w-full py-4 px-4 md:py-7 md:px-8 text-lg md:text-2xl font-semibold rounded-2xl shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 ${buttonStyle} ${extraClasses}`}
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
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:px-6 md:py-12 overflow-y-auto">
          <div className="max-w-xl w-full text-center space-y-6 md:space-y-8 my-auto">
            {/* Icona celebrativa ma sobria */}
            <div className="text-6xl md:text-7xl" aria-hidden="true">
              🌟
            </div>

            {/* Messaggio caloroso */}
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight">
              Grazie per aver allenato la tua mente oggi!
            </h2>

            <p className="text-lg md:text-2xl text-slate-600 leading-relaxed">
              Hai fatto un ottimo lavoro.
              <br />
              <span className="text-slate-500">
                Ogni piccolo esercizio è un regalo per il tuo benessere.
              </span>
            </p>

            {/* Messaggio motivazionale */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-6">
              <p className="text-base md:text-lg text-amber-800 font-medium">
                🌻 Torna quando vuoi, saremo felici di allenarci ancora insieme!
              </p>
            </div>

            {/* Pulsante per tornare all'inizio */}
            <button
              onClick={handleTornaAllInizio}
              className="w-full max-w-md mx-auto py-5 px-6 md:py-6 md:px-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xl md:text-3xl font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label="Torna alla schermata iniziale"
            >
              Torna all'inizio 🏠
            </button>
          </div>
        </div>
      )}

      {/* ─── GIOCHI EXTRA ─── */}
      {giocoAttivo === "cruciverba" && (
        <GiocoCruciverba onChiudi={() => setGiocoAttivo(null)} theme={theme} />
      )}

      {giocoAttivo === "puzzle" && (
        <GiocoPuzzle onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "intruso" && (
        <IntrusoLogico onChiudi={() => setGiocoAttivo(null)} theme={theme} />
      )}

      {giocoAttivo === "memory" && (
        <MemorySemplificato onChiudi={() => setGiocoAttivo(null)} theme={theme} />
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

      {giocoAttivo === "memory-vita" && (
        <MemoryVita onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "associazioni" && (
        <AssociazioniTematiche onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "forza4" && (
        <Forza4 onChiudi={() => setGiocoAttivo(null)} />
      )}

      {giocoAttivo === "tris" && (
        <Tris onChiudi={() => setGiocoAttivo(null)} />
      )}
    </div>
  );
}

export default App;
