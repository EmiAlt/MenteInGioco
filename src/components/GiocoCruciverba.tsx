import { useState, useEffect, useMemo } from "react";
import { getProfiloPaziente } from "../data/profiloPaziente";

interface CellaCruciverba {
  lettera: string;
  numero?: number;
  attiva: boolean;
}

interface ParolaInserita {
  parola: string;
  definizione: string;
  direzione: "orizzontale" | "verticale";
  riga: number;
  colonna: number;
  numero?: number;
}

import { ThemeType } from '../hooks/useTheme';

interface CruciverbaProps {
  onChiudi: () => void;
  theme?: ThemeType;
}

/**
 * Genera un cruciverba con algoritmo completamente rivisto:
 * 1. Filtra parole brevi (4-8 lettere)
 * 2. Ordina per lunghezza decrescente
 * 3. Posiziona la prima al centro (orizzontale)
 * 4. Per ogni parola successiva, cerca intersezioni valide
 * 5. Valida rigorosamente che non ci siano lettere adiacenti illegali
 * 6. Bilancia orizzontali e verticali
 */
function generaCruciverba(paroleInput: { parola: string; definizione: string }[]): {
  griglia: CellaCruciverba[][];
  paroleInserite: ParolaInserita[];
  boundingBox: { minRiga: number; maxRiga: number; minCol: number; maxCol: number };
} {
  const RIGHE = 15;
  const COLONNE = 15;
  
  // Inizializza griglia con tutte caselle nere
  const griglia: CellaCruciverba[][] = Array(RIGHE)
    .fill(null)
    .map(() =>
      Array(COLONNE)
        .fill(null)
        .map(() => ({ lettera: "", attiva: false }))
    );

  const paroleInserite: ParolaInserita[] = [];

  // FILTRO 1: Solo parole brevi e semplici (4-8 lettere)
  const paroleFiltrate = [...paroleInput]
    .map(p => ({ ...p, parola: p.parola.toUpperCase().replace(/[^A-Z]/g, '') }))
    .filter(p => p.parola.length >= 4 && p.parola.length <= 8);

  // FILTRO 2: Ordina per lunghezza decrescente
  const paroleOrdinate = paroleFiltrate
    .sort((a, b) => b.parola.length - a.parola.length)
    .slice(0, 16); // Max 16 parole per avere buon bilanciamento

  if (paroleOrdinate.length === 0) {
    return {
      griglia,
      paroleInserite: [],
      boundingBox: { minRiga: 0, maxRiga: 0, minCol: 0, maxCol: 0 }
    };
  }

  /**
   * Verifica se una parola può essere posizionata nella griglia
   * Controlla che non ci siano lettere adiacenti illegali
   */
  function puòPosizionareParola(
    parola: string,
    riga: number,
    colonna: number,
    direzione: "orizzontale" | "verticale"
  ): boolean {
    const lunghezza = parola.length;

    // Controlla bounds
    if (direzione === "orizzontale") {
      if (colonna < 0 || colonna + lunghezza > COLONNE) return false;
    } else {
      if (riga < 0 || riga + lunghezza > RIGHE) return false;
    }

    // Controlla ogni cella della parola
    for (let k = 0; k < lunghezza; k++) {
      const r = direzione === "verticale" ? riga + k : riga;
      const c = direzione === "orizzontale" ? colonna + k : colonna;
      const cella = griglia[r][c];

      // Se la cella è già attiva
      if (cella.attiva) {
        // Deve avere la stessa lettera (intersezione valida)
        if (cella.lettera !== parola[k]) return false;
      } else {
        // La cella è nera: controlla che non ci siano lettere adiacenti illegali
        // Controlla celle adiacenti (non in diagonale)
        const adiacenti = [
          [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
        ];

        for (const [ar, ac] of adiacenti) {
          if (ar >= 0 && ar < RIGHE && ac >= 0 && ac < COLONNE) {
            const cellaAdiacente = griglia[ar][ac];
            // Se c'è una lettera adiacente, è illegale (creerebbe una parola di 2 lettere)
            if (cellaAdiacente.attiva && cellaAdiacente.lettera !== '') {
              // Eccezione: se è un'intersezione valida con un'altra parola
              const èIntersezione = paroleInserite.some(p => {
                if (p.direzione === direzione) return false; // Stessa direzione
                const pRiga = p.riga;
                const pColonna = p.colonna;
                const pLunghezza = p.parola.length;
                
                if (p.direzione === "orizzontale") {
                  return r === pRiga && c >= pColonna && c < pColonna + pLunghezza;
                } else {
                  return c === pColonna && r >= pRiga && r < pRiga + pLunghezza;
                }
              });
              
              if (!èIntersezione) return false;
            }
          }
        }
      }
    }

    // Controlla che la parola abbia almeno un'intersezione (non sia isolata)
    if (paroleInserite.length > 0) {
      let haIntersezione = false;
      for (let k = 0; k < lunghezza; k++) {
        const r = direzione === "verticale" ? riga + k : riga;
        const c = direzione === "orizzontale" ? colonna + k : colonna;
        if (griglia[r][c].attiva && griglia[r][c].lettera === parola[k]) {
          haIntersezione = true;
          break;
        }
      }
      if (!haIntersezione) return false;
    }

    return true;
  }

  /**
   * Posiziona una parola nella griglia
   */
  function posizionaParola(
    parola: string,
    riga: number,
    colonna: number,
    direzione: "orizzontale" | "verticale"
  ) {
    for (let k = 0; k < parola.length; k++) {
      const r = direzione === "verticale" ? riga + k : riga;
      const c = direzione === "orizzontale" ? colonna + k : colonna;
      griglia[r][c].lettera = parola[k];
      griglia[r][c].attiva = true;
    }
  }

  // POSIZIONA LA PRIMA PAROLA al centro orizzontalmente
  const primaParola = paroleOrdinate[0];
  const rigaCentro = Math.floor(RIGHE / 2);
  const colonnaCentro = Math.floor((COLONNE - primaParola.parola.length) / 2);

  posizionaParola(primaParola.parola, rigaCentro, colonnaCentro, "orizzontale");
  paroleInserite.push({
    parola: primaParola.parola,
    definizione: primaParola.definizione,
    direzione: "orizzontale",
    riga: rigaCentro,
    colonna: colonnaCentro,
  });

  // POSIZIONA LE ALTRE PAROLE cercando intersezioni valide
  for (let idx = 1; idx < paroleOrdinate.length; idx++) {
    const parolaObj = paroleOrdinate[idx];
    const parola = parolaObj.parola;
    
    let posizionamentoTrovato = false;

    // Prova tutte le parole già inserite
    for (const parolaGia of paroleInserite) {
      if (posizionamentoTrovato) break;

      const direzioneNuova = parolaGia.direzione === "orizzontale" ? "verticale" : "orizzontale";

      // Prova ogni possibile intersezione
      for (let i = 0; i < parola.length && !posizionamentoTrovato; i++) {
        for (let j = 0; j < parolaGia.parola.length && !posizionamentoTrovato; j++) {
          // Controlla se le lettere coincidono
          if (parola[i] !== parolaGia.parola[j]) continue;

          let rigaNuova, colNuova;

          if (direzioneNuova === "verticale") {
            rigaNuova = parolaGia.riga - i;
            colNuova = parolaGia.colonna + j;
          } else {
            rigaNuova = parolaGia.riga + j;
            colNuova = parolaGia.colonna - i;
          }

          // Verifica se il posizionamento è valido
          if (puòPosizionareParola(parola, rigaNuova, colNuova, direzioneNuova)) {
            posizionaParola(parola, rigaNuova, colNuova, direzioneNuova);
            paroleInserite.push({
              parola,
              definizione: parolaObj.definizione,
              direzione: direzioneNuova,
              riga: rigaNuova,
              colonna: colNuova,
            });
            posizionamentoTrovato = true;
          }
        }
      }
    }
  }

  // NUMERA le caselle da sinistra a destra, dall'alto in basso
  let numeroProgressivo = 1;
  for (let r = 0; r < RIGHE; r++) {
    for (let c = 0; c < COLONNE; c++) {
      if (!griglia[r][c].attiva) continue;

      const èInizioOrizzontale = 
        (c === 0 || !griglia[r][c - 1].attiva) && 
        (c + 1 < COLONNE && griglia[r][c + 1].attiva);
      
      const èInizioVerticale = 
        (r === 0 || !griglia[r - 1][c].attiva) && 
        (r + 1 < RIGHE && griglia[r + 1][c].attiva);

      if (èInizioOrizzontale || èInizioVerticale) {
        griglia[r][c].numero = numeroProgressivo;
        
        // Aggiorna le parole inserite con il numero corretto
        for (const parola of paroleInserite) {
          if (parola.riga === r && parola.colonna === c) {
            parola.numero = numeroProgressivo;
          }
        }
        
        numeroProgressivo++;
      }
    }
  }

  // Calcola bounding box
  let minRiga = RIGHE, maxRiga = 0, minCol = COLONNE, maxCol = 0;
  for (let r = 0; r < RIGHE; r++) {
    for (let c = 0; c < COLONNE; c++) {
      if (griglia[r][c].attiva) {
        minRiga = Math.min(minRiga, r);
        maxRiga = Math.max(maxRiga, r);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
      }
    }
  }

  return { 
    griglia, 
    paroleInserite,
    boundingBox: { minRiga, maxRiga, minCol, maxCol }
  };
}

/**
 * Parole predefinite basate sul profilo del paziente
 * FILTRO: Solo parole brevi e semplici (4-8 lettere)
 */
function generaParoleDaProfilo(): { parola: string; definizione: string }[] {
  const profilo = getProfiloPaziente();
  const parole: { parola: string; definizione: string }[] = [];

  // Parole basate sul mestiere
  if (profilo.exMestiere.toLowerCase().includes("falegname")) {
    parole.push(
      { parola: "LEGNO", definizione: `Materiale con cui lavorava ${profilo.nome}` },
      { parola: "SEGA", definizione: "Attrezzo per tagliare il legno" },
      { parola: "MARTELLO", definizione: "Attrezzo per battere i chiodi" },
      { parola: "NOCE", definizione: "Tipo di legno pregiato" }
    );
  } else if (profilo.exMestiere.toLowerCase().includes("insegn")) {
    parole.push(
      { parola: "SCUOLA", definizione: `Dove lavorava ${profilo.nome}` },
      { parola: "LIBRO", definizione: "Si legge per imparare" },
      { parola: "ALUNNO", definizione: "Chi va a scuola" },
      { parola: "MAESTRA", definizione: "Chi insegna ai bambini" }
    );
  } else if (profilo.exMestiere.toLowerCase().includes("medic") || profilo.exMestiere.toLowerCase().includes("dottor")) {
    parole.push(
      { parola: "OSPEDALE", definizione: `Dove lavorava ${profilo.nome}` },
      { parola: "DOTTORE", definizione: "Chi cura i malati" },
      { parola: "MEDICINA", definizione: "Si prende per guarire" },
      { parola: "PAZIENTE", definizione: "Chi viene curato" }
    );
  } else if (profilo.exMestiere) {
    parole.push(
      { parola: "LAVORO", definizione: `Il mestiere di ${profilo.nome}` },
      { parola: "UFFICIO", definizione: "Dove si lavora" },
      { parola: "COLLEGA", definizione: "Chi lavora con te" }
    );
  }

  // Parole basate sugli hobby
  if (profilo.hobby.some((h: string) => h.toLowerCase().includes("inter"))) {
    parole.push(
      { parola: "INTER", definizione: "Squadra di calcio del cuore" },
      { parola: "GOL", definizione: "Segnare nella porta" },
      { parola: "PALLONE", definizione: "Si calcola con il piede" }
    );
  }

  if (profilo.hobby.some((h: string) => h.toLowerCase().includes("orto"))) {
    parole.push(
      { parola: "ORTO", definizione: "Dove si coltivano le verdure" },
      { parola: "POMODORO", definizione: "Verdura rossa estiva" },
      { parola: "ZAPPA", definizione: "Attrezzo per lavorare la terra" }
    );
  }

  // Parole generiche semplici e brevi
  parole.push(
    { parola: "CANE", definizione: "Animale che abbaia" },
    { parola: "GATTO", definizione: "Animale che fa le fusa" },
    { parola: "PANE", definizione: "Si mangia a tavola" },
    { parola: "VINO", definizione: "Bevanda rossa o bianca" },
    { parola: "LUNA", definizione: "Brilla nel cielo di notte" },
    { parola: "STELLA", definizione: "Brilla in cielo" },
    { parola: "MANO", definizione: "Si usa per prendere" },
    { parola: "VISO", definizione: "La faccia" },
    { parola: "CUORE", definizione: "Batte nel petto" },
    { parola: "AMORE", definizione: "Sentimento forte" },
    { parola: "TEMPO", definizione: "Scorre veloce" },
    { parola: "VITA", definizione: "Esistere" },
    { parola: "PACE", definizione: "Assenza di guerra" },
    { parola: "GIOIA", definizione: "Felicità" },
    { parola: "FIUME", definizione: "Acqua che scorre" },
    { parola: "MONTE", definizione: "Rilievo terrestre" },
    { parola: "PIANTA", definizione: "Cresce nel giardino" },
    { parola: "FIORE", definizione: "Profumato e colorato" },
    { parola: "ALBERO", definizione: "Ha foglie e rami" },
    { parola: "CASA", definizione: "Dove si abita" },
    { parola: "PORTA", definizione: "Si apre e si chiude" },
    { parola: "TETTO", definizione: "Copre la casa" },
    { parola: "TAVOLO", definizione: "Si mangia sopra" },
    { parola: "SEDIA", definizione: "Ci si siede sopra" }
  );

  return parole.slice(0, 20); // Aumentato per avere più scelta
}

export default function GiocoCruciverba({ onChiudi, theme = 'light' }: CruciverbaProps) {
  const [modalita, setModalita] = useState<"scegli" | "profilo" | "custom" | "gioco">("scegli");
  const [griglia, setGriglia] = useState<CellaCruciverba[][]>([]);
  const [paroleInserite, setParoleInserite] = useState<ParolaInserita[]>([]);
  const [boundingBox, setBoundingBox] = useState({ minRiga: 0, maxRiga: 14, minCol: 0, maxCol: 14 });
  const [cellaSelezionata, setCellaSelezionata] = useState<{ riga: number; colonna: number } | null>(null);
  const [risposteUtente, setRisposteUtente] = useState<{ [key: string]: string }>({});

  const iniziaDaProfilo = () => {
    const parole = generaParoleDaProfilo();
    const { griglia: nuovaGriglia, paroleInserite: nuoveParole, boundingBox: bb } = generaCruciverba(parole);
    setGriglia(nuovaGriglia);
    setParoleInserite(nuoveParole);
    setBoundingBox(bb);
    setModalita("gioco");
  };

  const iniziaCustom = (paroleCustom: { parola: string; definizione: string }[]) => {
    const { griglia: nuovaGriglia, paroleInserite: nuoveParole, boundingBox: bb } = generaCruciverba(paroleCustom);
    setGriglia(nuovaGriglia);
    setParoleInserite(nuoveParole);
    setBoundingBox(bb);
    setModalita("gioco");
  };

  const gestisciClickCella = (riga: number, colonna: number) => {
    if (!griglia[riga][colonna].attiva) return;
    setCellaSelezionata({ riga, colonna });
  };

  const gestisciInputLettera = (lettera: string) => {
    if (!cellaSelezionata) return;
    const key = `${cellaSelezionata.riga}-${cellaSelezionata.colonna}`;
    setRisposteUtente((prev) => ({ ...prev, [key]: lettera.toUpperCase().slice(0, 1) }));
  };

  // Filtra e ordina parole per i pannelli
  const paroleOrizzontali = useMemo(() => 
    paroleInserite
      .filter((p) => p.direzione === "orizzontale" && p.numero)
      .sort((a, b) => (a.numero || 0) - (b.numero || 0)),
    [paroleInserite]
  );

  const paroleVerticali = useMemo(() => 
    paroleInserite
      .filter((p) => p.direzione === "verticale" && p.numero)
      .sort((a, b) => (a.numero || 0) - (b.numero || 0)),
    [paroleInserite]
  );

  if (modalita === "scegli") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center">🧩 Cruciverba</h2>
          <p className="text-slate-600 text-center">Scegli come generare il cruciverba:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={iniziaDaProfilo}
              className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all"
            >
              <div className="text-4xl mb-2">👤</div>
              <div className="font-bold text-lg mb-1">Basato sul Profilo</div>
              <div className="text-sm opacity-90">Parole legate ai ricordi di {getProfiloPaziente().nome}</div>
            </button>

            <button
              onClick={() => setModalita("custom")}
              className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all"
            >
              <div className="text-4xl mb-2">✏️</div>
              <div className="font-bold text-lg mb-1">Personalizzato</div>
              <div className="text-sm opacity-90">Inserisci parole e definizioni</div>
            </button>
          </div>

          <button
            onClick={onChiudi}
            className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
          >
            ← Torna al Menu
          </button>
        </div>
      </div>
    );
  }

  if (modalita === "custom") {
    return <CruciverbaCustom onIndietro={() => setModalita("scegli")} onGenera={iniziaCustom} onChiudi={onChiudi} />;
  }

  // Calcola la griglia da mostrare (crop attorno al bounding box)
  const grigliaCrop = griglia.slice(boundingBox.minRiga, boundingBox.maxRiga + 1).map(riga => 
    riga.slice(boundingBox.minCol, boundingBox.maxCol + 1)
  );

  return (
    <div className="fixed inset-0 bg-slate-100 overflow-auto z-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>🧩 Cruciverba</h2>
          <button
            onClick={onChiudi}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
          >
            ← Chiudi
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Griglia */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-max">
                {grigliaCrop.map((riga, rigaIdx) => (
                  <div key={rigaIdx} className="flex">
                    {riga.map((cella, colIdx) => {
                      const rigaOriginale = boundingBox.minRiga + rigaIdx;
                      const colOriginale = boundingBox.minCol + colIdx;
                      const key = `${rigaOriginale}-${colOriginale}`;
                      const isSelected = cellaSelezionata?.riga === rigaOriginale && cellaSelezionata?.colonna === colOriginale;

                      return (
                        <div
                          key={colIdx}
                          onClick={() => cella.attiva && gestisciClickCella(rigaOriginale, colOriginale)}
                          className={`w-10 h-10 md:w-12 md:h-12 border border-slate-300 relative ${
                            cella.attiva 
                              ? "bg-white cursor-pointer hover:bg-blue-50" 
                              : "bg-slate-800"
                          } ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
                        >
                          {cella.numero && (
                            <span className="absolute top-0 left-0.5 text-xs text-slate-500 font-bold">
                              {cella.numero}
                            </span>
                          )}
                          {cella.attiva && (
                            <input
                              type="text"
                              maxLength={1}
                              value={risposteUtente[key] || ""}
                              onChange={(e) => gestisciInputLettera(e.target.value)}
                              className="w-full h-full text-center text-lg md:text-xl font-bold uppercase bg-transparent focus:outline-none"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Definizioni */}
          <div className="space-y-4">
            {/* Orizzontali */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className={`font-bold mb-3 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>→ Orizzontali</h3>
              <div className="space-y-2">
                {paroleOrizzontali.map((p) => (
                  <div key={p.numero} className="text-sm">
                    <span className="font-bold text-blue-600">{p.numero}.</span>{" "}
                    <span className={`transition-colors duration-300 ${
                      theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                    }`}>{p.definizione}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verticali */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className={`font-bold mb-3 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>↓ Verticali</h3>
              <div className="space-y-2">
                {paroleVerticali.map((p) => (
                  <div key={p.numero} className="text-sm">
                    <span className="font-bold text-blue-600">{p.numero}.</span>{" "}
                    <span className={`transition-colors duration-300 ${
                      theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                    }`}>{p.definizione}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente per inserire parole e definizioni personalizzate
 */
function CruciverbaCustom({
  onIndietro,
  onGenera,
  onChiudi,
}: {
  onIndietro: () => void;
  onGenera: (parole: { parola: string; definizione: string }[]) => void;
  onChiudi: () => void;
}) {
  const [parole, setParole] = useState<{ parola: string; definizione: string }[]>([
    { parola: "", definizione: "" },
  ]);

  const aggiungiParola = () => {
    setParole([...parole, { parola: "", definizione: "" }]);
  };

  const rimuoviParola = (idx: number) => {
    setParole(parole.filter((_, i) => i !== idx));
  };

  const aggiornaParola = (idx: number, campo: "parola" | "definizione", valore: string) => {
    const nuoveParole = [...parole];
    nuoveParole[idx][campo] = valore;
    setParole(nuoveParole);
  };

  const genera = () => {
    const paroleValide = parole.filter((p) => p.parola.trim() && p.definizione.trim());
    if (paroleValide.length < 2) {
      alert("Inserisci almeno 2 parole con le loro definizioni");
      return;
    }
    onGenera(paroleValide);
  };

  return (
    <div className="fixed inset-0 bg-slate-100 overflow-auto z-50">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">✏️ Cruciverba Personalizzato</h2>

          <div className="space-y-4 mb-6">
            {parole.map((p, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Parola {idx + 1}</span>
                  {parole.length > 1 && (
                    <button
                      onClick={() => rimuoviParola(idx)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      🗑️ Rimuovi
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Parola (es. MARE)"
                  value={p.parola}
                  onChange={(e) => aggiornaParola(idx, "parola", e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="Definizione (es. Acqua salata)"
                  value={p.definizione}
                  onChange={(e) => aggiornaParola(idx, "definizione", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            ))}
          </div>

          <button
            onClick={aggiungiParola}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors mb-4"
          >
            + Aggiungi Parola
          </button>

          <div className="flex gap-3">
            <button
              onClick={onIndietro}
              className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
            >
              ← Indietro
            </button>
            <button
              onClick={genera}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium rounded-lg transition-colors"
            >
              🎯 Genera Cruciverba
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
