import { useState, useEffect, useCallback } from "react";

/**
 * Tipi TypeScript per il file dati_paziente.json
 */
export interface ProfiloPazienteJSON {
  nome: string;
  annoNascita: number;
  exMestiere: string;
  hobby: string[];
  livelloIniziale: number;
}

export interface Ricordo {
  id: number;
  titolo: string;
  anno: number;
  dettaglio: string;
  emozione: "alta" | "media" | "bassa";
}

export interface SessioneStorico {
  id: string;
  data: string; // ISO string
  punteggio: number;
  tempoMedio: number; // secondi
  domandeRispondendo: number;
  livelloRaggiunto: number;
  note?: string;
}

export interface DatiPaziente {
  profilo: ProfiloPazienteJSON;
  ricordi: Ricordo[];
  storicoSessioni: SessioneStorico[];
}

const STORAGE_KEY = "menteingioco_dati_paziente";

/**
 * Hook per gestire i dati del paziente caricati dal file JSON
 * 
 * Funzionalità:
 * - Carica il file JSON all'avvio (simulando una chiamata API)
 * - Mantiene le modifiche in localStorage per persistenza
 * - Permette di salvare nuove sessioni nello storico
 * - Permette di esportare il JSON aggiornato
 */
export function useDatiPaziente() {
  const [dati, setDati] = useState<DatiPaziente | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  /**
   * Carica i dati dal file JSON all'avvio dell'app
   * Se esistono dati in localStorage, usa quelli (per mantenere le modifiche)
   */
  useEffect(() => {
    const caricaDati = async () => {
      try {
        setCaricamento(true);
        setErrore(null);

        // 1. Controlla se ci sono dati salvati in localStorage
        const datiSalvati = localStorage.getItem(STORAGE_KEY);
        
        if (datiSalvati) {
          console.log("[DATI PAZIENTE] 📂 Caricamento dati da localStorage (cache)");
          const datiParse = JSON.parse(datiSalvati);
          setDati(datiParse);
          setCaricamento(false);
          return;
        }

        // 2. Altrimenti carica il file JSON originale
        console.log("[DATI PAZIENTE] 📂 Caricamento file JSON originale...");
        const response = await fetch("/dati_paziente.json");
        
        if (!response.ok) {
          throw new Error(`Errore nel caricamento del file JSON: ${response.status}`);
        }

        const datiJSON: DatiPaziente = await response.json();
        
        console.log("[DATI PAZIENTE] ✅ File JSON caricato con successo");
        console.log("[DATI PAZIENTE] 👤 Paziente:", datiJSON.profilo.nome);
        console.log("[DATI PAZIENTE] 📝 Ricordi:", datiJSON.ricordi.length);
        console.log("[DATI PAZIENTE] 📊 Sessioni storiche:", datiJSON.storicoSessioni.length);

        setDati(datiJSON);
        
        // Salva in localStorage per la prossima volta
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datiJSON));
        
      } catch (err) {
        console.error("[DATI PAZIENTE] ❌ Errore nel caricamento:", err);
        setErrore(err instanceof Error ? err.message : "Errore sconosciuto");
      } finally {
        setCaricamento(false);
      }
    };

    caricaDati();
  }, []);

  /**
   * Salva una nuova sessione nello storico
   * 
   * @param nuovoPunteggio - Punteggio ottenuto nella sessione
   * @param tempoMedio - Tempo medio di risposta in secondi
   * @param domandeRispondendo - Numero di domande affrontate
   * @param livelloRaggiunto - Livello massimo raggiunto
   * @param note - Note opzionali sulla sessione
   */
  const salvaSessione = useCallback(
    (
      nuovoPunteggio: number,
      tempoMedio: number,
      domandeRispondendo: number = 5,
      livelloRaggiunto: number = 1,
      note?: string
    ) => {
      if (!dati) {
        console.warn("[DATI PAZIENTE] ⚠️ Dati non ancora caricati");
        return;
      }

      const nuovaSessione: SessioneStorico = {
        id: `sessione_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        data: new Date().toISOString(),
        punteggio: nuovoPunteggio,
        tempoMedio: tempoMedio,
        domandeRispondendo: domandeRispondendo,
        livelloRaggiunto: livelloRaggiunto,
        note: note,
      };

      const datiAggiornati: DatiPaziente = {
        ...dati,
        storicoSessioni: [...dati.storicoSessioni, nuovaSessione],
      };

      setDati(datiAggiornati);
      
      // Aggiorna localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datiAggiornati));

      console.log("[DATI PAZIENTE] 💾 Nuova sessione salvata nello storico");
      console.log("[DATI PAZIENTE] 📊 Sessioni totali:", datiAggiornati.storicoSessioni.length);
      console.log("[DATI PAZIENTE] 🎯 Ultima sessione:", {
        punteggio: nuovoPunteggio,
        tempoMedio: tempoMedio + "s",
        domande: domandeRispondendo,
        livello: livelloRaggiunto,
      });

      return nuovaSessione;
    },
    [dati]
  );

  /**
   * Aggiorna il profilo del paziente
   */
  const aggiornaProfilo = useCallback(
    (nuovoProfilo: ProfiloPazienteJSON) => {
      if (!dati) return;

      const datiAggiornati: DatiPaziente = {
        ...dati,
        profilo: nuovoProfilo,
      };

      setDati(datiAggiornati);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datiAggiornati));

      console.log("[DATI PAZIENTE] ✏️ Profilo aggiornato:", nuovoProfilo.nome);
    },
    [dati]
  );

  /**
   * Esporta il JSON aggiornato come file scaricabile
   */
  const esportaJSON = useCallback(() => {
    if (!dati) {
      console.warn("[DATI PAZIENTE] ⚠️ Nessun dato da esportare");
      return;
    }

    // Crea il JSON formattato
    const jsonStr = JSON.stringify(dati, null, 2);
    
    // Crea un Blob con il contenuto JSON
    const blob = new Blob([jsonStr], { type: "application/json" });
    
    // Crea un URL per il download
    const url = URL.createObjectURL(blob);
    
    // Crea un elemento <a> temporaneo per il download
    const link = document.createElement("a");
    link.href = url;
    link.download = `dati_paziente_${dati.profilo.nome.toLowerCase()}_${new Date().toISOString().split("T")[0]}.json`;
    
    // Aggiungi al DOM, clicca e rimuovi
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Rilascia l'URL
    URL.revokeObjectURL(url);

    console.log("[DATI PAZIENTE] 📥 JSON esportato con successo");
    console.log("[DATI PAZIENTE] 📦 Dimensione:", jsonStr.length, "bytes");
  }, [dati]);

  /**
   * Resetta i dati al file JSON originale (cancella localStorage)
   */
  const resettaDati = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    
    try {
      const response = await fetch("/dati_paziente.json");
      const datiJSON: DatiPaziente = await response.json();
      setDati(datiJSON);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datiJSON));
      
      console.log("[DATI PAZIENTE] 🔄 Dati resettati all'originale");
    } catch (err) {
      console.error("[DATI PAZIENTE] ❌ Errore nel reset:", err);
    }
  }, []);

  return {
    dati,
    caricamento,
    errore,
    salvaSessione,
    aggiornaProfilo,
    esportaJSON,
    resettaDati,
  };
}
