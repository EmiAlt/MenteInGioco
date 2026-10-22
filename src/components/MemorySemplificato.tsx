import { useState, useEffect } from "react";

interface MemorySemplificatoProps {
  onChiudi: () => void;
}

const IMMAGINI = ["🍎", "🐕", "🏠", "🚗", "🌸", "🎵"];

export default function MemorySemplificato({ onChiudi }: MemorySemplificatoProps) {
  const [carte, setCarte] = useState<{ id: number; emoji: string; girata: boolean; trovata: boolean }[]>([]);
  const [primaCarta, setPrimaCarta] = useState<number | null>(null);
  const [mosse, setMosse] = useState(0);
  const [completato, setCompletato] = useState(false);

  // Inizializza il gioco
  useEffect(() => {
    iniziaGioco();
  }, []);

  const iniziaGioco = () => {
    // Crea coppie di carte (3 coppie = 6 carte)
    const coppie = IMMAGINI.slice(0, 3);
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
    setPrimaCarta(null);
    setMosse(0);
    setCompletato(false);
  };

  const gestisciClickCarta = (id: number) => {
    if (carte[id].girata || carte[id].trovata || primaCarta !== null) return;

    // Gira la carta
    const nuoveCarte = [...carte];
    nuoveCarte[id].girata = true;
    setCarte(nuoveCarte);

    if (primaCarta === null) {
      // Prima carta selezionata
      setPrimaCarta(id);
    } else {
      // Seconda carta selezionata
      setMosse(mosse + 1);
      
      if (carte[primaCarta].emoji === carte[id].emoji) {
        // Coppia trovata!
        setTimeout(() => {
          const carteAggiornate = [...carte];
          carteAggiornate[primaCarta].trovata = true;
          carteAggiornate[primaCarta].girata = false;
          carteAggiornate[id].trovata = true;
          carteAggiornate[id].girata = false;
          setCarte(carteAggiornate);
          setPrimaCarta(null);

          // Controlla se il gioco è completato
          if (carteAggiornate.every(c => c.trovata)) {
            setCompletato(true);
          }
        }, 800);
      } else {
        // Non è una coppia, gira indietro
        setTimeout(() => {
          const carteAggiornate = [...carte];
          carteAggiornate[primaCarta].girata = false;
          carteAggiornate[id].girata = false;
          setCarte(carteAggiornate);
          setPrimaCarta(null);
        }, 1000);
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

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">🧠 Trova la Coppia</h2>
            <p className="text-sm text-slate-500">Mosse: {mosse}</p>
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
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {carte.map((carta) => (
              <button
                key={carta.id}
                onClick={() => gestisciClickCarta(carta.id)}
                disabled={carta.girata || carta.trovata}
                className={`aspect-square rounded-2xl border-4 transition-all text-6xl flex items-center justify-center ${
                  carta.trovata
                    ? "bg-emerald-100 border-emerald-500"
                    : carta.girata
                    ? "bg-white border-blue-500"
                    : "bg-blue-500 border-blue-600 hover:bg-blue-400 hover:scale-105"
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
