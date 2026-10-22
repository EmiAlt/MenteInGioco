import { useState, useEffect } from "react";

interface AssociazioniTematichProps {
  onChiudi: () => void;
}

interface CoppiaAssociazione {
  concetto: string;
  emojiConcetto: string;
  associato: string;
  emojiAssociato: string;
}

interface Tessera {
  id: string;
  tipo: "concetto" | "associato";
  contenuto: string;
  emoji: string;
  coppiaId: number;
  selezionata: boolean;
  trovata: boolean;
}

const ASSOCIAZIONI_DEFAULT: CoppiaAssociazione[] = [
  { concetto: "Matrimonio", emojiConcetto: "💍", associato: "Bomboniera", emojiAssociato: "🎁" },
  { concetto: "Cucina", emojiConcetto: "👨‍🍳", associato: "Pentola", emojiAssociato: "🍲" },
  { concetto: "Cantiere", emojiConcetto: "👷", associato: "Martello", emojiAssociato: "🔨" },
  { concetto: "Scuola", emojiConcetto: "👨‍🏫", associato: "Libro", emojiAssociato: "📖" },
  { concetto: "Ospedale", emojiConcetto: "👨‍⚕️", associato: "Medicina", emojiAssociato: "💊" },
  { concetto: "Natale", emojiConcetto: "🎄", associato: "Regalo", emojiAssociato: "🎁" },
  { concetto: "Compleanno", emojiConcetto: "🎂", associato: "Candeline", emojiAssociato: "🕯️" },
  { concetto: "Mare", emojiConcetto: "🏖️", associato: "Ombrellone", emojiAssociato: "⛱️" },
  { concetto: "Montagna", emojiConcetto: "⛰️", associato: "Sci", emojiAssociato: "🎿" },
  { concetto: "Giardino", emojiConcetto: "🌳", associato: "Fiore", emojiAssociato: "🌸" },
];

export default function AssociazioniTematiche({ onChiudi }: AssociazioniTematichProps) {
  const [tessere, setTessere] = useState<Tessera[]>([]);
  const [tesseraSelezionata, setTesseraSelezionata] = useState<string | null>(null);
  const [coppieCompletate, setCoppieCompletate] = useState(0);
  const [totaleCoppie, setTotaleCoppie] = useState(0);
  const [completato, setCompletato] = useState(false);
  const [feedback, setFeedback] = useState<"corretto" | "sbagliato" | null>(null);
  const [numeroCoppie, setNumeroCoppie] = useState(5);

  useEffect(() => {
    generaTessere();
  }, [numeroCoppie]);

  const generaTessere = () => {
    // Seleziona un numero casuale di associazioni
    const associazioniSelezionate = [...ASSOCIAZIONI_DEFAULT]
      .sort(() => Math.random() - 0.5)
      .slice(0, numeroCoppie);

    const nuoveTessere: Tessera[] = [];

    associazioniSelezionate.forEach((assoc, idx) => {
      nuoveTessere.push({
        id: `concetto-${idx}`,
        tipo: "concetto",
        contenuto: assoc.concetto,
        emoji: assoc.emojiConcetto,
        coppiaId: idx,
        selezionata: false,
        trovata: false,
      });
      nuoveTessere.push({
        id: `associato-${idx}`,
        tipo: "associato",
        contenuto: assoc.associato,
        emoji: assoc.emojiAssociato,
        coppiaId: idx,
        selezionata: false,
        trovata: false,
      });
    });

    // Mescola separatamente le due colonne
    const concetti = nuoveTessere.filter(t => t.tipo === "concetto").sort(() => Math.random() - 0.5);
    const associati = nuoveTessere.filter(t => t.tipo === "associato").sort(() => Math.random() - 0.5);

    setTessere([...concetti, ...associati]);
    setTotaleCoppie(numeroCoppie);
    setCoppieCompletate(0);
    setCompletato(false);
    setTesseraSelezionata(null);
    setFeedback(null);
  };

  const gestisciClickTessera = (tesseraId: string) => {
    if (completato) return;

    const tessera = tessere.find(t => t.id === tesseraId);
    if (!tessera || tessera.trovata) return;

    if (tesseraSelezionata === null) {
      // Prima tessera selezionata
      const nuoveTessere = tessere.map(t =>
        t.id === tesseraId ? { ...t, selezionata: true } : { ...t, selezionata: false }
      );
      setTessere(nuoveTessere);
      setTesseraSelezionata(tesseraId);
    } else {
      // Seconda tessera selezionata
      const primaTessera = tessere.find(t => t.id === tesseraSelezionata);
      if (!primaTessera) return;

      // Controlla se è una coppia corretta (devono essere di tipo diverso e stessa coppiaId)
      if (primaTessera.tipo !== tessera.tipo && primaTessera.coppiaId === tessera.coppiaId) {
        // Associazione corretta!
        setFeedback("corretto");
        setTimeout(() => {
          const nuoveTessere = tessere.map(t =>
            t.coppiaId === tessera.coppiaId ? { ...t, trovata: true, selezionata: false } : { ...t, selezionata: false }
          );
          setTessere(nuoveTessere);
          setTesseraSelezionata(null);
          setCoppieCompletate(coppieCompletate + 1);
          setFeedback(null);

          // Controlla se il gioco è completato
          if (coppieCompletate + 1 === totaleCoppie) {
            setCompletato(true);
          }
        }, 1000);
      } else {
        // Associazione errata
        setFeedback("sbagliato");
        setTimeout(() => {
          const nuoveTessere = tessere.map(t => ({ ...t, selezionata: false }));
          setTessere(nuoveTessere);
          setTesseraSelezionata(null);
          setFeedback(null);
        }, 1500);
      }
    }
  };

  // Schermata configurazione iniziale
  if (tessere.length === 0) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center">🔗 Associazioni Tematiche</h2>
          
          <div>
            <label className="block text-lg font-semibold text-slate-700 mb-2">
              Numero di Coppie: {numeroCoppie}
            </label>
            <input
              type="range"
              min="3"
              max="8"
              value={numeroCoppie}
              onChange={(e) => setNumeroCoppie(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-600 mt-1">
              <span>3 coppie</span>
              <span>8 coppie</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generaTessere}
              className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl"
            >
              🎮 Inizia Gioco
            </button>
            <button
              onClick={onChiudi}
              className="flex-1 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xl font-bold rounded-xl"
            >
              ← Annulla
            </button>
          </div>
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
          <h2 className="text-3xl font-bold text-slate-900">Perfetto!</h2>
          <p className="text-xl text-slate-600">
            Hai completato tutte le {totaleCoppie} associazioni!
          </p>
          <div className="flex gap-4">
            <button
              onClick={generaTessere}
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

  // Separa le tessere in due colonne
  const concetti = tessere.filter(t => t.tipo === "concetto");
  const associati = tessere.filter(t => t.tipo === "associato");

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">🔗 Associazioni Tematiche</h2>
            <p className="text-sm text-slate-500">
              Coppie completate: {coppieCompletate} / {totaleCoppie}
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
        <div className="max-w-6xl w-full space-y-6">
          {/* Istruzioni */}
          <div className="text-center">
            <p className="text-2xl text-slate-700 font-medium mb-2">
              Collega i concetti!
            </p>
            <p className="text-lg text-slate-500">
              Clicca su un elemento a sinistra e poi sul suo associato a destra
            </p>
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
                {feedback === "corretto" ? "✅ Perfetto! Associazione corretta!" : "❌ Riprova!"}
              </p>
            </div>
          )}

          {/* Due colonne di tessere */}
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {/* Colonna sinistra: Concetti */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 text-center mb-4">
                Concetti
              </h3>
              {concetti.map((tessera) => (
                <button
                  key={tessera.id}
                  onClick={() => gestisciClickTessera(tessera.id)}
                  disabled={tessera.trovata}
                  className={`w-full p-4 md:p-6 rounded-2xl border-4 transition-all ${
                    tessera.trovata
                      ? "bg-emerald-100 border-emerald-500 opacity-60"
                      : tessera.selezionata
                      ? "bg-blue-100 border-blue-500 scale-105"
                      : "bg-white border-slate-300 hover:border-blue-400 hover:scale-105 cursor-pointer"
                  }`}
                >
                  <div className="text-4xl md:text-5xl mb-2">{tessera.emoji}</div>
                  <div className="text-lg md:text-xl font-bold text-slate-900">
                    {tessera.contenuto}
                  </div>
                </button>
              ))}
            </div>

            {/* Colonna destra: Associati */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 text-center mb-4">
                Associati
              </h3>
              {associati.map((tessera) => (
                <button
                  key={tessera.id}
                  onClick={() => gestisciClickTessera(tessera.id)}
                  disabled={tessera.trovata}
                  className={`w-full p-4 md:p-6 rounded-2xl border-4 transition-all ${
                    tessera.trovata
                      ? "bg-emerald-100 border-emerald-500 opacity-60"
                      : tessera.selezionata
                      ? "bg-blue-100 border-blue-500 scale-105"
                      : "bg-white border-slate-300 hover:border-blue-400 hover:scale-105 cursor-pointer"
                  }`}
                >
                  <div className="text-4xl md:text-5xl mb-2">{tessera.emoji}</div>
                  <div className="text-lg md:text-xl font-bold text-slate-900">
                    {tessera.contenuto}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
