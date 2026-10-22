import { useLocalStorage } from "../hooks/useLocalStorage";
import { CronologiaEntry } from "./useCognitiveSession";

/**
 * Chiave localStorage per la cronologia delle sessioni
 */
const SESSIONI_STORAGE_KEY = "stimolazione_cognitiva_sessioni";

/**
 * Struttura di una sessione salvata
 */
export interface SessioneSalvata {
  id: string;
  data: string; // ISO string
  durata: number; // secondi totali
  domandeRispondendo: number;
  punteggioFinale: number;
  livelloMaxRaggiunto: 1 | 2;
  cronologia: CronologiaEntry[];
  profiloPaziente: string; // nome del paziente al momento della sessione
}

/**
 * Hook per gestire la cronologia delle sessioni con persistenza in localStorage
 * 
 * @returns [sessioni, aggiungiSessione, cancellaSessioni]
 */
export function useCronologiaSessioni(): [
  SessioneSalvata[],
  (sessione: SessioneSalvata) => void,
  () => void
] {
  const [sessioni, setSessioni] = useLocalStorage<SessioneSalvata[]>(
    SESSIONI_STORAGE_KEY,
    []
  );

  /**
   * Aggiunge una nuova sessione alla cronologia
   */
  const aggiungiSessione = (sessione: SessioneSalvata) => {
    setSessioni((prev) => [sessione, ...prev]);
    console.log(`[CRONOLOGIA] Sessione salvata: ${sessione.id}`);
  };

  /**
   * Cancella tutta la cronologia
   */
  const cancellaSessioni = () => {
    setSessioni([]);
    console.log("[CRONOLOGIA] Cronologia cancellata");
  };

  return [sessioni, aggiungiSessione, cancellaSessioni];
}
