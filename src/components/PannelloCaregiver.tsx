import { useState, useMemo } from "react";
import { useProfiloPaziente } from "../hooks/useProfiloPaziente";
import { useCronologiaSessioni, SessioneSalvata } from "../hooks/useCronologiaSessioni";
import { useImpostazioniSessione } from "../hooks/useImpostazioniSessione";
import { useDatiPaziente } from "../hooks/useDatiPaziente";
import { useTTSSettings } from "../hooks/useTextToSpeech";
import ImportaDomande from "./ImportaDomande";
import PersonalizzaAttività from "./PersonalizzaAttività";
import ReportMedico from "./ReportMedico";
import { Domanda } from "../data/questions";

type TabAttiva = "profilo" | "statistiche" | "domande" | "impostazioni";

interface PannelloCaregiverProps {
  onTornaAlGioco: () => void;
}

export default function PannelloCaregiver({ onTornaAlGioco }: PannelloCaregiverProps) {
  const [profilo, setProfilo] = useProfiloPaziente();
  const [sessioni, aggiungiSessione, cancellaSessioni] = useCronologiaSessioni();
  const [impostazioni, setImpostazioni] = useImpostazioniSessione();
  const { dati: datiJSON, esportaJSON } = useDatiPaziente();
  const [tabAttiva, setTabAttiva] = useState<TabAttiva>("profilo");

  // Stato form profilo
  const [formNome, setFormNome] = useState(profilo.nome);
  const [formAnnoNascita, setFormAnnoNascita] = useState(profilo.annoNascita.toString());
  const [formMestiere, setFormMestiere] = useState(profilo.exMestiere);
  const [formHobby, setFormHobby] = useState(profilo.hobby.join(", "));
  const [salvato, setSalvato] = useState(false);

  // Stato form impostazioni
  const [formNumeroDomande, setFormNumeroDomande] = useState(impostazioni.numeroDomande.toString());
  const [impostazioniSalvate, setImpostazioniSalvate] = useState(false);

  // Stato per configurazione Memory
  const [formNumeroCoppieMemory, setFormNumeroCoppieMemory] = useState(() => {
    const salvato = localStorage.getItem("memory_numero_coppie");
    return salvato ? parseInt(salvato) : 3;
  });
  const [memorySalvato, setMemorySalvato] = useState(false);

  // Stato per personalizzazione attività
  const [mostraPersonalizza, setMostraPersonalizza] = useState(false);

  // Stato per report medico
  const [mostraReportMedico, setMostraReportMedico] = useState(false);

  // Stato per sintesi vocale
  const { ttsEnabled, setTtsEnabled } = useTTSSettings();

  // Stato per livello difficoltà
  const [livelloDifficolta, setLivelloDifficolta] = useState(() => {
    const salvato = localStorage.getItem("livello_difficolta");
    return salvato || "medio";
  });

  const handleSalvaLivelloDifficolta = (livello: string) => {
    setLivelloDifficolta(livello);
    localStorage.setItem("livello_difficolta", livello);
  };

  // Salva profilo
  const handleSalvaProfilo = (e: React.FormEvent) => {
    e.preventDefault();
    setProfilo({
      nome: formNome.trim(),
      annoNascita: parseInt(formAnnoNascita) || 1950,
      exMestiere: formMestiere.trim(),
      hobby: formHobby.split(",").map((h) => h.trim()).filter((h) => h.length > 0),
    });
    setSalvato(true);
    setTimeout(() => setSalvato(false), 2000);
  };

  // Salva impostazioni
  const handleSalvaImpostazioni = (e: React.FormEvent) => {
    e.preventDefault();
    const numeroDomande = parseInt(formNumeroDomande);
    if (numeroDomande >= 1 && numeroDomande <= 50) {
      setImpostazioni({
        ...impostazioni,
        numeroDomande: numeroDomande,
      });
      setImpostazioniSalvate(true);
      setTimeout(() => setImpostazioniSalvate(false), 2000);
    }
  };

  // Salva configurazione Memory
  const handleSalvaMemory = (e: React.FormEvent) => {
    e.preventDefault();
    const numeroCoppie = parseInt(formNumeroCoppieMemory.toString());
    if (numeroCoppie >= 2 && numeroCoppie <= 6) {
      localStorage.setItem("memory_numero_coppie", numeroCoppie.toString());
      setMemorySalvato(true);
      setTimeout(() => setMemorySalvato(false), 2000);
    }
  };

  // Handler per domande importate
  const handleDomandeImportate = (domande: Domanda[]) => {
    console.log(`[PANNELLO CAREGIVER] ${domande.length} domande importate dal caregiver`);
    // Le domande sono già salvate nel localStorage dal componente ImportaDomande
  };

  // Calcola statistiche
  const statistiche = useMemo(() => {
    if (sessioni.length === 0) {
      return {
        totaleSessioni: 0,
        tempoMedioReazione: 0,
        categorieMigliori: [],
        sessioniRecenti: [],
      };
    }

    // Tempo medio di reazione
    const tuttiTempi = sessioni.flatMap((s) =>
      s.cronologia.map((c) => c.tempoReazione)
    );
    const tempoMedioReazione =
      tuttiTempi.length > 0
        ? Math.round(tuttiTempi.reduce((a, b) => a + b, 0) / tuttiTempi.length)
        : 0;

    // Categorie con migliori performance
    const categorieStats: Record<string, { corrette: number; totali: number }> = {};
    sessioni.forEach((sessione) => {
      sessione.cronologia.forEach((entry) => {
        if (!categorieStats[entry.categoria]) {
          categorieStats[entry.categoria] = { corrette: 0, totali: 0 };
        }
        categorieStats[entry.categoria].totali++;
        if (entry.corretta) {
          categorieStats[entry.categoria].corrette++;
        }
      });
    });

    const categorieMigliori = Object.entries(categorieStats)
      .map(([categoria, stats]) => ({
        categoria,
        percentuale: Math.round((stats.corrette / stats.totali) * 100),
        corrette: stats.corrette,
        totali: stats.totali,
      }))
      .sort((a, b) => b.percentuale - a.percentuale);

    return {
      totaleSessioni: sessioni.length,
      tempoMedioReazione,
      categorieMigliori,
      sessioniRecenti: sessioni.slice(0, 5),
    };
  }, [sessioni]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header con branding MenteInGioco */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e titolo */}
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden="true">🧠</span>
              <div>
                <h1 
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                  style={{ fontFamily: "'Nunito', 'Quicksand', 'Comic Sans MS', sans-serif" }}
                >
                  MenteInGioco
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Pannello Caregiver
                </p>
              </div>
            </div>
            <button
              onClick={onTornaAlGioco}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              ← Torna al Gioco
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setTabAttiva("profilo")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                tabAttiva === "profilo"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              👤 Profilo Paziente
            </button>
            <button
              onClick={() => setTabAttiva("statistiche")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                tabAttiva === "statistiche"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              📊 Statistiche
            </button>
            <button
              onClick={() => setTabAttiva("domande")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                tabAttiva === "domande"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              📝 Importa Domande
            </button>
            <button
              onClick={() => setTabAttiva("impostazioni")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                tabAttiva === "impostazioni"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              ⚙️ Impostazioni
            </button>
          </nav>
        </div>
      </div>

      {/* Contenuto principale */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab: Profilo */}
        {tabAttiva === "profilo" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonna sinistra: Profilo Paziente */}
          <div className="space-y-6">
            {/* Card Profilo */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>👤</span>
                  Profilo Paziente
                </h2>
              </div>

              <form onSubmit={handleSalvaProfilo} className="p-6 space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Es. Mario"
                  />
                </div>

                {/* Anno di nascita */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Anno di nascita
                  </label>
                  <input
                    type="number"
                    value={formAnnoNascita}
                    onChange={(e) => setFormAnnoNascita(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Es. 1950"
                    min="1900"
                    max="2020"
                  />
                </div>

                {/* Ex mestiere */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ex mestiere
                  </label>
                  <input
                    type="text"
                    value={formMestiere}
                    onChange={(e) => setFormMestiere(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Es. Falegname"
                  />
                </div>

                {/* Hobby */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Hobby (separati da virgola)
                  </label>
                  <input
                    type="text"
                    value={formHobby}
                    onChange={(e) => setFormHobby(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Es. Inter, Orto, Lettura"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Separa gli hobby con una virgola
                  </p>
                </div>

                {/* Pulsante salva */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {salvato ? (
                    <>
                      <span>✓</span>
                      <span>Profilo Salvato!</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Salva Profilo</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Card Info AI */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
              <h3 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <span>🤖</span>
                Esercizi Personalizzati AI
              </h3>
              <p className="text-sm text-purple-800 mb-3">
                Il profilo del paziente viene utilizzato per generare domande
                personalizzate basate sui suoi ricordi e interessi.
              </p>
              <div className="bg-white/60 rounded-lg p-3 text-xs text-purple-700 space-y-1">
                <p>
                  <strong>Nome:</strong> {profilo.nome}
                </p>
                <p>
                  <strong>Età:</strong>{" "}
                  {new Date().getFullYear() - profilo.annoNascita} anni
                </p>
                <p>
                  <strong>Mestiere:</strong> {profilo.exMestiere}
                </p>
                <p>
                  <strong>Hobby:</strong> {profilo.hobby.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Tab: Statistiche */}
        {tabAttiva === "statistiche" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card Statistiche Generali */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>📊</span>
                  Statistiche Sessioni
                </h2>
              </div>

              <div className="p-6">
                {statistiche.totaleSessioni === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📝</div>
                    <p className="text-slate-500 text-sm">
                      Nessuna sessione completata
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Le statistiche appariranno dopo la prima sessione
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Stats cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="text-2xl font-bold text-blue-900">
                          {statistiche.totaleSessioni}
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          Sessioni totali
                        </div>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                        <div className="text-2xl font-bold text-emerald-900">
                          {statistiche.tempoMedioReazione}s
                        </div>
                        <div className="text-xs text-emerald-700 mt-1">
                          Tempo medio reazione
                        </div>
                      </div>
                    </div>

                    {/* Categorie migliori */}
                    {statistiche.categorieMigliori.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">
                          Performance per Categoria
                        </h3>
                        <div className="space-y-3">
                          {statistiche.categorieMigliori.slice(0, 5).map((cat) => (
                            <div key={cat.categoria}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-slate-700 capitalize">
                                  {cat.categoria}
                                </span>
                                <span className="text-sm font-bold text-slate-900">
                                  {cat.percentuale}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    cat.percentuale >= 80
                                      ? "bg-emerald-500"
                                      : cat.percentuale >= 60
                                      ? "bg-blue-500"
                                      : cat.percentuale >= 40
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${cat.percentuale}%` }}
                                />
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {cat.corrette} corrette su {cat.totali}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Card Sessioni Recenti */}
            {statistiche.sessioniRecenti.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-800">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span>📋</span>
                    Sessioni Recenti
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {statistiche.sessioniRecenti.map((sessione) => (
                      <SessioneCard key={sessione.id} sessione={sessione} />
                    ))}
                  </div>

                  {sessioni.length > 5 && (
                    <button
                      onClick={cancellaSessioni}
                      className="w-full mt-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      🗑️ Cancella tutta la cronologia
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Card Report Medico */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>📋</span>
                  Report per il Medico
                </h2>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-4">
                  Genera un report professionale degli ultimi 7 giorni di attività cognitiva, pronto per essere stampato e condiviso con il medico curante.
                </p>
                <button
                  onClick={() => setMostraReportMedico(true)}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>📊</span>
                  <span>Genera Report per il Medico</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Report Medico */}
        {mostraReportMedico && (
          <ReportMedico onChiudi={() => setMostraReportMedico(false)} />
        )}

        {/* Tab: Importa Domande */}
        {tabAttiva === "domande" && (
          <div className="max-w-3xl mx-auto">
            <ImportaDomande onDomandeImportate={handleDomandeImportate} />
          </div>
        )}

        {/* Tab: Impostazioni */}
        {tabAttiva === "impostazioni" && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Card Impostazioni Sessione */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>⚙️</span>
                  Impostazioni Sessione
                </h2>
              </div>

              <form onSubmit={handleSalvaImpostazioni} className="p-6 space-y-6">
                {/* Numero di domande */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Numero di domande per sessione
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={formNumeroDomande}
                      onChange={(e) => setFormNumeroDomande(e.target.value)}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                    />
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-cyan-600">
                        {formNumeroDomande}
                      </span>
                      <span className="text-sm text-slate-500 ml-1">
                        {parseInt(formNumeroDomande) === 1 ? "domanda" : "domande"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Imposta quante domande il paziente dovrà affrontare in ogni sessione di gioco.
                    Un numero maggiore permette un allenamento più lungo, ma potrebbe stancare il paziente.
                  </p>
                </div>

                {/* Preset rapidi */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preset rapidi
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[3, 5, 7, 10, 15].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormNumeroDomande(num.toString())}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          parseInt(formNumeroDomande) === num
                            ? "bg-cyan-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {num} {num === 1 ? "domanda" : "domande"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info sessione */}
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-cyan-900 mb-2">
                    💡 Suggerimento
                  </h4>
                  <p className="text-sm text-cyan-800">
                    Per pazienti con decadimento cognitivo lieve, si consigliano sessioni da{" "}
                    <strong>5-7 domande</strong>. Per pazienti più fragili o stanchi,{" "}
                    <strong>3 domande</strong> possono essere sufficienti.
                  </p>
                </div>

                {/* Pulsante salva */}
                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {impostazioniSalvate ? (
                    <>
                      <span>✓</span>
                      <span>Impostazioni Salvate!</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Salva Impostazioni</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Card Configurazione Memory */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>🧠</span>
                  Configurazione Memory
                </h2>
              </div>

              <form onSubmit={handleSalvaMemory} className="p-6 space-y-6">
                {/* Numero di coppie */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Numero di coppie nel Memory
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={formNumeroCoppieMemory}
                      onChange={(e) => setFormNumeroCoppieMemory(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-emerald-600">
                        {formNumeroCoppieMemory}
                      </span>
                      <span className="text-sm text-slate-500 ml-1">
                        {formNumeroCoppieMemory === 1 ? "coppia" : "coppie"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Il Memory avrà {formNumeroCoppieMemory * 2} carte totali ({formNumeroCoppieMemory} coppie da trovare).
                  </p>
                </div>

                {/* Preset rapidi */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preset rapidi
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormNumeroCoppieMemory(num)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formNumeroCoppieMemory === num
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {num} {num === 1 ? "coppia" : "coppie"} ({num * 2} carte)
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info sessione */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-emerald-900 mb-2">
                    💡 Suggerimento
                  </h4>
                  <p className="text-sm text-emerald-800">
                    Per pazienti con difficoltà cognitive, si consigliano <strong>2-3 coppie</strong> (4-6 carte).
                    Per pazienti con buone capacità, si possono usare <strong>4-6 coppie</strong> (8-12 carte).
                  </p>
                </div>

                {/* Pulsante salva */}
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {memorySalvato ? (
                    <>
                      <span>✓</span>
                      <span>Configurazione Salvata!</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Salva Configurazione Memory</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Card Info Attuali */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span>📊</span>
                Configurazione Attuale
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Numero domande:</span>
                  <span className="font-semibold text-slate-900">
                    {impostazioni.numeroDomande}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Durata feedback:</span>
                  <span className="font-semibold text-slate-900">
                    {(impostazioni.durataFeedbackMs / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Memory - Coppie:</span>
                  <span className="font-semibold text-slate-900">
                    {formNumeroCoppieMemory} ({formNumeroCoppieMemory * 2} carte)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Sintesi vocale:</span>
                  <span className="font-semibold text-slate-900">
                    {ttsEnabled ? '✅ Attiva' : '⏸️ Disattivata'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Livello difficoltà:</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {livelloDifficolta}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Personalizza Attività */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>✏️</span>
                  Personalizza Attività
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Personalizza i contenuti di alcune attività per renderle più significative per il paziente.
                </p>
                <button
                  onClick={() => setMostraPersonalizza(true)}
                  className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>✏️</span>
                  <span>Personalizza Attività</span>
                </button>
              </div>
            </div>

            {/* Card Esporta JSON Aggiornato */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>💾</span>
                  Esporta Dati Paziente (JSON)
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Esporta tutti i dati del paziente (profilo, ricordi e storico sessioni) in un file JSON scaricabile.
                  Utile per backup o condivisione con altri sistemi.
                </p>
                
                {datiJSON && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <div className="text-xs text-indigo-900 space-y-1">
                      <div>👤 Paziente: <strong>{datiJSON.profilo.nome}</strong></div>
                      <div>💭 Ricordi: <strong>{datiJSON.ricordi.length}</strong></div>
                      <div>📊 Sessioni: <strong>{datiJSON.storicoSessioni.length}</strong></div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={esportaJSON}
                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>📥</span>
                  <span>Esporta JSON Aggiornato</span>
                </button>
              </div>
            </div>

            {/* Card Sintesi Vocale */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>🔊</span>
                  Sintesi Vocale (Text-to-Speech)
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Attiva o disattiva la lettura automatica delle istruzioni e dei testi dei giochi.
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Lettura vocale automatica
                  </span>
                  <button
                    onClick={() => setTtsEnabled(!ttsEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      ttsEnabled ? 'bg-violet-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        ttsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className={`p-3 rounded-lg ${ttsEnabled ? 'bg-violet-50 border border-violet-200' : 'bg-slate-50 border border-slate-200'}`}>
                  <p className={`text-sm ${ttsEnabled ? 'text-violet-800' : 'text-slate-600'}`}>
                    {ttsEnabled 
                      ? '✅ La sintesi vocale è attiva. I testi dei giochi verranno letti automaticamente.'
                      : '⏸️ La sintesi vocale è disattivata. I testi non verranno letti.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Card Livello Difficoltà */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>🎚️</span>
                  Livello di Difficoltà Globale
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Imposta il livello di difficoltà generale per tutti i giochi. Questo influenzerà il numero di opzioni e la complessità degli esercizi.
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleSalvaLivelloDifficolta('facile')}
                    className={`p-4 rounded-lg font-semibold transition-all ${
                      livelloDifficolta === 'facile'
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">🌱</div>
                    <div className="text-sm">Facile</div>
                    <div className="text-xs mt-1 opacity-80">2 opzioni</div>
                  </button>
                  <button
                    onClick={() => handleSalvaLivelloDifficolta('medio')}
                    className={`p-4 rounded-lg font-semibold transition-all ${
                      livelloDifficolta === 'medio'
                        ? 'bg-amber-500 text-white shadow-lg scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-sm">Medio</div>
                    <div className="text-xs mt-1 opacity-80">3 opzioni</div>
                  </button>
                  <button
                    onClick={() => handleSalvaLivelloDifficolta('difficile')}
                    className={`p-4 rounded-lg font-semibold transition-all ${
                      livelloDifficolta === 'difficile'
                        ? 'bg-red-500 text-white shadow-lg scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="text-sm">Difficile</div>
                    <div className="text-xs mt-1 opacity-80">4 opzioni</div>
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Suggerimento
                  </h4>
                  <p className="text-sm text-amber-800">
                    <strong>Facile:</strong> Ideale per pazienti con decadimento cognitivo moderato o all'inizio del percorso.
                    <br />
                    <strong>Medio:</strong> Adatto per la maggior parte dei pazienti con decadimento lieve.
                    <br />
                    <strong>Difficile:</strong> Per pazienti con buone capacità cognitive residue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Personalizza Attività */}
        {mostraPersonalizza && (
          <PersonalizzaAttività onChiudi={() => setMostraPersonalizza(false)} />
        )}
      </main>
    </div>
  );
}

// Componente per singola sessione
function SessioneCard({ sessione }: { sessione: SessioneSalvata }) {
  const data = new Date(sessione.data);
  const dataFormattata = data.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const corrette = sessione.cronologia.filter((c) => c.corretta).length;
  const percentuale = Math.round((corrette / sessione.domandeRispondendo) * 100);

  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-sm font-medium text-slate-900">{dataFormattata}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            {sessione.domandeRispondendo} domande • {sessione.durata}s
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-900">{sessione.punteggioFinale}</div>
          <div className="text-xs text-slate-500">punti</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              percentuale >= 80
                ? "bg-emerald-500"
                : percentuale >= 60
                ? "bg-blue-500"
                : "bg-amber-500"
            }`}
            style={{ width: `${percentuale}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-700">{percentuale}%</span>
      </div>

      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
        <span>Livello max: {sessione.livelloMaxRaggiunto}</span>
        <span>•</span>
        <span>
          {corrette}/{sessione.domandeRispondendo} corrette
        </span>
      </div>
    </div>
  );
}
