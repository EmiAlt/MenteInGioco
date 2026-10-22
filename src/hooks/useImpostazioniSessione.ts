import { useLocalStorage } from "./useLocalStorage";

/**
 * Chiave localStorage per le impostazioni di sessione
 */
const IMPOSTAZIONI_STORAGE_KEY = "stimolazione_cognitiva_impostazioni";

/**
 * Interfaccia per le impostazioni di sessione
 */
export interface ImpostazioniSessione {
  numeroDomande: number;
  durataFeedbackMs: number;
}

/**
 * Valori di default
 */
export const impostazioniDefault: ImpostazioniSessione = {
  numeroDomande: 5,
  durataFeedbackMs: 2500,
};

/**
 * Hook per gestire le impostazioni di sessione con persistenza in localStorage
 * 
 * @returns [impostazioni, setImpostazioni]
 */
export function useImpostazioniSessione(): [
  ImpostazioniSessione,
  (impostazioni: ImpostazioniSessione) => void
] {
  const [impostazioni, setImpostazioni] = useLocalStorage<ImpostazioniSessione>(
    IMPOSTAZIONI_STORAGE_KEY,
    impostazioniDefault
  );

  return [impostazioni, setImpostazioni];
}
