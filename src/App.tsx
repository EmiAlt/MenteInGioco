import { useState } from "react";
import { useCognitiveSession } from "./hooks/useCognitiveSession";
import { domande } from "./data/questions";

function App() {
  const {
    punteggioInvisibile,
    livelloDifficoltaAttuale,
    domandaCorrente,
    indiceDomandaCorrente,
    tempoDiReazione,
    sessioneAttiva,
    sessioneCompletata,
    risposteConsecutiveCorrette,
    cronologiaRisposte,
    avviaSessione,
    rispondi,
    terminaSessione,
  } = useCognitiveSession();

  const [mostraLogica, setMostraLogica] = useState(false);
  const [mostraDomande, setMostraDomande] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-4 md:p-8">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🧠 Stimolazione Cognitiva
        </h1>
        <p className="text-slate-400 mt-2">
          Sistema adattivo con logica di difficoltà progressiva
        </p>
      </header>

      {/* Pannello di Controllo */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonna Sinistra - Stato Sessione */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5">
            <h2 className="text-lg font-semibold text-emerald-400 mb-4">
              📊 Stato Sessione
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Sessione</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    sessioneAttiva
                      ? "bg-emerald-500/20 text-emerald-400"
                      : sessioneCompletata
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-slate-600/40 text-slate-400"
                  }`}
                >
                  {sessioneAttiva
                    ? "Attiva"
                    : sessioneCompletata
                    ? "Completata"
                    : "Inattiva"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">
                  Punteggio (invisibile)
                </span>
                <span className="text-cyan-400 font-mono font-bold">
                  {punteggioInvisibile}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">
                  Livello difficoltà
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    livelloDifficoltaAttuale === 2
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {livelloDifficoltaAttuale === 1 ? "1 - Facile" : "2 - Medio"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Domanda n°</span>
                <span className="text-white font-mono">
                  {indiceDomandaCorrente}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">
                  Consecutive corrette
                </span>
                <span className="text-white font-mono">
                  {risposteConsecutiveCorrette}/2
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">
                  Tempo reazione
                </span>
                <span
                  className={`font-mono font-bold ${
                    tempoDiReazione > 15
                      ? "text-red-400"
                      : tempoDiReazione > 8
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {tempoDiReazione}s
                </span>
              </div>
            </div>

            {/* Progress bar consecutive */}
            <div className="mt-4">
              <div className="flex gap-1">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      i < risposteConsecutiveCorrette
                        ? "bg-emerald-400"
                        : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Progresso verso livello successivo
              </p>
            </div>
          </div>

          {/* Controlli */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">
              🎮 Controlli
            </h2>
            <div className="space-y-3">
              {!sessioneAttiva && (
                <button
                  onClick={avviaSessione}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/20"
                >
                  ▶ Avvia Nuova Sessione
                </button>
              )}
              {sessioneAttiva && (
                <button
                  onClick={terminaSessione}
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 rounded-lg font-semibold transition-all shadow-lg shadow-red-500/20"
                >
                  ■ Termina Sessione
                </button>
              )}
            </div>
          </div>

          {/* Toggle visualizzazione */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5">
            <h2 className="text-lg font-semibold text-purple-400 mb-4">
              🔍 Debug
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => setMostraLogica(!mostraLogica)}
                className="w-full py-2 px-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm transition-all text-left"
              >
                {mostraLogica ? "▼" : "▶"} Logica Adattiva
              </button>
              <button
                onClick={() => setMostraDomande(!mostraDomande)}
                className="w-full py-2 px-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm transition-all text-left"
              >
                {mostraDomande ? "▼" : "▶"} Database Domande ({domande.length})
              </button>
            </div>
          </div>
        </div>

        {/* Colonna Destra - Area Domanda */}
        <div className="lg:col-span-2 space-y-4">
          {/* Area Domanda Corrente */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
            {sessioneAttiva && domandaCorrente ? (
              <div>
                {/* Meta info */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs font-medium">
                    {domandaCorrente.categoria}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      domandaCorrente.livelloDifficolta === 2
                        ? "bg-orange-500/20 text-orange-300"
                        : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    Liv. {domandaCorrente.livelloDifficolta}
                  </span>
                  <span className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded text-xs font-mono">
                    ID: {domandaCorrente.id}
                  </span>
                </div>

                {/* Domanda */}
                <h3 className="text-xl md:text-2xl font-semibold mb-6 text-white leading-relaxed">
                  {domandaCorrente.testoDomanda}
                </h3>

                {/* Opzioni */}
                <div className="space-y-3">
                  {domandaCorrente.opzioni.map((opzione, idx) => (
                    <button
                      key={idx}
                      onClick={() => rispondi(idx)}
                      className="w-full text-left p-4 bg-slate-700/40 hover:bg-slate-600/60 border border-slate-600/50 hover:border-cyan-500/50 rounded-lg transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-600/60 group-hover:bg-cyan-500/30 text-sm font-bold transition-all">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-slate-200 group-hover:text-white transition-colors">
                          {opzione}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Timer visivo */}
                <div className="mt-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-400 text-sm">
                    Tempo trascorso: {tempoDiReazione}s
                  </span>
                </div>
              </div>
            ) : sessioneCompletata ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                  Sessione Completata!
                </h3>
                <p className="text-slate-400 mb-4">
                  Punteggio finale:{" "}
                  <span className="text-cyan-400 font-bold">
                    {punteggioInvisibile}
                  </span>
                </p>
                <p className="text-slate-500 text-sm">
                  Domande rispondendo: {indiceDomandaCorrente - 1} | Livello
                  massimo raggiunto: {livelloDifficoltaAttuale}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🧩</div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  Pronto per iniziare?
                </h3>
                <p className="text-slate-500">
                  Premi "Avvia Nuova Sessione" per cominciare
                </p>
              </div>
            )}
          </div>

          {/* Logica Adattiva - Dettagli */}
          {mostraLogica && (
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">
                📐 Logica Adattiva Implementata
              </h3>
              <div className="space-y-4 text-sm">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <p className="text-emerald-400 font-semibold mb-1">
                    ⬆️ Promozione di livello
                  </p>
                  <p className="text-slate-300">
                    Se l'utente risponde correttamente a{" "}
                    <strong>2 domande consecutive</strong> dello stesso livello
                    → il livello aumenta di 1 (max livello 2).
                  </p>
                  <p className="text-slate-500 mt-1 font-mono text-xs">
                    if (consecutiveCorrette &gt;= 2 && livello &lt; 2) → livello++
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 font-semibold mb-1">
                    ⬇️ Retrocessione di livello
                  </p>
                  <p className="text-slate-300">
                    Se l'utente <strong>sbaglia una domanda</strong> → il livello
                    torna automaticamente a 1 per evitare frustrazione.
                  </p>
                  <p className="text-slate-500 mt-1 font-mono text-xs">
                    if (!corretta) → livello = 1
                  </p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                  <p className="text-cyan-400 font-semibold mb-1">
                    💰 Punteggio invisibile
                  </p>
                  <p className="text-slate-300">
                    Ogni risposta corretta dà{" "}
                    <strong>10 punti base + bonus velocità</strong> (max 10
                    bonus). Il punteggio NON è mostrato all'utente per evitare
                    ansia da prestazione.
                  </p>
                  <p className="text-slate-500 mt-1 font-mono text-xs">
                    punti = 10 + max(0, 10 - tempoReazione)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cronologia Risposte */}
          {cronologiaRisposte.length > 0 && (
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-4">
                📋 Cronologia Risposte
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left py-2 px-2">#</th>
                      <th className="text-left py-2 px-2">Esito</th>
                      <th className="text-left py-2 px-2">Categoria</th>
                      <th className="text-left py-2 px-2">Livello</th>
                      <th className="text-left py-2 px-2">Tempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cronologiaRisposte.map((entry, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-700/50"
                      >
                        <td className="py-2 px-2 font-mono text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2">
                          {entry.corretta ? (
                            <span className="text-emerald-400">✅</span>
                          ) : (
                            <span className="text-red-400">❌</span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-slate-300">
                          {entry.categoria}
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs ${
                              entry.livello === 2
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {entry.livello}
                          </span>
                        </td>
                        <td className="py-2 px-2 font-mono text-slate-400">
                          {entry.tempoReazione}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Database Domande */}
          {mostraDomande && (
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">
                📦 Database Domande ({domande.length} totali)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {domande.map((d) => (
                  <div
                    key={d.id}
                    className="bg-slate-700/30 rounded-lg p-3 border border-slate-700/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-500">
                        {d.id}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${
                          d.livelloDifficolta === 2
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        L{d.livelloDifficolta}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 truncate">
                      {d.testoDomanda}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      [{d.categoria}] → Risposta: {d.opzioni[d.rispostaCorretta]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-12 text-center text-slate-600 text-sm">
        <p>
          Apri la console del browser (F12) per vedere i log dettagliati della
          logica adattiva
        </p>
      </footer>
    </div>
  );
}

export default App;
