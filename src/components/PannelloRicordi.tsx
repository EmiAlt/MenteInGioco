import { useState, useRef, useEffect } from "react";
import { useRicordi } from "../hooks/useRicordi";
import { calcolaDimensioneLocalStorage, formattaDimensione } from "../utils/imageCompression";

interface PannelloRicordiProps {
  onChiudi: () => void;
}

export default function PannelloRicordi({ onChiudi }: PannelloRicordiProps) {
  const { ricordi, salvaRicordo, eliminaRicordo, modificaRicordo } = useRicordi();
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [descrizioneCorretta, setDescrizioneCorretta] = useState("");
  const [descrizioneSbagliata1, setDescrizioneSbagliata1] = useState("");
  const [descrizioneSbagliata2, setDescrizioneSbagliata2] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ricordoDaModificare, setRicordoDaModificare] = useState<string | null>(null);
  const [messaggioSuccesso, setMessaggioSuccesso] = useState<string | null>(null);
  const [dimensioneStorage, setDimensioneStorage] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calcola la dimensione dello storage
  useEffect(() => {
    const aggiornaDimensione = () => {
      setDimensioneStorage(calcolaDimensioneLocalStorage());
    };
    
    aggiornaDimensione();
    
    // Aggiorna ogni volta che cambiano i ricordi
    const interval = setInterval(aggiornaDimensione, 1000);
    return () => clearInterval(interval);
  }, [ricordi]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFotoBase64(base64);
      console.log("[PANNELLO RICORDI] 📷 Foto caricata, dimensione:", base64.length, "bytes");
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFotoBase64(null);
    setDescrizioneCorretta("");
    setDescrizioneSbagliata1("");
    setDescrizioneSbagliata2("");
    setCategoria("");
    setRicordoDaModificare(null);
    setMessaggioSuccesso(null);
    // Reset del file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      // Forza il reset del value per permettere di caricare lo stesso file di nuovo
      fileInputRef.current.type = "";
      fileInputRef.current.type = "file";
    }
  };

  const handleSalva = async () => {
    if (!fotoBase64 || !descrizioneCorretta.trim() || !descrizioneSbagliata1.trim() || !descrizioneSbagliata2.trim()) {
      alert("Inserisci una foto e tutte e 3 le descrizioni");
      return;
    }

    try {
      if (ricordoDaModificare) {
        modificaRicordo(
          ricordoDaModificare, 
          descrizioneCorretta, 
          descrizioneSbagliata1, 
          descrizioneSbagliata2,
          categoria || undefined
        );
        setMessaggioSuccesso("✅ Ricordo modificato con successo!");
      } else {
        setMessaggioSuccesso("🗜️ Compressione immagine in corso...");
        await salvaRicordo(
          fotoBase64, 
          descrizioneCorretta, 
          descrizioneSbagliata1, 
          descrizioneSbagliata2,
          categoria || undefined
        );
        setMessaggioSuccesso("✅ Ricordo salvato con successo!");
      }

      // Reset form dopo un breve delay per mostrare il messaggio
      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Spazio di archiviazione")) {
        setMessaggioSuccesso("❌ " + error.message);
      } else {
        setMessaggioSuccesso("❌ Errore durante il salvataggio. Riprova.");
      }
      console.error("[PANNELLO RICORDI] Errore:", error);
    }
  };

  const handleModifica = (id: string) => {
    const ricordo = ricordi.find(r => r.id === id);
    if (ricordo) {
      setFotoBase64(ricordo.foto);
      setDescrizioneCorretta(ricordo.descrizioneCorretta);
      setDescrizioneSbagliata1(ricordo.descrizioneSbagliata1);
      setDescrizioneSbagliata2(ricordo.descrizioneSbagliata2);
      setCategoria(ricordo.categoria || "");
      setRicordoDaModificare(id);
    }
  };

  const handleAnnulla = () => {
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-slate-50 overflow-auto z-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">📸 Gestione Ricordi</h1>
              <p className="text-slate-600 mt-1">
                Carica foto e descrizioni per creare giochi di memoria personalizzati
              </p>
              <p className="text-xs text-slate-500 mt-2">
                💾 Spazio utilizzato: {formattaDimensione(dimensioneStorage)} / ~5 MB
              </p>
            </div>
            <button
              onClick={onChiudi}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
            >
              ← Chiudi
            </button>
          </div>
        </div>

        {/* Form di inserimento */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {ricordoDaModificare ? "✏️ Modifica Ricordo" : "➕ Aggiungi Nuovo Ricordo"}
          </h2>

          {/* Messaggio di successo/errore */}
          {messaggioSuccesso && (
            <div className={`mb-4 p-4 border-2 rounded-lg font-medium text-lg ${
              messaggioSuccesso.startsWith("✅") 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : messaggioSuccesso.startsWith("❌")
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}>
              {messaggioSuccesso}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload foto */}
            <div>
              <label className="block text-lg font-semibold text-slate-700 mb-2">
                Foto
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
              {fotoBase64 && (
                <div className="mt-4">
                  <img
                    src={fotoBase64}
                    alt="Anteprima"
                    className="w-full h-64 object-cover rounded-lg border-2 border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Dettagli */}
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold text-emerald-700 mb-2">
                  ✓ Descrizione Corretta *
                </label>
                <input
                  type="text"
                  value={descrizioneCorretta}
                  onChange={(e) => setDescrizioneCorretta(e.target.value)}
                  placeholder="Es: Foto del matrimonio con Anna"
                  className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg bg-emerald-50"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-amber-700 mb-2">
                  ✗ Descrizione Sbagliata 1 *
                </label>
                <input
                  type="text"
                  value={descrizioneSbagliata1}
                  onChange={(e) => setDescrizioneSbagliata1(e.target.value)}
                  placeholder="Es: Foto delle vacanze al mare"
                  className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg bg-amber-50"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-amber-700 mb-2">
                  ✗ Descrizione Sbagliata 2 *
                </label>
                <input
                  type="text"
                  value={descrizioneSbagliata2}
                  onChange={(e) => setDescrizioneSbagliata2(e.target.value)}
                  placeholder="Es: Foto della festa di compleanno"
                  className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg bg-amber-50"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-slate-700 mb-2">
                  Categoria (opzionale)
                </label>
                <input
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Es: Famiglia, Viaggi, Lavoro..."
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSalva}
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold rounded-lg transition-colors"
                >
                  {ricordoDaModificare ? "💾 Salva Modifiche" : "💾 Salva Ricordo"}
                </button>
                {fotoBase64 && (
                  <button
                    onClick={handleAnnulla}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-lg font-medium rounded-lg transition-colors"
                  >
                    ❌ Annulla
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Elenco ricordi */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            📚 Ricordi Salvati ({ricordi.length})
          </h2>

          {ricordi.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-slate-600">
                Nessun ricordo salvato
              </p>
              <p className="text-slate-500 mt-2">
                Inizia caricando la tua prima foto!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ricordi.map((ricordo) => (
                <div
                  key={ricordo.id}
                  className="bg-slate-50 rounded-lg border-2 border-slate-200 overflow-hidden"
                >
                  <img
                    src={ricordo.foto}
                    alt={ricordo.descrizioneCorretta}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="space-y-1 mb-2">
                      <p className="text-sm font-semibold text-emerald-700">
                        ✓ {ricordo.descrizioneCorretta}
                      </p>
                      <p className="text-xs text-amber-700">
                        ✗ {ricordo.descrizioneSbagliata1}
                      </p>
                      <p className="text-xs text-amber-700">
                        ✗ {ricordo.descrizioneSbagliata2}
                      </p>
                    </div>
                    {ricordo.categoria && (
                      <p className="text-sm text-slate-600 mb-3">
                        📁 {ricordo.categoria}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleModifica(ricordo.id)}
                        className="flex-1 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors"
                      >
                        ✏️ Modifica
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Sei sicuro di voler eliminare questo ricordo?")) {
                            eliminaRicordo(ricordo.id);
                          }
                        }}
                        className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors"
                      >
                        🗑️ Elimina
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
