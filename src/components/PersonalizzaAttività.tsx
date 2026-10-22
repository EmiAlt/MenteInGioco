import { useState, useEffect } from "react";
import EmojiPicker from "./EmojiPicker";

type AttivitàTipo = "intruso" | "canzoni" | "orologio" | "valigia" | "associazioni";

interface PersonalizzaAttivitàProps {
  onChiudi: () => void;
}

export default function PersonalizzaAttività({ onChiudi }: PersonalizzaAttivitàProps) {
  const [attivitàSelezionata, setAttivitàSelezionata] = useState<AttivitàTipo | null>(null);

  if (!attivitàSelezionata) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex flex-col z-50 overflow-y-auto">
        <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
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

        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900">
                <strong>💡 Come funziona:</strong> Seleziona un'attività e usa i form per aggiungere i tuoi contenuti personalizzati. 
                Non serve scrivere codice, basta compilare i campi!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setAttivitàSelezionata("intruso")}
                className="p-6 bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl shadow-lg transition-all text-left"
              >
                <div className="text-5xl mb-3">🔍</div>
                <div className="text-xl font-bold mb-2">Intruso Logico</div>
                <div className="text-sm opacity-90">
                  Crea round con 4 elementi: 3 della stessa categoria e 1 intruso
                </div>
              </button>

              <button
                onClick={() => setAttivitàSelezionata("canzoni")}
                className="p-6 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all text-left"
              >
                <div className="text-5xl mb-3">🎶</div>
                <div className="text-xl font-bold mb-2">Completa Canzone</div>
                <div className="text-sm opacity-90">
                  Aggiungi canzoni con titolo, artista e frase da completare
                </div>
              </button>

              <button
                onClick={() => setAttivitàSelezionata("orologio")}
                className="p-6 bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all text-left"
              >
                <div className="text-5xl mb-3">⏰</div>
                <div className="text-xl font-bold mb-2">Orologio</div>
                <div className="text-sm opacity-90">
                  Personalizza orari con ore e minuti
                </div>
              </button>

              <button
                onClick={() => setAttivitàSelezionata("valigia")}
                className="p-6 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all text-left"
              >
                <div className="text-5xl mb-3">🧳</div>
                <div className="text-xl font-bold mb-2">Valigia / Spesa</div>
                <div className="text-sm opacity-90">
                  Crea scenari con oggetti corretti e sbagliati
                </div>
              </button>

              <button
                onClick={() => setAttivitàSelezionata("associazioni")}
                className="p-6 bg-gradient-to-br from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700 text-white rounded-xl shadow-lg transition-all text-left"
              >
                <div className="text-5xl mb-3">🔗</div>
                <div className="text-xl font-bold mb-2">Associazioni</div>
                <div className="text-sm opacity-90">
                  Crea coppie di concetti correlati
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
    associazioni: "🔗 Associazioni Tematiche",
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50 overflow-y-auto">
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">{titoli[tipo]}</h2>
          <button
            onClick={onIndietro}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg"
          >
            ← Indietro
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {tipo === "intruso" && <EditorIntruso rounds={rounds} setRounds={setRounds} />}
          {tipo === "canzoni" && <EditorCanzoni rounds={rounds} setRounds={setRounds} />}
          {tipo === "orologio" && <EditorOrologio rounds={rounds} setRounds={setRounds} />}
          {tipo === "valigia" && <EditorValigia rounds={rounds} setRounds={setRounds} />}
          {tipo === "associazioni" && <EditorAssociazioni rounds={rounds} setRounds={setRounds} />}

          <div className="flex gap-3 sticky bottom-0 bg-slate-50 py-4">
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

// Editor per Intruso Logico
function EditorIntruso({ rounds, setRounds }: { rounds: any[]; setRounds: (r: any[]) => void }) {
  const aggiungiRound = () => {
    setRounds([
      ...rounds,
      {
        categoria: "Nuova Categoria",
        elementi: [
          { testo: "Elemento 1", emoji: "📦", èIntruso: false },
          { testo: "Elemento 2", emoji: "📦", èIntruso: false },
          { testo: "Elemento 3", emoji: "📦", èIntruso: false },
          { testo: "INTRUSO", emoji: "❌", èIntruso: true },
        ],
      },
    ]);
  };

  const rimuoviRound = (idx: number) => {
    setRounds(rounds.filter((_, i) => i !== idx));
  };

  const aggiornaElemento = (roundIdx: number, elemIdx: number, campo: string, valore: any) => {
    const nuoviRounds = [...rounds];
    nuoviRounds[roundIdx].elementi[elemIdx][campo] = valore;
    setRounds(nuoviRounds);
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 mb-2">📝 Come creare un round</h3>
        <p className="text-sm text-amber-800">
          Ogni round ha 4 elementi: 3 della stessa categoria e 1 intruso. 
          Usa emoji grandi e testi brevi per facilitare la lettura.
        </p>
      </div>

      {rounds.map((round, roundIdx) => (
        <div key={roundIdx} className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <input
              type="text"
              value={round.categoria}
              onChange={(e) => {
                const nuoviRounds = [...rounds];
                nuoviRounds[roundIdx].categoria = e.target.value;
                setRounds(nuoviRounds);
              }}
              className="text-lg font-bold text-slate-900 border-b border-slate-300 focus:border-blue-500 focus:outline-none pb-1"
              placeholder="Nome categoria"
            />
            <button
              onClick={() => rimuoviRound(roundIdx)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              🗑️ Rimuovi
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {round.elementi.map((elem: any, elemIdx: number) => (
              <div key={elemIdx} className="bg-slate-50 rounded p-3 space-y-2">
                <EmojiPicker
                  valore={elem.emoji}
                  onChange={(emoji) => aggiornaElemento(roundIdx, elemIdx, "emoji", emoji)}
                  label={`Emoji elemento ${elemIdx + 1}`}
                />
                <input
                  type="text"
                  value={elem.testo}
                  onChange={(e) => aggiornaElemento(roundIdx, elemIdx, "testo", e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1"
                  placeholder="Testo elemento"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={elem.èIntruso}
                    onChange={(e) => aggiornaElemento(roundIdx, elemIdx, "èIntruso", e.target.checked)}
                    className="rounded"
                  />
                  <span className={elem.èIntruso ? "text-red-600 font-semibold" : "text-slate-600"}>
                    {elem.èIntruso ? "❌ È l'intruso" : "✓ Elemento normale"}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={aggiungiRound}
        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
      >
        + Aggiungi Round
      </button>
    </div>
  );
}

// Editor per Completa Canzone
function EditorCanzoni({ rounds, setRounds }: { rounds: any[]; setRounds: (r: any[]) => void }) {
  const aggiungiRound = () => {
    setRounds([
      ...rounds,
      {
        titolo: "Nuova Canzone",
        artista: "Artista",
        anno: "2000",
        fraseIniziale: "Inizio della frase...",
        opzioni: [
          { testo: "continuazione corretta", èCorretta: true },
          { testo: "continuazione sbagliata 1", èCorretta: false },
          { testo: "continuazione sbagliata 2", èCorretta: false },
        ],
      },
    ]);
  };

  const rimuoviRound = (idx: number) => {
    setRounds(rounds.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 mb-2">📝 Come creare un round</h3>
        <p className="text-sm text-amber-800">
          Inserisci titolo, artista, anno e l'inizio della frase. 
          Poi aggiungi 3 opzioni: una corretta e due sbagliate.
        </p>
      </div>

      {rounds.map((round, roundIdx) => (
        <div key={roundIdx} className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Canzone {roundIdx + 1}</h3>
            <button
              onClick={() => rimuoviRound(roundIdx)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              🗑️ Rimuovi
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={round.titolo}
              onChange={(e) => {
                const nuoviRounds = [...rounds];
                nuoviRounds[roundIdx].titolo = e.target.value;
                setRounds(nuoviRounds);
              }}
              className="border border-slate-300 rounded px-3 py-2"
              placeholder="Titolo canzone"
            />
            <input
              type="text"
              value={round.artista}
              onChange={(e) => {
                const nuoviRounds = [...rounds];
                nuoviRounds[roundIdx].artista = e.target.value;
                setRounds(nuoviRounds);
              }}
              className="border border-slate-300 rounded px-3 py-2"
              placeholder="Artista"
            />
            <input
              type="text"
              value={round.anno}
              onChange={(e) => {
                const nuoviRounds = [...rounds];
                nuoviRounds[roundIdx].anno = e.target.value;
                setRounds(nuoviRounds);
              }}
              className="border border-slate-300 rounded px-3 py-2"
              placeholder="Anno"
            />
          </div>

          <input
            type="text"
            value={round.fraseIniziale}
            onChange={(e) => {
              const nuoviRounds = [...rounds];
              nuoviRounds[roundIdx].fraseIniziale = e.target.value;
              setRounds(nuoviRounds);
            }}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder="Inizio della frase da completare..."
          />

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Opzioni:</p>
            {round.opzioni.map((opzione: any, opzioneIdx: number) => (
              <div key={opzioneIdx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opzione.testo}
                  onChange={(e) => {
                    const nuoviRounds = [...rounds];
                    nuoviRounds[roundIdx].opzioni[opzioneIdx].testo = e.target.value;
                    setRounds(nuoviRounds);
                  }}
                  className="flex-1 border border-slate-300 rounded px-3 py-2"
                  placeholder={`Opzione ${opzioneIdx + 1}`}
                />
                <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                  <input
                    type="radio"
                    name={`corretta-${roundIdx}`}
                    checked={opzione.èCorretta}
                    onChange={() => {
                      const nuoviRounds = [...rounds];
                      nuoviRounds[roundIdx].opzioni.forEach((o: any, i: number) => {
                        o.èCorretta = i === opzioneIdx;
                      });
                      setRounds(nuoviRounds);
                    }}
                  />
                  <span className={opzione.èCorretta ? "text-emerald-600 font-semibold" : "text-slate-600"}>
                    Corretta
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={aggiungiRound}
        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
      >
        + Aggiungi Canzone
      </button>
    </div>
  );
}

// Editor per Orologio
function EditorOrologio({ rounds, setRounds }: { rounds: any[]; setRounds: (r: any[]) => void }) {
  const aggiungiRound = () => {
    setRounds([
      ...rounds,
      {
        ore: 10,
        minuti: 0,
        periodo: "Mattina",
        opzioni: [
          { testo: "Ore 10:00", èCorretta: true },
          { testo: "Ore 9:00", èCorretta: false },
          { testo: "Ore 11:00", èCorretta: false },
        ],
      },
    ]);
  };

  const rimuoviRound = (idx: number) => {
    setRounds(rounds.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 mb-2">📝 Come creare un round</h3>
        <p className="text-sm text-amber-800">
          Imposta ore e minuti, poi aggiungi 3 opzioni di orario (una corretta e due sbagliate).
        </p>
      </div>

      {rounds.map((round, roundIdx) => (
        <div key={roundIdx} className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Orario {roundIdx + 1}</h3>
            <button
              onClick={() => rimuoviRound(roundIdx)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              🗑️ Rimuovi
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ore</label>
              <input
                type="number"
                min="0"
                max="23"
                value={round.ore}
                onChange={(e) => {
                  const nuoviRounds = [...rounds];
                  nuoviRounds[roundIdx].ore = parseInt(e.target.value);
                  setRounds(nuoviRounds);
                }}
                className="w-full border border-slate-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Minuti</label>
              <input
                type="number"
                min="0"
                max="59"
                value={round.minuti}
                onChange={(e) => {
                  const nuoviRounds = [...rounds];
                  nuoviRounds[roundIdx].minuti = parseInt(e.target.value);
                  setRounds(nuoviRounds);
                }}
                className="w-full border border-slate-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Opzioni orario:</p>
            {round.opzioni.map((opzione: any, opzioneIdx: number) => (
              <div key={opzioneIdx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opzione.testo}
                  onChange={(e) => {
                    const nuoviRounds = [...rounds];
                    nuoviRounds[roundIdx].opzioni[opzioneIdx].testo = e.target.value;
                    setRounds(nuoviRounds);
                  }}
                  className="flex-1 border border-slate-300 rounded px-3 py-2"
                  placeholder={`Ore X:XX`}
                />
                <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                  <input
                    type="radio"
                    name={`corretta-${roundIdx}`}
                    checked={opzione.èCorretta}
                    onChange={() => {
                      const nuoviRounds = [...rounds];
                      nuoviRounds[roundIdx].opzioni.forEach((o: any, i: number) => {
                        o.èCorretta = i === opzioneIdx;
                      });
                      setRounds(nuoviRounds);
                    }}
                  />
                  <span className={opzione.èCorretta ? "text-emerald-600 font-semibold" : "text-slate-600"}>
                    Corretta
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={aggiungiRound}
        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
      >
        + Aggiungi Orario
      </button>
    </div>
  );
}

// Editor per Valigia/Spesa
function EditorValigia({ rounds, setRounds }: { rounds: any[]; setRounds: (r: any[]) => void }) {
  const aggiungiRound = () => {
    setRounds([
      ...rounds,
      {
        titolo: "Nuovo Scenario",
        emoji: "📦",
        contesto: "Descrizione dello scenario...",
        oggetti: [
          { nome: "Oggetto 1", emoji: "📦", èCorretto: true },
          { nome: "Oggetto 2", emoji: "📦", èCorretto: true },
          { nome: "Oggetto 3", emoji: "📦", èCorretto: false },
          { nome: "Oggetto 4", emoji: "📦", èCorretto: true },
          { nome: "Oggetto 5", emoji: "📦", èCorretto: false },
          { nome: "Oggetto 6", emoji: "📦", èCorretto: false },
        ],
      },
    ]);
  };

  const rimuoviRound = (idx: number) => {
    setRounds(rounds.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 mb-2">📝 Come creare un round</h3>
        <p className="text-sm text-amber-800">
          Crea uno scenario (es. "Andiamo al mare") e aggiungi 6 oggetti: alcuni corretti e altri sbagliati.
        </p>
      </div>

      {rounds.map((round, roundIdx) => (
        <div key={roundIdx} className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Scenario {roundIdx + 1}</h3>
            <button
              onClick={() => rimuoviRound(roundIdx)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              🗑️ Rimuovi
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={round.titolo}
              onChange={(e) => {
                const nuoviRounds = [...rounds];
                nuoviRounds[roundIdx].titolo = e.target.value;
                setRounds(nuoviRounds);
              }}
              className="border border-slate-300 rounded px-3 py-2"
              placeholder="Titolo scenario"
            />
            <EmojiPicker
              valore={round.emoji}
              onChange={(emoji) => {
                const nuoviRounds = [...rounds];
                nuoviRounds[roundIdx].emoji = emoji;
                setRounds(nuoviRounds);
              }}
              label="Emoji scenario"
            />
            <input
              type="text"
              value={round.contesto}
              onChange={(e) => {
                const nuoviRounds = [...rounds];
                nuoviRounds[roundIdx].contesto = e.target.value;
                setRounds(nuoviRounds);
              }}
              className="border border-slate-300 rounded px-3 py-2"
              placeholder="Descrizione contesto"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Oggetti (6 totali):</p>
            {round.oggetti.map((oggetto: any, oggettoIdx: number) => (
              <div key={oggettoIdx} className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                <EmojiPicker
                  valore={oggetto.emoji}
                  onChange={(emoji) => {
                    const nuoviRounds = [...rounds];
                    nuoviRounds[roundIdx].oggetti[oggettoIdx].emoji = emoji;
                    setRounds(nuoviRounds);
                  }}
                />
                <input
                  type="text"
                  value={oggetto.nome}
                  onChange={(e) => {
                    const nuoviRounds = [...rounds];
                    nuoviRounds[roundIdx].oggetti[oggettoIdx].nome = e.target.value;
                    setRounds(nuoviRounds);
                  }}
                  className="border border-slate-300 rounded px-3 py-2"
                  placeholder="Nome oggetto"
                />
                <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={oggetto.èCorretto}
                    onChange={(e) => {
                      const nuoviRounds = [...rounds];
                      nuoviRounds[roundIdx].oggetti[oggettoIdx].èCorretto = e.target.checked;
                      setRounds(nuoviRounds);
                    }}
                    className="w-5 h-5"
                  />
                  <span className={oggetto.èCorretto ? "text-emerald-600 font-semibold" : "text-slate-600"}>
                    ✓
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={aggiungiRound}
        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
      >
        + Aggiungi Scenario
      </button>
    </div>
  );
}

// Editor per Associazioni Tematiche
function EditorAssociazioni({ rounds, setRounds }: { rounds: any[]; setRounds: (r: any[]) => void }) {
  const aggiungiRound = () => {
    setRounds([
      ...rounds,
      {
        concetto: "Nuovo Concetto",
        emojiConcetto: "📦",
        associato: "Associato",
        emojiAssociato: "📦",
      },
    ]);
  };

  const rimuoviRound = (idx: number) => {
    setRounds(rounds.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 mb-2">📝 Come creare un'associazione</h3>
        <p className="text-sm text-amber-800">
          Ogni associazione è una coppia di concetti correlati (es. Matrimonio ↔ Bomboniera).
          Scegli emoji appropriate per entrambi i concetti.
        </p>
      </div>

      {rounds.map((round, roundIdx) => (
        <div key={roundIdx} className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Associazione {roundIdx + 1}</h3>
            <button
              onClick={() => rimuoviRound(roundIdx)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              🗑️ Rimuovi
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Concetto (sinistra) */}
            <div className="bg-blue-50 rounded-lg p-3 space-y-2">
              <p className="text-sm font-semibold text-blue-900">Concetto (sinistra)</p>
              <EmojiPicker
                valore={round.emojiConcetto}
                onChange={(emoji) => {
                  const nuoviRounds = [...rounds];
                  nuoviRounds[roundIdx].emojiConcetto = emoji;
                  setRounds(nuoviRounds);
                }}
                label="Emoji concetto"
              />
              <input
                type="text"
                value={round.concetto}
                onChange={(e) => {
                  const nuoviRounds = [...rounds];
                  nuoviRounds[roundIdx].concetto = e.target.value;
                  setRounds(nuoviRounds);
                }}
                className="w-full border border-slate-300 rounded px-3 py-2"
                placeholder="Es: Matrimonio, Cucina, Scuola..."
              />
            </div>

            {/* Associato (destra) */}
            <div className="bg-green-50 rounded-lg p-3 space-y-2">
              <p className="text-sm font-semibold text-green-900">Associato (destra)</p>
              <EmojiPicker
                valore={round.emojiAssociato}
                onChange={(emoji) => {
                  const nuoviRounds = [...rounds];
                  nuoviRounds[roundIdx].emojiAssociato = emoji;
                  setRounds(nuoviRounds);
                }}
                label="Emoji associato"
              />
              <input
                type="text"
                value={round.associato}
                onChange={(e) => {
                  const nuoviRounds = [...rounds];
                  nuoviRounds[roundIdx].associato = e.target.value;
                  setRounds(nuoviRounds);
                }}
                className="w-full border border-slate-300 rounded px-3 py-2"
                placeholder="Es: Bomboniera, Pentola, Libro..."
              />
            </div>
          </div>

          {/* Anteprima */}
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <p className="text-sm text-slate-600 mb-2">Anteprima:</p>
            <div className="flex items-center justify-center gap-4 text-lg">
              <span className="font-semibold text-blue-700">
                {round.emojiConcetto} {round.concetto}
              </span>
              <span className="text-slate-400">↔</span>
              <span className="font-semibold text-green-700">
                {round.emojiAssociato} {round.associato}
              </span>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={aggiungiRound}
        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
      >
        + Aggiungi Associazione
      </button>
    </div>
  );
}
