import { useState, useEffect } from "react";
import { comprimiImmagine, verificaSpazioLocalStorage, formattaDimensione } from "../utils/imageCompression";

export interface Ricordo {
  id: string;
  foto: string; // base64 compresso
  descrizione: string;
  categoria?: string;
  dataCreazione: string;
}

const STORAGE_KEY = "stimolazione_cognitiva_ricordi";

export function useRicordi() {
  const [ricordi, setRicordi] = useState<Ricordo[]>([]);

  // Funzione helper per caricare i ricordi dal localStorage
  const caricaDalLocalStorage = () => {
    const salvati = localStorage.getItem(STORAGE_KEY);
    if (salvati) {
      try {
        return JSON.parse(salvati);
      } catch (e) {
        console.error("Errore nel caricare i ricordi:", e);
        return [];
      }
    }
    return [];
  };

  useEffect(() => {
    const ricordiCaricati = caricaDalLocalStorage();
    setRicordi(ricordiCaricati);
    console.log("[RICORDI] 📂 Ricordi caricati dal localStorage:", ricordiCaricati.length);
  }, []);

  const salvaRicordo = async (foto: string, descrizione: string, categoria?: string): Promise<Ricordo | null> => {
    try {
      // Comprimi l'immagine prima di salvarla
      console.log("[RICORDI] 🗜️ Compressione immagine in corso...");
      const fotoCompressa = await comprimiImmagine(foto, 800, 800, 0.7);
      
      const nuovoRicordo: Ricordo = {
        id: `ricordo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        foto: fotoCompressa,
        descrizione,
        categoria,
        dataCreazione: new Date().toISOString(),
      };

      // Verifica se c'è spazio sufficiente
      const dimensioneDatiKB = JSON.stringify(nuovoRicordo).length / 1024;
      if (!verificaSpazioLocalStorage(dimensioneDatiKB)) {
        throw new Error("STORAGE_FULL");
      }

      // Usa la versione funzionale di setRicordi per evitare stati stale
      return new Promise((resolve) => {
        setRicordi(prev => {
          const nuoviRicordi = [...prev, nuovoRicordo];
          
          try {
            // Salva immediatamente in localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nuoviRicordi));
            console.log("[RICORDI] 💾 Ricordo salvato:", descrizione, "| Totale:", nuoviRicordi.length);
            console.log("[RICORDI] 📊 Dimensione immagine:", formattaDimensione(dimensioneDatiKB));
            resolve(nuovoRicordo);
          } catch (error) {
            if (error instanceof Error && error.name === 'QuotaExceededError') {
              console.error("[RICORDI] ❌ Spazio localStorage esaurito!");
              throw new Error("STORAGE_FULL");
            }
            throw error;
          }
          
          return nuoviRicordi;
        });
      });
    } catch (error) {
      if (error instanceof Error && error.message === "STORAGE_FULL") {
        console.error("[RICORDI] ❌ Impossibile salvare: spazio di archiviazione esaurito");
        throw new Error("Spazio di archiviazione esaurito. Elimina alcuni ricordi per liberare spazio.");
      }
      console.error("[RICORDI] ❌ Errore durante il salvataggio:", error);
      throw error;
    }
  };

  const eliminaRicordo = (id: string) => {
    setRicordi(prev => {
      const nuoviRicordi = prev.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuoviRicordi));
      console.log("[RICORDI] 🗑️ Ricordo eliminato | Totale:", nuoviRicordi.length);
      return nuoviRicordi;
    });
  };

  const modificaRicordo = (id: string, descrizione: string, categoria?: string) => {
    setRicordi(prev => {
      const nuoviRicordi = prev.map(r =>
        r.id === id ? { ...r, descrizione, categoria } : r
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuoviRicordi));
      console.log("[RICORDI] ✏️ Ricordo modificato | Totale:", nuoviRicordi.length);
      return nuoviRicordi;
    });
  };

  return {
    ricordi,
    salvaRicordo,
    eliminaRicordo,
    modificaRicordo,
  };
}
