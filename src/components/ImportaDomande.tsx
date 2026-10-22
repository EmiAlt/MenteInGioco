import { useState } from "react";
import { Domanda } from "../data/questions";
import { useDomandeCustom } from "../hooks/useDomandeCustom";

/**
 * Formato di input supportato per l'importazione domande:
 * 
 * Ogni domanda è separata da una linea vuota.
 * Formato:
 *   DOMANDA: [testo della domanda]
 *   A) [opzione 1]
 *   B) [opzione 2]
 *   C) [opzione 3]
 *   RISPOSTA: [A, B o C]
 * 
 * Esempio:
 *   DOMANDA: Qual è la capitale d'Italia?
 *   A) Milano
 *   B) Roma
 *   C) Napoli
 *   RISPOSTA: B
 */

interface ImportaDomandeProps {
  onDomandeImportate: (domande: Domanda[]) => void;
}

export default function ImportaDomande({ onDomandeImportate }: ImportaDomandeProps) {
  const [domandeCustom, , aggiungiDomandeCustom, cancellaDomandeCustom] = useDomandeCustom();
  const [testoInput, setTestoInput] = useState("");
  const [errore, setErrore] = useState<string | null>(null);
  const [successo, setSuccesso] = useState<string | null>(null);
  const [anteprima, setAnteprima] = useState<Domanda[] | null>(null);

  /**
   * Parsa il testo incollato e restituisce un array di Domanda
   */
  const parseDomande = (testo: string): Domanda[] => {
    const blocchi = testo.trim().split(/\n\s*\n/);
    const domande: Domanda[] = [];

    blocchi.forEach((blocco, idx) => {
      const righe = blocco.trim().split("\n").map((r) => r.trim());
      
      let testoDomanda = "";
      const opzioni: string[] = [];
      let rispostaCorretta = -1;

      for (const riga of righe) {
        if (riga.startsWith("DOMANDA:") || riga.startsWith("Domanda:")) {
          testoDomanda = riga.replace(/^(DOMANDA|Domanda):\s*/i, "").trim();
        } else if (riga.match(/^[Aa]\)\s*/)) {
          opzioni[0] = riga.replace(/^[Aa]\)\s*/, "").trim();
        } else if (riga.match(/^[Bb]\)\s*/)) {
          opzioni[1] = riga.replace(/^[Bb]\)\s*/, "").trim();
        } else if (riga.match(/^[Cc]\)\s*/)) {
          opzioni[2] = riga.replace(/^[Cc]\)\s*/, "").trim();
        } else if (riga.startsWith("RISPOSTA:") || riga.startsWith("Risposta:")) {
          const risposta = riga.replace(/^(RISPOSTA|Risposta):\s*/i, "").trim().toUpperCase();
          if (risposta === "A") rispostaCorretta = 0;
          else if (risposta === "B") rispostaCorretta = 1;
          else if (risposta === "C") rispostaCorretta = 2;
        }
      }

      // Validazione
      if (!testoDomanda) {
        throw new Error(`Blocco ${idx + 1}: manca il testo della domanda (DOMANDA: ...)`);
      }
      if (opzioni.length !== 3 || opzioni.some((o) => !o)) {
        throw new Error(`Blocco ${idx + 1}: servono esattamente 3 opzioni (A, B, C)`);
      }
      if (rispostaCorretta < 0) {
        throw new Error(`Blocco ${idx + 1}: manca o è errata la risposta corretta (RISPOSTA: A/B/C)`);
      }

      domande.push({
        id: `custom-${Date.now()}-${idx}`,
        testoDomanda,
        opzioni: [opzioni[0], opzioni[1], opzioni[2]],
        rispostaCorretta,
        categoria: "memoria",
        livelloDifficolta: 1,
      });
    });

    return domande;
  };

  /**
   * Gestisce il click su "Anteprima"
   */
  const handleAnteprima = () => {
    setErrore(null);
    setSuccesso(null);

    if (!testoInput.trim()) {
      setErrore("Incolla prima il testo delle domande");
      setAnteprima(null);
      return;
    }

    try {
      const domandeParsate = parseDomande(testoInput);
      setAnteprima(domandeParsate);
      setSuccesso(`✅ ${domandeParsate.length} domande valide trovate!`);
    } catch (err: any) {
      setErrore(`❌ ${err.message}`);
      setAnteprima(null);
    }
  };

  /**
   * Gestisce l'importazione effettiva
   */
  const handleImporta = () => {
    if (!anteprima || anteprima.length === 0) return;

    aggiungiDomandeCustom(anteprima);
    onDomandeImportate(anteprima);
    
    setTestoInput("");
    setAnteprima(null);
    setSuccesso(`✅ ${anteprima.length} domande importate con successo!`);
    setErrore(null);

    setTimeout(() => setSuccesso(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>📝</span>
          Importa Domande Personalizzate
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {/* Istruzioni */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            📋 Formato di importazione
          </h3>
          <p className="text-xs text-slate-600 mb-2">
            Incolla le domande nel formato seguente. Separa ogni domanda con una riga vuota:
          </p>
          <pre className="text-xs text-slate-700 bg-white p-3 rounded border border-slate-200 overflow-x-auto">
{`DOMANDA: Qual è la capitale d'Italia?
A) Milano
B) Roma
C) Napoli
RISPOSTA: B

DOMANDA: Quanto fa 2 + 2?
A) 3
B) 5
C) 4
RISPOSTA: C`}
          </pre>
        </div>

        {/* Textarea per incollare */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Incolla qui le tue domande
          </label>
          <textarea
            value={testoInput}
            onChange={(e) => {
              setTestoInput(e.target.value);
              setAnteprima(null);
              setErrore(null);
              setSuccesso(null);
            }}
            rows={10}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors font-mono text-sm"
            placeholder="DOMANDA: La tua domanda qui...&#10;A) Opzione 1&#10;B) Opzione 2&#10;C) Opzione 3&#10;RISPOSTA: B"
          />
        </div>

        {/* Messaggi di errore/successo */}
        {errore && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {errore}
          </div>
        )}
        {successo && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700">
            {successo}
          </div>
        )}

        {/* Pulsanti azione */}
        <div className="flex gap-3">
          <button
            onClick={handleAnteprima}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
          >
            🔍 Anteprima
          </button>
          <button
            onClick={handleImporta}
            disabled={!anteprima || anteprima.length === 0}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            📥 Importa ({anteprima?.length || 0})
          </button>
        </div>

        {/* Anteprima domande */}
        {anteprima && anteprima.length > 0 && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700">
                Anteprima ({anteprima.length} domande)
              </h4>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {anteprima.map((d, idx) => (
                <div key={idx} className="p-3 hover:bg-slate-50">
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    {idx + 1}. {d.testoDomanda}
                  </p>
                  <div className="text-xs text-slate-600 space-y-0.5">
                    {d.opzioni.map((op, opIdx) => (
                      <p
                        key={opIdx}
                        className={
                          opIdx === d.rispostaCorretta
                            ? "text-emerald-700 font-medium"
                            : ""
                        }
                      >
                        {String.fromCharCode(65 + opIdx)}) {op}
                        {opIdx === d.rispostaCorretta && " ✓"}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domande custom esistenti */}
        {domandeCustom.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-700">
                📚 Domande importate ({domandeCustom.length})
              </h4>
              <button
                onClick={() => {
                  if (confirm("Sei sicuro di voler cancellare tutte le domande importate?")) {
                    cancellaDomandeCustom();
                  }
                }}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
              >
                🗑️ Cancella tutte
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {domandeCustom.slice(0, 10).map((d, idx) => (
                <div
                  key={d.id}
                  className="text-xs text-slate-600 bg-slate-50 px-2 py-1.5 rounded"
                >
                  <span className="font-medium text-slate-700">{idx + 1}.</span>{" "}
                  {d.testoDomanda.substring(0, 60)}
                  {d.testoDomanda.length > 60 ? "..." : ""}
                </div>
              ))}
              {domandeCustom.length > 10 && (
                <p className="text-xs text-slate-500 text-center py-1">
                  ... e altre {domandeCustom.length - 10} domande
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
