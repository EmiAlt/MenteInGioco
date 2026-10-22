import { useLocalStorage } from "../hooks/useLocalStorage";
import { Domanda } from "../data/questions";

/**
 * Chiave localStorage per le domande custom importate dal caregiver
 */
const DOMANDE_CUSTOM_STORAGE_KEY = "stimolazione_cognitiva_domande_custom";

/**
 * Hook per gestire le domande personalizzate importate dal caregiver
 * 
 * @returns [domandeCustom, setDomandeCustom, aggiungiDomandeCustom, cancellaDomandeCustom]
 */
export function useDomandeCustom(): [
  Domanda[],
  (domande: Domanda[]) => void,
  (nuoveDomande: Domanda[]) => void,
  () => void
] {
  const [domandeCustom, setDomandeCustom] = useLocalStorage<Domanda[]>(
    DOMANDE_CUSTOM_STORAGE_KEY,
    []
  );

  /**
   * Aggiunge nuove domande custom alla lista esistente
   */
  const aggiungiDomandeCustom = (nuoveDomande: Domanda[]) => {
    setDomandeCustom((prev) => [...prev, ...nuoveDomande]);
    console.log(`[DOMANDE CUSTOM] Aggiunte ${nuoveDomande.length} domande`);
  };

  /**
   * Cancella tutte le domande custom
   */
  const cancellaDomandeCustom = () => {
    setDomandeCustom([]);
    console.log("[DOMANDE CUSTOM] Tutte le domande custom cancellate");
  };

  return [domandeCustom, setDomandeCustom, aggiungiDomandeCustom, cancellaDomandeCustom];
}
