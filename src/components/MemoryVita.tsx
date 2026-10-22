import { useState, useEffect } from "react";
import { useRicordi, Ricordo } from "../hooks/useRicordi";

interface MemoryVitaProps {
  onChiudi: () => void;
}

type TipoAbbinamento = "foto-descrizione" | "foto-foto";

interface Carta {
  id: string;
  tipo: "foto" | "descrizione";
  contenuto: string;
  ricordoId: string;
  girata: boolean;
  trovata: boolean;
}

export default function MemoryVita({ onChiudi }: MemoryVitaProps) {
  const { ricordi } = useRicordi();
  const [carte, setCarte] = useState<Carta[]>([]);
  const [cartaSelezionata, setCartaSelezionata] = useState<string | null>(null);
  const [staConfrontando, setStaConfrontando] = useState(false);
  const [mosse, setMosse] = useState(0);
  const [completato, setCompletato] = useState(false);
  const [tipoAbbinamento, setTipoAbbinamento] = useState<TipoAbbinamento>("foto-descrizione");
  const [numeroCoppie, setNumeroCoppie] = useState(3);

  // Inizializza il gioco quando cambiano i ricordi o le impostazioni
  useEffect(() => {
    if (ricordi.length >= numeroCoppie) {
      generaCarte();
    }
  }, [ricordi, tipoAbbinamento, numeroCoppie]);

  const generaCarte = () => {
    // Seleziona un numero casuale di ricordi
    const ricordiSelezionati = [...ricordi]
      .sort(() => Math.random() - 0.5)
      .slice(0, numeroCoppie);

    const nuoveCarte: Carta[] = [];

    ricordiSelezionati.forEach((ricordo) => {
      if (tipoAbbinamento === "foto-descrizione") {
        // Crea una coppia foto-descrizione
        nuoveCarte.push({
          id: `${ricordo.id}-foto`,
          tipo: "foto",
          contenuto: ricordo.foto,
          ricordoId: ricordo.id,
          girata: false,
          trovata: false,
        });
        nuoveCarte.push({
          id: `${ricordo.id}-desc`,
          tipo: "descrizione",
          contenuto: ricordo.descrizione,
          ricordoId: ricordo.id,
          girata: false,
          trovata: false,
        });
      } else {
        // Crea due carte con foto diverse dello stesso ricordo (se disponibili)
        // Per ora usiamo la stessa foto due volte (da migliorare in futuro)
        nuoveCarte.push({
          id: `${ricordo.id}-foto1`,
          tipo: "foto",
          contenuto: ricordo.foto,
          ricordoId: ricordo.id,
          girata: false,
          trovata: false,
        });
        nuoveCarte.push({
          id: `${ricordo.id}-foto2`,
          tipo: "foto",
          contenuto: ricordo.foto,
          ricordoId: ricordo.id,
          girata: false,
          trovata: false,
        });
      }
    });

    // Mescola le carte
    const carteMescolate = nuoveCarte.sort(() => Math.random() - 0.5);
    setCarte(carteMescolate);
    setCartaSelezionata(null);
    setStaConfrontando(false);
    setMosse(0);
    setCompletato(false);
  };

  const gestisciClickCarta = (cartaId: string) => {
    if (staConfrontando) return;

    const carta = carte.find(c => c.id === cartaId);
    if (!carta || carta.girata || carta.trovata) return;

    // Gira la carta
    const nuoveCarte = carte.map(c =>
      c.id === cartaId ? { ...c, girata: true } : c
    );
    setCarte(nuoveCarte);

    if (cartaSelezionata === null) {
      // Prima carta selezionata
      setCartaSelezionata(cartaId);
    } else {
      // Seconda carta selezionata
      setStaConfrontando(true);
      setMosse(mosse + 1);

      const primaCarta = carte.find(c => c.id === cartaSelezionata);
      if (!primaCarta) return;

      // Controlla se è una coppia corretta
      if (primaCarta.ricordoId === carta.ricordoId && primaCarta.id !== carta.id) {
        // Coppia corretta!
        setTimeout(() => {
          const carteAggiornate = nuoveCarte.map(c =>
            c.ricordoId === carta.ricordoId ? { ...c, trovata: true, girata: false } : c
          );
          setCarte(carteAggiornate);
          setCartaSelezionata(null);
          setStaConfrontando(false);

          // Controlla se il gioco è completato
          if (carteAggiornate.every(c => c.trovata)) {
            setCompletato(true);
          }
        }, 1000);
      } else {
        // Coppia errata
        setTimeout(() => {
          const carteAggiornate = nuoveCarte.map(c =>
            c.girata && !c.trovata ? { ...c, girata: false } : c
          );
          setCarte(carteAggiornate);
          setCartaSelezionata(null);
          setStaConfrontando(false);
        }, 1500);
      }
    }
  };

  // Schermata configurazione iniziale
  if (carte.length === 0 && ricordi.length < 2) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-center space-y-6">
          <div className="text-7xl">📸</div>
          <h2 className="text-3xl font-bold text-slate-900">Memory di Vita</h2>
          <p className="text-xl text-slate-600">
            Non ci sono ancora abbastanza ricordi salvati.
          </p>
          <p className="text-lg text-slate-500">
            Il caregiver deve caricare almeno 2 foto con descrizioni.
          </p>
          <button
            onClick={onChiudi}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl"
          >
            ← Torna al Menu
          </button>
        </div>
      </div>
    );
  }

  // Schermata configurazione
  if (carte.length === 0) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center">📸 Memory di Vita</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-slate-700 mb-2">
                Tipo di Abbinamento
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTipoAbbinamento("foto-descrizione")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    tipoAbbinamento === "foto-descrizione"
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white border-slate-300 hover:border-blue-300"
                  }`}
                >
                  <div className="text-3xl mb-2">📷📝</div>
                  <div className="font-bold">Foto + Descrizione</div>
                </button>
                <button
                  onClick={() => setTipoAbbinamento("foto-foto")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    tipoAbbinamento === "foto-foto"
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white border-slate-300 hover:border-blue-300"
                  }`}
                >
                  <div className="text-3xl mb-2">📷📷</div>
                  <div className="font-bold">Foto + Foto</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-slate-700 mb-2">
                Numero di Coppie: {numeroCoppie}
              </label>
              <input
                type="range"
                min="2"
                max={Math.min(ricordi.length, 6)}
                value={numeroCoppie}
                onChange={(e) => setNumeroCoppie(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-600 mt-1">
                <span>2 coppie</span>
                <span>{Math.min(ricordi.length, 6)} coppie</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generaCarte}
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
          <h2 className="text-3xl font-bold text-slate-900">Complimenti!</h2>
          <p className="text-xl text-slate-600">
            Hai trovato tutte le coppie in {mosse} mosse!
          </p>
          <div className="flex gap-4">
            <button
              onClick={generaCarte}
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

  // Calcola il numero di colonne in base al numero di carte
  const totaleCarte = carte.length;
  const colonne = totaleCarte <= 6 ? 3 : totaleCarte <= 10 ? 4 : 5;

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">📸 Memory di Vita</h2>
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
        <div className="max-w-4xl w-full space-y-6">
          {/* Istruzioni */}
          <div className="text-center">
            <p className="text-2xl text-slate-700 font-medium mb-2">
              Trova le coppie!
            </p>
            <p className="text-lg text-slate-500">
              {tipoAbbinamento === "foto-descrizione"
                ? "Abbina ogni foto alla sua descrizione"
                : "Abbina le foto uguali"}
            </p>
          </div>

          {/* Griglia carte */}
          <div
            className="grid gap-4 max-w-4xl mx-auto"
            style={{
              gridTemplateColumns: `repeat(${colonne}, 1fr)`,
            }}
          >
            {carte.map((carta) => (
              <button
                key={carta.id}
                onClick={() => gestisciClickCarta(carta.id)}
                disabled={carta.girata || carta.trovata || staConfrontando}
                className={`aspect-square rounded-2xl border-4 transition-all ${
                  carta.trovata
                    ? "bg-emerald-100 border-emerald-500"
                    : carta.girata
                    ? "bg-white border-blue-500"
                    : "bg-blue-500 border-blue-600 hover:bg-blue-400 hover:scale-105 cursor-pointer"
                }`}
              >
                {carta.girata || carta.trovata ? (
                  carta.tipo === "foto" ? (
                    <img
                      src={carta.contenuto}
                      alt="Ricordo"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <p className="text-lg md:text-xl font-bold text-slate-900 text-center">
                        {carta.contenuto}
                      </p>
                    </div>
                  )
                ) : (
                  <span className="text-white text-5xl">?</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
