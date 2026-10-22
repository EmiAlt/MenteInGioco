import { useState, useRef } from "react";
import { useRicordi } from "../hooks/useRicordi";

interface PannelloRicordiProps {
  onChiudi: () => void;
}

export default function PannelloRicordi({ onChiudi }: PannelloRicordiProps) {
  const { ricordi, salvaRicordo, eliminaRicordo, modificaRicordo } = useRicordi();
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [descrizione, setDescrizione] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ricordoDaModificare, setRicordoDaModificare] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFotoBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSalva = () => {
    if (!fotoBase64 || !descrizione.trim()) {
      alert("Inserisci una foto e una descrizione");
      return;
    }

    if (ricordoDaModificare) {
      modificaRicordo(ricordoDaModificare, descrizione, categoria || undefined);
      setRicordoDaModificare(null);
    } else {
      salvaRicordo(fotoBase64, descrizione, categoria || undefined);
    }

    // Reset form
    setFotoBase64(null);
    setDescrizione("");
    setCategoria("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleModifica = (id: string) => {
    const ricordo = ricordi.find(r => r.id === id);
    if (ricordo) {
      setFotoBase64(ricordo.foto);
      setDescrizione(ricordo.descrizione);
      setCategoria(ricordo.categoria || "");
      setRicordoDaModificare(id);
    }
  };

  const handleAnnulla = () => {
    setFotoBase64(null);
    setDescrizione("");
    setCategoria("");
    setRicordoDaModificare(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
                <label className="block text-lg font-semibold text-slate-700 mb-2">
                  Descrizione *
                </label>
                <input
                  type="text"
                  value={descrizione}
                  onChange={(e) => setDescrizione(e.target.value)}
                  placeholder="Es: Foto Matrimonio, Lago del Turano 1980..."
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
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
                    alt={ricordo.descrizione}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {ricordo.descrizione}
                    </h3>
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
