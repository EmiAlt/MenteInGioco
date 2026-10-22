import { useLocalStorage } from "../hooks/useLocalStorage";
import { ProfiloPaziente } from "../data/profiloPaziente";

/**
 * Chiave localStorage per il profilo paziente
 */
const PROFILO_STORAGE_KEY = "stimolazione_cognitiva_profilo_paziente";

/**
 * Profilo di default (usato se non c'è nulla in localStorage)
 */
export const profiloDefault: ProfiloPaziente = {
  nome: "Mario",
  annoNascita: 1950,
  exMestiere: "Falegname",
  hobby: ["Inter", "Orto"],
};

/**
 * Hook per gestire il profilo paziente con persistenza in localStorage
 * 
 * @returns [profilo, setProfilo] - profilo corrente e funzione per aggiornarlo
 */
export function useProfiloPaziente(): [ProfiloPaziente, (profilo: ProfiloPaziente) => void] {
  const [profilo, setProfilo] = useLocalStorage<ProfiloPaziente>(
    PROFILO_STORAGE_KEY,
    profiloDefault
  );

  return [profilo, setProfilo];
}
