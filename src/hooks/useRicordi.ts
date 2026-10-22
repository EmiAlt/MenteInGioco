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

  useEffect(() => {
    const salvati = localStorage.getItem(STORAGE_KEY);
    if (salvati) {
      try {
        setRicordi(JSON.parse(salvati));
      } catch (e) {
        console.error("Errore nel caricare i ricordi:", e);
      }
    }
  }, []);

  const salvaRicordo = (foto: string, descrizione: string, categoria?: string) => {
    const nuovoRicordo: Ricordo = {
      id: `ricordo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      foto,
      descrizione,
      categoria,
      dataCreazione: new Date().toISOString(),
    };

    const nuoviRicordi = [...ricordi, nuovoRicordo];
    setRicordi(nuoviRicordi);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuoviRicordi));

    console.log("[RICORDI] 💾 Ricordo salvato:", descrizione);
    return nuovoRicordo;
  };

  const eliminaRicordo = (id: string) => {
    const nuoviRicordi = ricordi.filter(r => r.id !== id);
    setRicordi(nuoviRicordi);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuoviRicordi));
    console.log("[RICORDI] 🗑️ Ricordo eliminato");
  };

  const modificaRicordo = (id: string, descrizione: string, categoria?: string) => {
    const nuoviRicordi = ricordi.map(r =>
      r.id === id ? { ...r, descrizione, categoria } : r
    );
    setRicordi(nuoviRicordi);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuoviRicordi));
    console.log("[RICORDI] ✏️ Ricordo modificato");
  };

  return {
    ricordi,
    salvaRicordo,
    eliminaRicordo,
    modificaRicordo,
  };
}
