import { useState, useMemo } from "react";
import { useProfiloPaziente } from "../hooks/useProfiloPaziente";
import { useCronologiaSessioni, SessioneSalvata } from "../hooks/useCronologiaSessioni";

interface PannelloCaregiverProps {
  onTornaAlGioco: () => void;
}

export default function PannelloCaregiver({ onTornaAlGioco }: PannelloCaregiverProps) {
  const [profilo, setProfilo] = useProfiloPaziente();
  const [sessioni, aggiungiSessione, cancellaSessioni] = useCronologiaSessioni();

  // Stato form
  const [formNome, setFormNome] = useState(profilo.nome);
  const [formAnnoNascita, setFormAnnoNascita] = useState(profilo.annoNascita.toString());
  const [formMestiere, setFormMestiere] = useState(profilo.exMestiere);
  const [formHobby, setFormHobby] = useState(profilo.hobby.join(", "));
  const [salvato, setSalvato] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Pannello Caregiver
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Gestione profilo paziente e statistiche
              </p>
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

      {/* Contenuto principale */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {/* Colonna destra: Statistiche */}
          <div className="space-y-6">
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
          </div>
        </div>
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
