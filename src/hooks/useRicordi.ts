import { useState, useEffect } from "react";

export interface Ricordo {
  id: string;
  foto: string; // base64 o URL
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

  const salvaRicordo = (foto: string, descrizione: string, categoria?: string) => {
    const nuovoRicordo: Ricordo = {
      id: `ricordo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      foto,
      descrizione,
      categoria,
      dataCreazione: new Date().toISOString(),
    };

    // Usa la versione funzionale di setRicordi per evitare stati stale
    setRicordi(prev => {
      const nuoviRicordi = [...prev, nuovoRicordo];
      // Salva immediatamente in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuoviRicordi));
      console.log("[RICORDI] 💾 Ricordo salvato:", descrizione, "| Totale:", nuoviRicordi.length);
      return nuoviRicordi;
    });

    return nuovoRicordo;
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
