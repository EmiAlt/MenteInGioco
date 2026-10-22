import { useState, useEffect } from "react";

interface MemorySemplificatoProps {
  onChiudi: () => void;
}

const IMMAGINI = ["🍎", "🐕", "🏠", "🚗", "🌸", "🎵"];

export default function MemorySemplificato({ onChiudi }: MemorySemplificatoProps) {
  const [carte, setCarte] = useState<{ id: number; emoji: string; girata: boolean; trovata: boolean }[]>([]);
  const [cartaSelezionata, setCartaSelezionata] = useState<number | null>(null);
  const [staConfrontando, setStaConfrontando] = useState(false);
  const [mosse, setMosse] = useState(0);
  const [completato, setCompletato] = useState(false);
  const [numeroCoppie, setNumeroCoppie] = useState(() => {
    const salvato = localStorage.getItem("memory_numero_coppie");
    return salvato ? parseInt(salvato) : 3;
  });

  // Inizializza il gioco
  useEffect(() => {
    iniziaGioco();
  }, [numeroCoppie]);

  const iniziaGioco = () => {
    // Crea coppie di carte
    const coppie = IMMAGINI.slice(0, numeroCoppie);
    const carteDoppie = [...coppie, ...coppie];
    
    // Mescola
    const carteMescolate = carteDoppie
      .map((emoji, idx) => ({
        id: idx,
        emoji,
        girata: false,
        trovata: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCarte(carteMescolate);
    setCartaSelezionata(null);
    setStaConfrontando(false);
    setMosse(0);
    setCompletato(false);
  };

  const gestisciClickCarta = (id: number) => {
    // Blocca se sta confrontando o se la carta è già girata/trovata
    if (staConfrontando || carte[id].girata || carte[id].trovata) {
      return;
    }

    // Gira la carta
    const nuoveCarte = [...carte];
    nuoveCarte[id].girata = true;
    setCarte(nuoveCarte);

    if (cartaSelezionata === null) {
      // Prima carta selezionata
      setCartaSelezionata(id);
    } else {
      // Seconda carta selezionata - confronta
      setStaConfrontando(true);
      setMosse(mosse + 1);
      
      if (carte[cartaSelezionata].emoji === carte[id].emoji) {
        // Coppia trovata!
        setTimeout(() => {
          const carteAggiornate = [...carte];
          carteAggiornate[cartaSelezionata].trovata = true;
          carteAggiornate[cartaSelezionata].girata = false;
          carteAggiornate[id].trovata = true;
          carteAggiornate[id].girata = false;
          setCarte(carteAggiornate);
          setCartaSelezionata(null);
          setStaConfrontando(false);

          // Controlla se il gioco è completato
          if (carteAggiornate.every(c => c.trovata)) {
            setCompletato(true);
          }
        }, 1000);
      } else {
        // Non è una coppia, gira indietro
        setTimeout(() => {
          const carteAggiornate = [...carte];
          carteAggiornate[cartaSelezionata].girata = false;
          carteAggiornate[id].girata = false;
          setCarte(carteAggiornate);
          setCartaSelezionata(null);
          setStaConfrontando(false);
        }, 1200);
      }
    }
  };

  if (completato) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-center space-y-6">
          <div className="text-7xl">🎉</div>
          <h2 className="text-3xl font-bold text-slate-900">Complimenti!</h2>
          <p className="text-xl text-slate-600">
            Hai trovato tutte le coppie in {mosse} mosse!
          </p>
          <div className="flex gap-4">
            <button
              onClick={iniziaGioco}
              className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl"
            >
              Gioca Ancora
            </button>
            <button
              onClick={onChiudi}
              className="flex-1 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xl font-bold rounded-xl"
            >
              Torna al Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calcola il numero di colonne in base al numero di carte
  const totaleCarte = numeroCoppie * 2;
  const colonne = totaleCarte <= 6 ? 3 : totaleCarte <= 10 ? 4 : 5;

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">🧠 Trova la Coppia</h2>
            <p className="text-sm text-slate-500">Mosse: {mosse} | Coppie: {numeroCoppie}</p>
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
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          {/* Istruzioni */}
          <div className="text-center">
            <p className="text-2xl text-slate-700 font-medium mb-2">
              Trova le coppie!
            </p>
            <p className="text-lg text-slate-500">
              Gira le carte e trova le immagini uguali
            </p>
          </div>

          {/* Griglia carte */}
          <div 
            className="grid gap-4 max-w-lg mx-auto"
            style={{
              gridTemplateColumns: `repeat(${colonne}, 1fr)`,
            }}
          >
            {carte.map((carta) => (
              <button
                key={carta.id}
                onClick={() => gestisciClickCarta(carta.id)}
                disabled={carta.girata || carta.trovata || staConfrontando}
                className={`aspect-square rounded-2xl border-4 transition-all text-6xl flex items-center justify-center ${
                  carta.trovata
                    ? "bg-emerald-100 border-emerald-500"
                    : carta.girata
                    ? "bg-white border-blue-500"
                    : "bg-blue-500 border-blue-600 hover:bg-blue-400 hover:scale-105 cursor-pointer"
                }`}
              >
                {carta.girata || carta.trovata ? (
                  <span>{carta.emoji}</span>
                ) : (
                  <span className="text-white text-4xl">?</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
