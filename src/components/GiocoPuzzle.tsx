import { useState, useEffect, useRef } from "react";

interface PuzzleProps {
  onChiudi: () => void;
}

/**
 * Componente per gestire le immagini del puzzle (lato caregiver)
 */
function GestioneImmaginiPuzzle({
  immagini,
  onAggiungi,
  onRimuovi,
}: {
  immagini: string[];
  onAggiungi: (url: string) => void;
  onRimuovi: (idx: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gestisciFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      onAggiungi(url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">📸 Immagini Puzzle</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {immagini.map((img, idx) => (
          <div key={idx} className="relative group">
            <img
              src={img}
              alt={`Puzzle ${idx + 1}`}
              className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
            />
            <button
              onClick={() => onRimuovi(idx)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
      >
        + Aggiungi Immagine
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={gestisciFile}
        className="hidden"
      />
    </div>
  );
}

/**
 * Componente principale del gioco Puzzle
 * 
 * Logica di gioco:
 * - Tutte le tessere sono visibili (nessuna casella vuota)
 * - L'utente clicca su una tessera per selezionarla
 * - L'utente clicca su un'altra tessera per scambiarle
 * - Il puzzle è completato quando tutte le tessere sono nella posizione corretta
 * - Mantiene l'aspect ratio originale dell'immagine
 */
export default function GiocoPuzzle({ onChiudi }: PuzzleProps) {
  const [immaginiPuzzle, setImmaginiPuzzle] = useState<string[]>(() => {
    const salvate = localStorage.getItem("stimolazione_cognitiva_puzzle_immagini");
    return salvate ? JSON.parse(salvate) : [];
  });

  const [fase, setFase] = useState<"scegli" | "gestione" | "gioco">("scegli");
  const [immagineSelezionata, setImmagineSelezionata] = useState<string | null>(null);
  const [difficolta, setDifficolta] = useState(3); // 3, 4, o 5 (numero di divisioni sul lato più lungo)
  
  const [ordineAttuale, setOrdineAttuale] = useState<number[]>([]);
  const [pezzoSelezionato, setPezzoSelezionato] = useState<number | null>(null);
  const [mosse, setMosse] = useState(0);
  const [completato, setCompletato] = useState(false);
  const [dimensioniImmagine, setDimensioniImmagine] = useState<{ width: number; height: number } | null>(null);
  const [formatoRilevato, setFormatoRilevato] = useState<"quadrato" | "panoramico" | "verticale" | null>(null);
  
  // Salva immagini nel localStorage
  useEffect(() => {
    localStorage.setItem("stimolazione_cognitiva_puzzle_immagini", JSON.stringify(immaginiPuzzle));
  }, [immaginiPuzzle]);

  // Carica l'immagine e calcola le dimensioni e il formato
  useEffect(() => {
    if (immagineSelezionata) {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        setDimensioniImmagine({ width, height });
        
        // Rileva il formato dell'immagine
        const aspectRatio = width / height;
        if (Math.abs(aspectRatio - 1) < 0.1) {
          setFormatoRilevato("quadrato");
        } else if (aspectRatio > 1) {
          setFormatoRilevato("panoramico");
        } else {
          setFormatoRilevato("verticale");
        }
      };
      img.src = immagineSelezionata;
    } else {
      setDimensioniImmagine(null);
      setFormatoRilevato(null);
    }
  }, [immagineSelezionata]);
  const aggiungiImmagine = (url: string) => {
    setImmaginiPuzzle([...immaginiPuzzle, url]);
  };

  const rimuoviImmagine = (idx: number) => {
    setImmaginiPuzzle(immaginiPuzzle.filter((_, i) => i !== idx));
  };

  /**
   * Suggerisce le griglie più adatte in base al formato dell'immagine
   */
  const suggerisciGriglie = () => {
    if (!formatoRilevato || !dimensioniImmagine) {
      return [{ righe: 3, colonne: 3, label: "3×3" }];
    }

    const aspectRatio = dimensioniImmagine.width / dimensioniImmagine.height;
    
    if (formatoRilevato === "quadrato") {
      return [
        { righe: 3, colonne: 3, label: "3×3 (Facile)" },
        { righe: 4, colonne: 4, label: "4×4 (Medio)" },
        { righe: 5, colonne: 5, label: "5×5 (Difficile)" },
      ];
    } else if (formatoRilevato === "panoramico") {
      // Per immagini panoramiche, suggerisci griglie rettangolari
      if (aspectRatio > 1.5) {
        // Molto panoramica (es. 16:9, 2:1)
        return [
          { righe: 2, colonne: 4, label: "4×2 (Facile)" },
          { righe: 3, colonne: 5, label: "5×3 (Medio)" },
          { righe: 3, colonne: 6, label: "6×3 (Difficile)" },
        ];
      } else {
        // Leggermente panoramica (es. 4:3)
        return [
          { righe: 3, colonne: 4, label: "4×3 (Facile)" },
          { righe: 4, colonne: 5, label: "5×4 (Medio)" },
          { righe: 4, colonne: 6, label: "6×4 (Difficile)" },
        ];
      }
    } else {
      // Verticale
      if (aspectRatio < 0.67) {
        // Molto verticale (es. 9:16, 1:2)
        return [
          { righe: 4, colonne: 2, label: "2×4 (Facile)" },
          { righe: 5, colonne: 3, label: "3×5 (Medio)" },
          { righe: 6, colonne: 3, label: "3×6 (Difficile)" },
        ];
      } else {
        // Leggermente verticale (es. 3:4)
        return [
          { righe: 4, colonne: 3, label: "3×4 (Facile)" },
          { righe: 5, colonne: 4, label: "4×5 (Medio)" },
          { righe: 6, colonne: 4, label: "4×6 (Difficile)" },
        ];
      }
    }
  };

  /**
   * Calcola il numero di righe e colonne in base alla griglia selezionata
   */
  const calcolaGriglia = () => {
    if (!dimensioniImmagine) return { righe: 3, colonne: 3 };

    const aspectRatio = dimensioniImmagine.width / dimensioniImmagine.height;
    
    // Se l'immagine è più larga che alta (panoramica)
    if (aspectRatio > 1) {
      const colonne = difficolta;
      const righe = Math.round(difficolta / aspectRatio);
      return { righe: Math.max(2, righe), colonne };
    } 
    // Se l'immagine è più alta che larga (verticale)
    else if (aspectRatio < 1) {
      const righe = difficolta;
      const colonne = Math.round(difficolta * aspectRatio);
      return { righe, colonne: Math.max(2, colonne) };
    } 
    // Se l'immagine è quadrata
    else {
      return { righe: difficolta, colonne: difficolta };
    }
  };

  /**
   * Mescola l'array in modo che sia sempre risolvibile
   */
  const mescolaArray = (totalePezzi: number): number[] => {
    const arr = Array.from({ length: totalePezzi }, (_, i) => i);
    
    const numScambi = totalePezzi * 10;
    for (let i = 0; i < numScambi; i++) {
      const idx1 = Math.floor(Math.random() * arr.length);
      const idx2 = Math.floor(Math.random() * arr.length);
      if (idx1 !== idx2) {
        [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
      }
    }
    
    const giaRisolto = arr.every((val, idx) => val === idx);
    if (giaRisolto) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    
    return arr;
  };

  const iniziaPuzzle = (immagine: string, righe: number, colonne: number) => {
    setImmagineSelezionata(immagine);
    
    // Calcola la difficoltà come il massimo tra righe e colonne
    const diff = Math.max(righe, colonne);
    setDifficolta(diff);
    
    // Aspetta che le dimensioni dell'immagine siano caricate
    setTimeout(() => {
      const totalePezzi = righe * colonne;
      setOrdineAttuale(mescolaArray(totalePezzi));
      setPezzoSelezionato(null);
      setMosse(0);
      setCompletato(false);
      setFase("gioco");
    }, 100);
  };

  const gestisciClickTessera = (posizione: number) => {
    if (completato) return;

    if (pezzoSelezionato === null) {
      setPezzoSelezionato(posizione);
    } else if (pezzoSelezionato === posizione) {
      setPezzoSelezionato(null);
    } else {
      const nuovoOrdine = [...ordineAttuale];
      [nuovoOrdine[pezzoSelezionato], nuovoOrdine[posizione]] = 
        [nuovoOrdine[posizione], nuovoOrdine[pezzoSelezionato]];
      
      setOrdineAttuale(nuovoOrdine);
      setPezzoSelezionato(null);
      setMosse(mosse + 1);

      const isCompletato = nuovoOrdine.every((id, idx) => id === idx);
      if (isCompletato) {
        setCompletato(true);
      }
    }
  };

  // Schermata selezione
  if (fase === "scegli") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-8 space-y-6 my-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center">🧩 Puzzle</h2>

          {immaginiPuzzle.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-slate-600 mb-4">Nessuna immagine disponibile</p>
              <p className="text-sm text-slate-500">
                Il caregiver deve aggiungere immagini dalla sezione "Gestione Immagini"
              </p>
            </div>
          ) : (
            <>
              <p className="text-slate-600 text-center">Scegli un'immagine per il puzzle:</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {immaginiPuzzle.map((img, idx) => (
                  <div key={idx} className="space-y-2">
                    <img
                      src={img}
                      alt={`Puzzle ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg border-2 border-slate-200 hover:border-blue-500 cursor-pointer transition-colors"
                      onClick={() => {
                        setImmagineSelezionata(img);
                      }}
                    />
                    {immagineSelezionata === img && formatoRilevato && dimensioniImmagine && (
                      <div className="space-y-2">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-900">
                          <div className="font-semibold">
                            {formatoRilevato === "quadrato" && "📐 Formato: Quadrato"}
                            {formatoRilevato === "panoramico" && "🖼️ Formato: Panoramico"}
                            {formatoRilevato === "verticale" && "📱 Formato: Verticale"}
                          </div>
                          <div className="text-blue-700">
                            {dimensioniImmagine.width}×{dimensioniImmagine.height}px
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-700 text-center">Scegli la griglia:</p>
                        <div className="flex flex-col gap-2">
                          {suggerisciGriglie().map((griglia, gIdx) => (
                            <button
                              key={gIdx}
                              onClick={() => iniziaPuzzle(img, griglia.righe, griglia.colonne)}
                              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              {griglia.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setFase("gestione")}
              className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
            >
              ⚙️ Gestione Immagini
            </button>
            <button
              onClick={onChiudi}
              className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
            >
              ← Torna al Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Schermata gestione immagini
  if (fase === "gestione") {
    return (
      <div className="fixed inset-0 bg-slate-100 overflow-auto z-50">
        <div className="max-w-3xl mx-auto p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">⚙️ Gestione Immagini Puzzle</h2>
              <button
                onClick={() => setFase("scegli")}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
              >
                ← Indietro
              </button>
            </div>

            <GestioneImmaginiPuzzle
              immagini={immaginiPuzzle}
              onAggiungi={aggiungiImmagine}
              onRimuovi={rimuoviImmagine}
            />
          </div>
        </div>
      </div>
    );
  }

  // Schermata gioco
  const griglia = calcolaGriglia();
  const aspectRatio = dimensioniImmagine ? dimensioniImmagine.width / dimensioniImmagine.height : 1;

  return (
    <div className="fixed inset-0 bg-slate-100 overflow-auto z-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">🧩 Puzzle</h2>
            <p className="text-slate-600 text-sm mt-1">
              Mosse: {mosse} | Griglia: {griglia.colonne}×{griglia.righe}
            </p>
          </div>
          <button
            onClick={() => setFase("scegli")}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
          >
            ← Chiudi
          </button>
        </div>

        {/* Info formato immagine */}
        {formatoRilevato && dimensioniImmagine && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-900">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">
                  {formatoRilevato === "quadrato" && "📐 Quadrato"}
                  {formatoRilevato === "panoramico" && "🖼️ Panoramico"}
                  {formatoRilevato === "verticale" && "📱 Verticale"}
                </span>
                <span className="ml-2 text-blue-700">
                  ({dimensioniImmagine.width}×{dimensioniImmagine.height}px)
                </span>
              </div>
              <div className="text-blue-700">
                Tessere: {griglia.righe * griglia.colonne}
              </div>
            </div>
          </div>
        )}

        {/* Puzzle completato */}
        {completato && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-bold text-emerald-700 mb-2">Complimenti!</h3>
            <p className="text-emerald-600">
              Hai completato il puzzle in {mosse} mosse!
            </p>
          </div>
        )}

        {/* Griglia puzzle */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
          <div
            className="grid gap-1 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${griglia.colonne}, 1fr)`,
              gridTemplateRows: `repeat(${griglia.righe}, 1fr)`,
              maxWidth: "100%",
              aspectRatio: `${dimensioniImmagine?.width || 1} / ${dimensioniImmagine?.height || 1}`,
              overflow: "hidden",
            }}
          >
            {ordineAttuale.map((idPezzo, posizione) => {
              const isSelected = pezzoSelezionato === posizione;
              const rigaOrig = Math.floor(idPezzo / griglia.colonne);
              const colOrig = idPezzo % griglia.colonne;

              // Calcola la posizione del background per questa tessera
              // Ogni tessera mostra 1/colonne dell'immagine in orizzontale e 1/righe in verticale
              const bgSizeX = griglia.colonne * 100;
              const bgSizeY = griglia.righe * 100;
              const bgPosX = griglia.colonne > 1 ? (colOrig / (griglia.colonne - 1)) * 100 : 0;
              const bgPosY = griglia.righe > 1 ? (rigaOrig / (griglia.righe - 1)) * 100 : 0;

              return (
                <div
                  key={posizione}
                  onClick={() => gestisciClickTessera(posizione)}
                  className={`relative cursor-pointer rounded overflow-hidden transition-all ${
                    isSelected 
                      ? "ring-4 ring-blue-500 scale-95 z-10" 
                      : "hover:scale-98 hover:ring-2 hover:ring-blue-300"
                  }`}
                >
                  <div
                    className="w-full h-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${immagineSelezionata})`,
                      backgroundSize: `${bgSizeX}% ${bgSizeY}%`,
                      backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    }}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Anteprima immagine originale */}
        {immagineSelezionata && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">📷 Immagine originale:</h3>
            <div className="flex justify-center">
              <img
                src={immagineSelezionata}
                alt="Anteprima"
                className="max-w-full h-auto max-h-48 object-contain rounded-lg border-2 border-slate-200"
              />
            </div>
          </div>
        )}

        {/* Controlli */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => immagineSelezionata && iniziaPuzzle(immagineSelezionata, griglia.righe, griglia.colonne)}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            🔄 Ricomincia
          </button>
          <button
            onClick={() => setFase("scegli")}
            className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
          >
            📸 Cambia Immagine
          </button>
        </div>
      </div>
    </div>
  );
}
