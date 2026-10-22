import { useState, useEffect } from "react";
import { getProfiloPaziente } from "../data/profiloPaziente";

interface CellaCruciverba {
  lettera: string;
  numero?: number;
  attiva: boolean; // true = casella bianca (fa parte di una parola), false = casella nera
  rivelata: boolean;
}

interface CruciverbaProps {
  onChiudi: () => void;
}

/**
 * Genera un cruciverba semplice basato su parole e definizioni
 */
function generaCruciverba(parole: { parola: string; definizione: string }[]): {
  griglia: CellaCruciverba[][];
  paroleInserite: { parola: string; definizione: string; direzione: "orizzontale" | "verticale"; riga: number; colonna: number }[];
} {
  const dimensione = 15;
  
  // Inizializza griglia con tutte caselle nere (attiva: false)
  const griglia: CellaCruciverba[][] = Array(dimensione)
    .fill(null)
    .map(() =>
      Array(dimensione)
        .fill(null)
        .map(() => ({ lettera: "", attiva: false, rivelata: false }))
    );

  const paroleInserite: any[] = [];
  let numeroProgressivo = 1;

  // Funzione helper per verificare se una parola può essere inserita
  const puoInserireParola = (
    riga: number, 
    colonna: number, 
    parola: string, 
    direzione: "orizzontale" | "verticale"
  ): boolean => {
    const lunghezza = parola.length;
    
    // Controlla bounds
    if (direzione === "orizzontale") {
      if (colonna < 0 || colonna + lunghezza > dimensione) return false;
    } else {
      if (riga < 0 || riga + lunghezza > dimensione) return false;
    }

    // Controlla ogni casella della parola
    for (let k = 0; k < lunghezza; k++) {
      const r = direzione === "verticale" ? riga + k : riga;
      const c = direzione === "orizzontale" ? colonna + k : colonna;
      const cella = griglia[r][c];
      
      // Se la casella è già attiva e ha una lettera diversa, non va bene
      if (cella.attiva && cella.lettera !== "" && cella.lettera !== parola[k]) {
        return false;
      }
      
      // Se la casella è attiva e la lettera è vuota, controlla che non ci siano conflitti
      if (cella.attiva && cella.lettera === "") {
        return false;
      }
    }

    // Controlla caselle adiacenti (devono essere nere o fuori bounds)
    // Casella prima dell'inizio
    if (direzione === "orizzontale") {
      if (colonna > 0 && griglia[riga][colonna - 1].attiva) return false;
      if (colonna + lunghezza < dimensione && griglia[riga][colonna + lunghezza].attiva) return false;
    } else {
      if (riga > 0 && griglia[riga - 1][colonna].attiva) return false;
      if (riga + lunghezza < dimensione && griglia[riga + lunghezza][colonna].attiva) return false;
    }

    return true;
  };

  // Funzione helper per inserire una parola
  const inserisciParola = (
    riga: number, 
    colonna: number, 
    parola: string, 
    direzione: "orizzontale" | "verticale"
  ) => {
    for (let k = 0; k < parola.length; k++) {
      const r = direzione === "verticale" ? riga + k : riga;
      const c = direzione === "orizzontale" ? colonna + k : colonna;
      griglia[r][c].lettera = parola[k];
      griglia[r][c].attiva = true;
    }
  };

  // Inserisci la prima parola in orizzontale al centro
  if (parole.length > 0) {
    const primaParola = parole[0];
    const parolaUpper = primaParola.parola.toUpperCase();
    const riga = Math.floor(dimensione / 2);
    const colonna = Math.floor((dimensione - parolaUpper.length) / 2);

    inserisciParola(riga, colonna, parolaUpper, "orizzontale");
    griglia[riga][colonna].numero = numeroProgressivo;
    
    paroleInserite.push({
      ...primaParola,
      parola: parolaUpper,
      direzione: "orizzontale",
      riga,
      colonna,
      numero: numeroProgressivo,
    });
    numeroProgressivo++;
  }

  // Prova a inserire le altre parole
  for (let idx = 1; idx < parole.length && idx < 10; idx++) {
    const parolaObj = parole[idx];
    const parola = parolaObj.parola.toUpperCase();
    let inserita = false;

    // Cerca intersezioni con parole già inserite
    for (const parolaGia of paroleInserite) {
      if (inserita) break;

      const parolaGiaTesto = parolaGia.parola;
      const nuovaDirezione = parolaGia.direzione === "orizzontale" ? "verticale" : "orizzontale";

      // Prova ogni possibile intersezione
      for (let i = 0; i < parola.length && !inserita; i++) {
        for (let j = 0; j < parolaGiaTesto.length && !inserita; j++) {
          if (parola[i] === parolaGiaTesto[j]) {
            let nuovaRiga, nuovaColonna;

            if (nuovaDirezione === "verticale") {
              nuovaRiga = parolaGia.riga - i;
              nuovaColonna = parolaGia.colonna + j;
            } else {
              nuovaRiga = parolaGia.riga + j;
              nuovaColonna = parolaGia.colonna - i;
            }

            if (puoInserireParola(nuovaRiga, nuovaColonna, parola, nuovaDirezione)) {
              inserisciParola(nuovaRiga, nuovaColonna, parola, nuovaDirezione);

              if (!griglia[nuovaRiga][nuovaColonna].numero) {
                griglia[nuovaRiga][nuovaColonna].numero = numeroProgressivo;
                numeroProgressivo++;
              }

              paroleInserite.push({
                ...parolaObj,
                parola: parola,
                direzione: nuovaDirezione,
                riga: nuovaRiga,
                colonna: nuovaColonna,
                numero: griglia[nuovaRiga][nuovaColonna].numero,
              });

              inserita = true;
            }
          }
        }
      }
    }
  }

  return { griglia, paroleInserite };
}

/**
 * Parole predefinite basate sul profilo del paziente
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
    // Parole generiche basate sul mestiere
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
      { parola: "SAN SIRO", definizione: "Stadio dove gioca l'Inter" },
      { parola: "NERAZZURRI", definizione: "Soprannome dei tifosi dell'Inter" }
    );
  } else if (profilo.hobby.some((h: string) => h.toLowerCase().includes("milan"))) {
    parole.push(
      { parola: "MILAN", definizione: "Squadra di calcio" },
      { parola: "ROSSONERI", definizione: "Soprannome dei tifosi del Milan" },
      { parola: "SAN SIRO", definizione: "Stadio dove gioca il Milan" }
    );
  } else if (profilo.hobby.some((h: string) => h.toLowerCase().includes("juve"))) {
    parole.push(
      { parola: "JUVENTUS", definizione: "Squadra di calcio" },
      { parola: "BIANCONERI", definizione: "Soprannome dei tifosi della Juve" }
    );
  }

  if (profilo.hobby.some((h: string) => h.toLowerCase().includes("orto"))) {
    parole.push(
      { parola: "ORTO", definizione: "Dove si coltivano le verdure" },
      { parola: "POMODORO", definizione: "Verdura rossa estiva" },
      { parola: "ZAPPA", definizione: "Attrezzo per lavorare la terra" }
    );
  }

  if (profilo.hobby.some((h: string) => h.toLowerCase().includes("giardin"))) {
    parole.push(
      { parola: "FIORE", definizione: "Cresce nel giardino" },
      { parola: "ROSA", definizione: "Fiore con le spine" },
      { parola: "POTATORE", definizione: "Attrezzo per il giardino" }
    );
  }

  if (profilo.hobby.some((h: string) => h.toLowerCase().includes("pesca") || h.toLowerCase().includes("caccia"))) {
    parole.push(
      { parola: "LAGO", definizione: "Dove si pesca" },
      { parola: "CANN", definizione: "Attrezzo per pescare" }
    );
  }

  if (profilo.hobby.some((h: string) => h.toLowerCase().includes("cucin"))) {
    parole.push(
      { parola: "CUCINA", definizione: "Dove si preparano i pasti" },
      { parola: "PENTOLA", definizione: "Contenitore per cucinare" },
      { parola: "RICETTA", definizione: "Istruzioni per cucinare" }
    );
  }

  if (profilo.hobby.some((h: string) => h.toLowerCase().includes("musica") || h.toLowerCase().includes("cantar"))) {
    parole.push(
      { parola: "MUSICA", definizione: "Si ascolta con le orecchie" },
      { parola: "CANTARE", definizione: "Fare musica con la voce" }
    );
  }

  // Parole generiche
  parole.push(
    { parola: "FAMIGLIA", definizione: "Persone care" },
    { parola: "CASA", definizione: "Dove si abita" },
    { parola: "AMICO", definizione: "Persona a cui si vuole bene" },
    { parola: "SOLE", definizione: "Brilla in cielo di giorno" },
    { parola: "MARE", definizione: "Acqua salata" }
  );

  return parole.slice(0, 8);
}

export default function GiocoCruciverba({ onChiudi }: CruciverbaProps) {
  const [modalita, setModalita] = useState<"scegli" | "profilo" | "custom" | "gioco">("scegli");
  const [griglia, setGriglia] = useState<CellaCruciverba[][]>([]);
  const [paroleInserite, setParoleInserite] = useState<any[]>([]);
  const [cellaSelezionata, setCellaSelezionata] = useState<{ riga: number; colonna: number } | null>(null);
  const [risposteUtente, setRisposteUtente] = useState<{ [key: string]: string }>({});

  const iniziaDaProfilo = () => {
    const parole = generaParoleDaProfilo();
    const { griglia: nuovaGriglia, paroleInserite: nuoveParole } = generaCruciverba(parole);
    setGriglia(nuovaGriglia);
    setParoleInserite(nuoveParole);
    setModalita("gioco");
  };

  const iniziaCustom = (paroleCustom: { parola: string; definizione: string }[]) => {
    const { griglia: nuovaGriglia, paroleInserite: nuoveParole } = generaCruciverba(paroleCustom);
    setGriglia(nuovaGriglia);
    setParoleInserite(nuoveParole);
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

  const paroleOrizzontali = paroleInserite.filter((p) => p.direzione === "orizzontale").sort((a, b) => a.numero - b.numero);
  const paroleVerticali = paroleInserite.filter((p) => p.direzione === "verticale").sort((a, b) => a.numero - b.numero);

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

  return (
    <div className="fixed inset-0 bg-slate-100 overflow-auto z-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">🧩 Cruciverba</h2>
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
                {griglia.map((riga, rigaIdx) => (
                  <div key={rigaIdx} className="flex">
                    {riga.map((cella, colIdx) => {
                      const key = `${rigaIdx}-${colIdx}`;
                      const isSelected = cellaSelezionata?.riga === rigaIdx && cellaSelezionata?.colonna === colIdx;

                      return (
                        <div
                          key={colIdx}
                          onClick={() => cella.attiva && gestisciClickCella(rigaIdx, colIdx)}
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
              <h3 className="font-bold text-slate-900 mb-3">→ Orizzontali</h3>
              <div className="space-y-2">
                {paroleOrizzontali.map((p) => (
                  <div key={p.numero} className="text-sm">
                    <span className="font-bold text-blue-600">{p.numero}.</span>{" "}
                    <span className="text-slate-700">{p.definizione}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verticali */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="font-bold text-slate-900 mb-3">↓ Verticali</h3>
              <div className="space-y-2">
                {paroleVerticali.map((p) => (
                  <div key={p.numero} className="text-sm">
                    <span className="font-bold text-blue-600">{p.numero}.</span>{" "}
                    <span className="text-slate-700">{p.definizione}</span>
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
