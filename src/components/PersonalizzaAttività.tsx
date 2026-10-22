import { useState, useEffect } from "react";

type AttivitàTipo = "intruso" | "canzoni" | "orologio" | "valigia";

interface PersonalizzaAttivitàProps {
  onChiudi: () => void;
}

export default function PersonalizzaAttività({ onChiudi }: PersonalizzaAttivitàProps) {
  const [attivitàSelezionata, setAttivitàSelezionata] = useState<AttivitàTipo | null>(null);

  if (!attivitàSelezionata) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex flex-col z-50">
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">✏️ Personalizza Attività</h2>
            <button
              onClick={onChiudi}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg"
            >
              ← Chiudi
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full space-y-6">
            <p className="text-xl text-slate-700 text-center mb-8">
              Seleziona l'attività che vuoi personalizzare:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setAttivitàSelezionata("intruso")}
                className="p-6 bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl shadow-lg transition-all"
              >
                <div className="text-5xl mb-3">🔍</div>
                <div className="text-xl font-bold mb-2">Intruso Logico</div>
                <div className="text-sm opacity-90">
                  Personalizza categorie e elementi
                </div>
              </button>

              <button
                onClick={() => setAttivitàSelezionata("canzoni")}
                className="p-6 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all"
              >
                <div className="text-5xl mb-3">🎶</div>
                <div className="text-xl font-bold mb-2">Completa Canzone</div>
                <div className="text-sm opacity-90">
                  Aggiungi canzoni personalizzate
                </div>
              </button>

              <button
                onClick={() => setAttivitàSelezionata("orologio")}
                className="p-6 bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all"
              >
                <div className="text-5xl mb-3">⏰</div>
                <div className="text-xl font-bold mb-2">Orologio</div>
                <div className="text-sm opacity-90">
                  Personalizza orari e periodi
                </div>
              </button>

              <button
                onClick={() => setAttivitàSelezionata("valigia")}
                className="p-6 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all"
              >
                <div className="text-5xl mb-3">🧳</div>
                <div className="text-xl font-bold mb-2">Valigia / Spesa</div>
                <div className="text-sm opacity-90">
                  Crea scenari personalizzati
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EditorAttività
      tipo={attivitàSelezionata}
      onIndietro={() => setAttivitàSelezionata(null)}
      onChiudi={onChiudi}
    />
  );
}

interface EditorAttivitàProps {
  tipo: AttivitàTipo;
  onIndietro: () => void;
  onChiudi: () => void;
}

function EditorAttività({ tipo, onIndietro, onChiudi }: EditorAttivitàProps) {
  const [rounds, setRounds] = useState<any[]>([]);
  const [salvato, setSalvato] = useState(false);

  useEffect(() => {
    const chiave = `${tipo}_custom_rounds`;
    const salvati = localStorage.getItem(chiave);
    if (salvati) {
      try {
        setRounds(JSON.parse(salvati));
      } catch (e) {
        console.error("Errore nel caricare rounds:", e);
      }
    }
  }, [tipo]);

  const salva = () => {
    const chiave = `${tipo}_custom_rounds`;
    localStorage.setItem(chiave, JSON.stringify(rounds));
    setSalvato(true);
    setTimeout(() => setSalvato(false), 2000);
  };

  const resetta = () => {
    if (confirm("Sei sicuro di voler resettare ai valori predefiniti?")) {
      const chiave = `${tipo}_custom_rounds`;
      localStorage.removeItem(chiave);
      setRounds([]);
    }
  };

  const titoli: Record<AttivitàTipo, string> = {
    intruso: "🔍 Intruso Logico",
    canzoni: "🎶 Completa Canzone",
    orologio: "⏰ Orologio",
    valigia: "🧳 Valigia / Spesa",
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50">
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">{titoli[tipo]}</h2>
          <button
            onClick={onIndietro}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg"
          >
            ← Indietro
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Istruzioni</h3>
            <p className="text-sm text-blue-800">
              {tipo === "intruso" && "Crea round con 4 elementi: 3 della stessa categoria e 1 intruso. Gli elementi devono avere testo ed emoji."}
              {tipo === "canzoni" && "Crea round con titolo, artista, anno, frase iniziale e 3 opzioni (una corretta)."}
              {tipo === "orologio" && "Crea round con ore, minuti, periodo del giorno e 3 opzioni (una corretta)."}
              {tipo === "valigia" && "Crea scenari con titolo, emoji, contesto e 6 oggetti (alcuni corretti, altri no)."}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <textarea
              value={JSON.stringify(rounds, null, 2)}
              onChange={(e) => {
                try {
                  setRounds(JSON.parse(e.target.value));
                } catch (err) {
                  // Ignora errori di parsing durante la digitazione
                }
              }}
              className="w-full h-96 font-mono text-sm p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Inserisci qui i rounds in formato JSON..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={salva}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              {salvato ? "✓ Salvato!" : "💾 Salva Personalizzazioni"}
            </button>
            <button
              onClick={resetta}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
            >
              🔄 Resetta
            </button>
            <button
              onClick={onChiudi}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
            >
              ← Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
