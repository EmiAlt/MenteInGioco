import { useState } from "react";
import { useDatiPaziente } from "../hooks/useDatiPaziente";

/**
 * Componente di test per dimostrare il funzionamento del sistema JSON
 * 
 * Mostra:
 * - Nome del paziente caricato dal JSON
 * - Profilo completo
 * - Ricordi del paziente
 * - Pulsante per simulare fine partita
 * - Storico delle sessioni
 * - Pulsante per esportare JSON aggiornato
 */
export default function TestDatiPaziente() {
  const {
    dati,
    caricamento,
    errore,
    salvaSessione,
    esportaJSON,
    resettaDati,
  } = useDatiPaziente();

  const [simulazioneInCorso, setSimulazioneInCorso] = useState(false);

  /**
   * Simula la fine di una partita con dati casuali
   */
  const handleSimulaFinePartita = () => {
    if (!dati) return;

    setSimulazioneInCorso(true);

    // Dati casuali per la simulazione
    const punteggio = Math.floor(Math.random() * 100) + 50; // 50-150
    const tempoMedio = Math.floor(Math.random() * 15) + 5; // 5-20 secondi
    const domande = 5;
    const livello = Math.floor(Math.random() * 2) + 1; // 1-2

    console.log("[TEST] 🎮 Simulazione fine partita...");
    console.log("[TEST] 🎯 Punteggio:", punteggio);
    console.log("[TEST] ⏱️ Tempo medio:", tempoMedio + "s");

    // Salva la sessione
    salvaSessione(punteggio, tempoMedio, domande, livello, "Sessione di test simulata");

    setTimeout(() => {
      setSimulazioneInCorso(false);
      console.log("[TEST] ✅ Simulazione completata");
    }, 1000);
  };

  // Stato di caricamento
  if (caricamento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4 animate-pulse">🧠</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Caricamento dati paziente...
          </h2>
          <p className="text-slate-600">
            Sto leggendo il file dati_paziente.json
          </p>
        </div>
      </div>
    );
  }

  // Errore
  if (errore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Errore nel caricamento
          </h2>
          <p className="text-slate-700 mb-4">{errore}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  // Nessun dato
  if (!dati) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-slate-900">
            Nessun dato disponibile
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">🧠</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Test Sistema Dati Paziente
              </h1>
              <p className="text-slate-600 mt-1">
                Dimostrazione del caricamento JSON e gestione storico sessioni
              </p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>📂 File sorgente:</strong> <code className="bg-blue-100 px-2 py-1 rounded">public/dati_paziente.json</code>
            </p>
            <p className="text-sm text-blue-900 mt-1">
              <strong>💾 Cache locale:</strong> <code className="bg-blue-100 px-2 py-1 rounded">localStorage</code>
            </p>
          </div>
        </div>

        {/* Profilo Paziente */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>👤</span>
            Profilo Paziente
          </h2>
          
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 mb-4">
            <div className="text-5xl mb-2">👨‍🦳</div>
            <div className="text-3xl font-bold mb-1">{dati.profilo.nome}</div>
            <div className="text-blue-100">
              Età: {new Date().getFullYear() - dati.profilo.annoNascita} anni
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Ex Mestiere</div>
              <div className="text-lg font-semibold text-slate-900">
                🔨 {dati.profilo.exMestiere}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Livello Iniziale</div>
              <div className="text-lg font-semibold text-slate-900">
                📊 Livello {dati.profilo.livelloIniziale}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 md:col-span-2">
              <div className="text-sm text-slate-600 mb-1">Hobby</div>
              <div className="flex flex-wrap gap-2">
                {dati.profilo.hobby.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ricordi */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>💭</span>
            Ricordi del Paziente ({dati.ricordi.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dati.ricordi.map((ricordo) => (
              <div
                key={ricordo.id}
                className={`rounded-lg p-4 border-2 ${
                  ricordo.emozione === "alta"
                    ? "bg-amber-50 border-amber-200"
                    : ricordo.emozione === "media"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900">{ricordo.titolo}</h3>
                  <span className="text-sm text-slate-600 font-mono">
                    {ricordo.anno}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-2">{ricordo.dettaglio}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Emozione:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      ricordo.emozione === "alta"
                        ? "bg-amber-200 text-amber-800"
                        : ricordo.emozione === "media"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-slate-200 text-slate-800"
                    }`}
                  >
                    {ricordo.emozione === "alta" && "❤️ Alta"}
                    {ricordo.emozione === "media" && "💙 Media"}
                    {ricordo.emozione === "bassa" && "🤍 Bassa"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controlli Test */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>🎮</span>
            Simulazione Partita
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={handleSimulaFinePartita}
              disabled={simulazioneInCorso}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white text-xl font-bold rounded-xl shadow-lg transition-all"
            >
              {simulazioneInCorso ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  Salvataggio in corso...
                </span>
              ) : (
                <span>🎯 Simula Fine Partita</span>
              )}
            </button>

            <p className="text-sm text-slate-600 text-center">
              Questo pulsante simula la fine di una partita e salva i dati nello storico
            </p>
          </div>
        </div>

        {/* Storico Sessioni */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>📊</span>
            Storico Sessioni ({dati.storicoSessioni.length})
          </h2>
          
          {dati.storicoSessioni.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-slate-600">
                Nessuna sessione registrata
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Clicca "Simula Fine Partita" per aggiungere una sessione
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dati.storicoSessioni
                .slice()
                .reverse()
                .map((sessione, idx) => (
                  <div
                    key={sessione.id}
                    className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-slate-900">
                          Sessione #{dati.storicoSessioni.length - idx}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(sessione.data).toLocaleString("it-IT")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {sessione.punteggio}
                        </div>
                        <div className="text-xs text-slate-500">punti</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="bg-white rounded p-2">
                        <div className="text-xs text-slate-600">Tempo medio</div>
                        <div className="font-semibold text-slate-900">
                          {sessione.tempoMedio}s
                        </div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-xs text-slate-600">Domande</div>
                        <div className="font-semibold text-slate-900">
                          {sessione.domandeRispondendo}
                        </div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-xs text-slate-600">Livello</div>
                        <div className="font-semibold text-slate-900">
                          {sessione.livelloRaggiunto}
                        </div>
                      </div>
                    </div>
                    {sessione.note && (
                      <div className="mt-2 text-xs text-slate-600 italic">
                        📝 {sessione.note}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Esportazione JSON */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>💾</span>
            Esportazione Dati
          </h2>
          
          <div className="space-y-3">
            <button
              onClick={esportaJSON}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xl font-bold rounded-xl shadow-lg transition-all"
            >
              📥 Esporta JSON Aggiornato
            </button>
            
            <button
              onClick={() => {
                if (confirm("Sei sicuro di voler resettare tutti i dati? Questa azione non può essere annullata.")) {
                  resettaDati();
                }
              }}
              className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
            >
              🔄 Resetta ai Dati Originali
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>💡 Suggerimento:</strong> L'esportazione JSON scarica un file con tutti i dati aggiornati, inclusi profilo, ricordi e storico sessioni.
              </p>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-lg p-6 font-mono text-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🔍</span>
            Console Log (Apri F12 per i dettagli)
          </h2>
          <div className="space-y-2 text-xs">
            <div>✅ File JSON caricato: <code className="bg-slate-800 px-2 py-1 rounded">public/dati_paziente.json</code></div>
            <div>✅ Stato React inizializzato con i dati</div>
            <div>✅ Cache localStorage attiva</div>
            <div>✅ Funzione salvaSessione() disponibile</div>
            <div>✅ Funzione esportaJSON() disponibile</div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="text-slate-400">Dimensione dati: {JSON.stringify(dati).length} bytes</div>
              <div className="text-slate-400">Sessioni salvate: {dati.storicoSessioni.length}</div>
              <div className="text-slate-400">Ricordi caricati: {dati.ricordi.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
