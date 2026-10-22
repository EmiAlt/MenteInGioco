import { useState, useEffect } from "react";

interface MemorySemplificatoProps {
  onChiudi: () => void;
}

interface Carta {
  emoji: string;
  girata: boolean;
  trovata: boolean;
}

const IMMAGINI = ["🍎", "🐕", "🏠", "🚗", "🌸", "🎵"];

export default function MemorySemplificato({ onChiudi }: MemorySemplificatoProps) {
  const [carte, setCarte] = useState<Carta[]>([]);
  const [posizioneSelezionata, setPosizioneSelezionata] = useState<number | null>(null);
  const [bloccato, setBloccato] = useState(false);
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
    
    // Mescola usando Fisher-Yates
    for (let i = carteDoppie.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [carteDoppie[i], carteDoppie[j]] = [carteDoppie[j], carteDoppie[i]];
    }
    
    // Crea array di carte con stato iniziale
    const nuoveCarte: Carta[] = carteDoppie.map(emoji => ({
      emoji,
      girata: false,
      trovata: false,
    }));

    setCarte(nuoveCarte);
    setPosizioneSelezionata(null);
    setBloccato(false);
    setMosse(0);
    setCompletato(false);
  };

  const gestisciClickCarta = (posizione: number) => {
    // Blocca se sta confrontando o se la carta è già girata/trovata
    if (bloccato || carte[posizione].girata || carte[posizione].trovata) {
      return;
    }

    // Crea copia dell'array
    const nuoveCarte = [...carte];
    
    if (posizioneSelezionata === null) {
      // Prima carta: gira e seleziona
      nuoveCarte[posizione].girata = true;
      setCarte(nuoveCarte);
      setPosizioneSelezionata(posizione);
    } else {
      // Seconda carta: gira e confronta
      nuoveCarte[posizione].girata = true;
      setCarte(nuoveCarte);
      setBloccato(true);
      setMosse(mosse + 1);
      
      const primaPos = posizioneSelezionata;
      
      if (carte[primaPos].emoji === carte[posizione].emoji) {
        // Coppia trovata!
        setTimeout(() => {
          const carteAggiornate = [...carte];
          carteAggiornate[primaPos].trovata = true;
          carteAggiornate[primaPos].girata = false;
          carteAggiornate[posizione].trovata = true;
          carteAggiornate[posizione].girata = false;
          setCarte(carteAggiornate);
          setPosizioneSelezionata(null);
          setBloccato(false);

          // Controlla se il gioco è completato
          if (carteAggiornate.every(c => c.trovata)) {
            setCompletato(true);
          }
        }, 1000);
      } else {
        // Non è una coppia, gira indietro
        setTimeout(() => {
          const carteAggiornate = [...carte];
          carteAggiornate[primaPos].girata = false;
          carteAggiornate[posizione].girata = false;
          setCarte(carteAggiornate);
          setPosizioneSelezionata(null);
          setBloccato(false);
        }, 1200);
      }
    }
  };

  if (completato) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 text-center space-y-4 md:space-y-6 my-auto">
          <div className="text-6xl md:text-7xl">🎉</div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Complimenti!</h2>
          <p className="text-lg md:text-xl text-slate-600">
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
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
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
      <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-6">
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
            {carte.map((carta, posizione) => (
              <button
                key={posizione}
                onClick={() => gestisciClickCarta(posizione)}
                disabled={carta.girata || carta.trovata || bloccato}
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
