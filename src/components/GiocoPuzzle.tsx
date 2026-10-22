import { useState, useEffect, useRef } from "react";

interface PezzoPuzzle {
  id: number;
  immagineUrl: string;
  posizioneCorretta: number;
  posizioneAttuale: number;
}

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
 */
export default function GiocoPuzzle({ onChiudi }: PuzzleProps) {
  const [immaginiPuzzle, setImmaginiPuzzle] = useState<string[]>(() => {
    const salvate = localStorage.getItem("stimolazione_cognitiva_puzzle_immagini");
    return salvate ? JSON.parse(salvate) : [];
  });

  const [fase, setFase] = useState<"scegli" | "gestione" | "gioco">("scegli");
  const [immagineSelezionata, setImmagineSelezionata] = useState<string | null>(null);
  const [pezzi, setPezzi] = useState<PezzoPuzzle[]>([]);
  const [dimensioneGriglia, setDimensioneGriglia] = useState(3); // 3x3, 4x4, etc.
  const [mosse, setMosse] = useState(0);
  const [completato, setCompletato] = useState(false);

  // Salva immagini nel localStorage
  useEffect(() => {
    localStorage.setItem("stimolazione_cognitiva_puzzle_immagini", JSON.stringify(immaginiPuzzle));
  }, [immaginiPuzzle]);

  const aggiungiImmagine = (url: string) => {
    setImmaginiPuzzle([...immaginiPuzzle, url]);
  };

  const rimuoviImmagine = (idx: number) => {
    setImmaginiPuzzle(immaginiPuzzle.filter((_, i) => i !== idx));
  };

  const iniziaPuzzle = (immagine: string, dimensione: number) => {
    setImmagineSelezionata(immagine);
    setDimensioneGriglia(dimensione);
    
    // Crea i pezzi del puzzle
    const totalePezzi = dimensione * dimensione;
    const nuoviPezzi: PezzoPuzzle[] = [];

    for (let i = 0; i < totalePezzi; i++) {
      nuoviPezzi.push({
        id: i,
        immagineUrl: immagine,
        posizioneCorretta: i,
        posizioneAttuale: i,
      });
    }

    // Mescola i pezzi
    for (let i = nuoviPezzi.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nuoviPezzi[i].posizioneAttuale, nuoviPezzi[j].posizioneAttuale] = [
        nuoviPezzi[j].posizioneAttuale,
        nuoviPezzi[i].posizioneAttuale,
      ];
    }

    setPezzi(nuoviPezzi);
    setMosse(0);
    setCompletato(false);
    setFase("gioco");
  };

  const gestisciClickPezzo = (pezzoCliccato: PezzoPuzzle) => {
    if (completato) return;

    // Trova la posizione vuota (ultimo pezzo)
    const posizioneVuota = dimensioneGriglia * dimensioneGriglia - 1;
    const pezzoVuoto = pezzi.find((p) => p.posizioneAttuale === posizioneVuota);
    
    if (!pezzoVuoto) return;

    // Controlla se il pezzo cliccato è adiacente alla posizione vuota
    const rigaCliccata = Math.floor(pezzoCliccato.posizioneAttuale / dimensioneGriglia);
    const colCliccata = pezzoCliccato.posizioneAttuale % dimensioneGriglia;
    const rigaVuota = Math.floor(posizioneVuota / dimensioneGriglia);
    const colVuota = posizioneVuota % dimensioneGriglia;

    const adiacente =
      (Math.abs(rigaCliccata - rigaVuota) === 1 && colCliccata === colVuota) ||
      (Math.abs(colCliccata - colVuota) === 1 && rigaCliccata === rigaVuota);

    if (adiacente) {
      // Scambia le posizioni
      const nuoviPezzi = pezzi.map((p) => {
        if (p.id === pezzoCliccato.id) {
          return { ...p, posizioneAttuale: posizioneVuota };
        }
        if (p.id === pezzoVuoto.id) {
          return { ...p, posizioneAttuale: pezzoCliccato.posizioneAttuale };
        }
        return p;
      });

      setPezzi(nuoviPezzi);
      setMosse(mosse + 1);

      // Controlla se il puzzle è completato
      const completato = nuoviPezzi.every((p) => p.posizioneAttuale === p.posizioneCorretta);
      if (completato) {
        setCompletato(true);
      }
    }
  };

  // Schermata selezione
  if (fase === "scegli") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-8 space-y-6">
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
                    {immagineSelezionata === img && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700 text-center">Difficoltà:</p>
                        <div className="flex gap-2">
                          {[3, 4, 5].map((dim) => (
                            <button
                              key={dim}
                              onClick={() => iniziaPuzzle(img, dim)}
                              className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              {dim}×{dim}
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
  return (
    <div className="fixed inset-0 bg-slate-100 overflow-auto z-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">🧩 Puzzle</h2>
            <p className="text-slate-600 text-sm mt-1">Mosse: {mosse}</p>
          </div>
          <button
            onClick={() => setFase("scegli")}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
          >
            ← Chiudi
          </button>
        </div>

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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div
            className="grid gap-1 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${dimensioneGriglia}, 1fr)`,
              maxWidth: "600px",
              aspectRatio: "1",
            }}
          >
            {Array.from({ length: dimensioneGriglia * dimensioneGriglia }).map((_, idx) => {
              const pezzo = pezzi.find((p) => p.posizioneAttuale === idx);
              const ultimoPezzo = idx === dimensioneGriglia * dimensioneGriglia - 1;

              if (!pezzo || (ultimoPezzo && pezzo.posizioneCorretta !== idx)) {
                return <div key={idx} className="bg-slate-200 rounded" />;
              }

              const rigaOrig = Math.floor(pezzo.posizioneCorretta / dimensioneGriglia);
              const colOrig = pezzo.posizioneCorretta % dimensioneGriglia;

              return (
                <div
                  key={idx}
                  onClick={() => gestisciClickPezzo(pezzo)}
                  className="relative cursor-pointer hover:opacity-80 transition-opacity rounded overflow-hidden"
                  style={{ aspectRatio: "1" }}
                >
                  <div
                    className="w-full h-full bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${pezzo.immagineUrl})`,
                      backgroundSize: `${dimensioneGriglia * 100}% ${dimensioneGriglia * 100}%`,
                      backgroundPosition: `${(colOrig / (dimensioneGriglia - 1)) * 100}% ${(rigaOrig / (dimensioneGriglia - 1)) * 100}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Controlli */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => immagineSelezionata && iniziaPuzzle(immagineSelezionata, dimensioneGriglia)}
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
