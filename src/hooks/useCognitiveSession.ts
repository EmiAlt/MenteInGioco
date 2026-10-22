import { useState, useCallback, useRef, useEffect } from "react";
import { Domanda, domande } from "../data/questions";

/**
 * Stato della sessione cognitiva
 */
export interface SessioneStato {
  punteggioInvisibile: number;
  livelloDifficoltaAttuale: 1 | 2;
  domandaCorrente: Domanda | null;
  indiceDomandaCorrente: number;
  totaleDomandeRispondendo: number;
  risposteConsecutiveCorrette: number;
  tempoDiReazione: number;
  sessioneAttiva: boolean;
  sessioneCompletata: boolean;
  cronologiaRisposte: CronologiaEntry[];
}

export interface CronologiaEntry {
  domandaId: string;
  categoria: string;
  livello: 1 | 2;
  rispostaData: number;
  corretta: boolean;
  tempoReazione: number;
  timestamp: number;
}

/**
 * Hook personalizzato per gestire una sessione di esercizi
 * di stimolazione cognitiva con adattività della difficoltà.
 *
 * LOGICA ADATTIVA:
 * - 2 risposte corrette consecutive allo stesso livello → aumenta livello (max 2)
 * - 1 risposta sbagliata → abbassa livello a 1
 *
 * FLUSSO:
 * - rispondi(indice) → registra la risposta, aggiorna stato adattivo, ferma il timer
 * - caricaProssimaDomanda() → seleziona la prossima domanda e avvia il timer
 * (separati per permettere feedback visivo prima di passare alla prossima)
 */
export function useCognitiveSession() {
  // ─── STATO PRINCIPALE ───
  const [punteggioInvisibile, setPunteggioInvisibile] = useState<number>(0);
  const [livelloDifficoltaAttuale, setLivelloDifficoltaAttuale] = useState<1 | 2>(1);
  const [domandaCorrente, setDomandaCorrente] = useState<Domanda | null>(null);
  const [indiceDomandaCorrente, setIndiceDomandaCorrente] = useState<number>(0);
  const [risposteConsecutiveCorrette, setRisposteConsecutiveCorrette] = useState<number>(0);
  const [tempoDiReazione, setTempoDiReazione] = useState<number>(0);
  const [sessioneAttiva, setSessioneAttiva] = useState<boolean>(false);
  const [sessioneCompletata, setSessioneCompletata] = useState<boolean>(false);
  const [cronologiaRisposte, setCronologiaRisposte] = useState<CronologiaEntry[]>([]);

  // ─── RIFERIMENTI PER IL TIMER ───
  const timerInizioRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── TIMER ───
  const avviaTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    timerInizioRef.current = Date.now();
    setTempoDiReazione(0);

    intervalRef.current = setInterval(() => {
      if (timerInizioRef.current) {
        const trascorso = Math.floor(
          (Date.now() - timerInizioRef.current) / 1000
        );
        setTempoDiReazione(trascorso);
      }
    }, 1000);
  }, []);

  const fermaTimer = useCallback((): number => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timerInizioRef.current) {
      const tempoTrascorso = Math.floor(
        (Date.now() - timerInizioRef.current) / 1000
      );
      timerInizioRef.current = null;
      return tempoTrascorso;
    }

    return 0;
  }, []);

  // ─── CARICA PROSSIMA DOMANDA ───
  const caricaProssimaDomanda = useCallback(
    (livello?: 1 | 2) => {
      const livelloTarget = livello ?? livelloDifficoltaAttuale;

      const domandeFiltrate = domande.filter(
        (d) => d.livelloDifficolta === livelloTarget
      );

      if (domandeFiltrate.length === 0) {
        console.warn(
          `[COGNITIVE] Nessuna domanda disponibile per livello ${livelloTarget}`
        );
        setSessioneCompletata(true);
        setSessioneAttiva(false);
        return;
      }

      // Evita di ripetere la stessa domanda consecutivamente
      let pool = domandeFiltrate;
      if (domandaCorrente) {
        const senzaCorrente = domandeFiltrate.filter(
          (d) => d.id !== domandaCorrente.id
        );
        if (senzaCorrente.length > 0) {
          pool = senzaCorrente;
        }
      }

      // Selezione casuale
      const indiceCasuale = Math.floor(Math.random() * pool.length);
      const prossimaDomanda = pool[indiceCasuale];

      console.log(
        `[COGNITIVE] Domanda caricata: "${prossimaDomanda.testoDomanda}" (Livello: ${prossimaDomanda.livelloDifficolta}, Categoria: ${prossimaDomanda.categoria})`
      );

      setDomandaCorrente(prossimaDomanda);
      setIndiceDomandaCorrente((prev) => prev + 1);

      // Avvia il timer
      avviaTimer();
    },
    [domandaCorrente, livelloDifficoltaAttuale, avviaTimer]
  );

  // ─── AVVIA SESSIONE ───
  const avviaSessione = useCallback(() => {
    console.log("═══════════════════════════════════════");
    console.log("[COGNITIVE] ▶ NUOVA SESSIONE AVVIATA");
    console.log("═══════════════════════════════════════");

    setPunteggioInvisibile(0);
    setLivelloDifficoltaAttuale(1);
    setRisposteConsecutiveCorrette(0);
    setTempoDiReazione(0);
    setSessioneAttiva(true);
    setSessioneCompletata(false);
    setIndiceDomandaCorrente(0);
    setCronologiaRisposte([]);

    // Seleziona prima domanda (livello 1)
    const domandeLivello1 = domande.filter((d) => d.livelloDifficolta === 1);
    const indiceCasuale = Math.floor(Math.random() * domandeLivello1.length);
    const primaDomanda = domandeLivello1[indiceCasuale];

    console.log(
      `[COGNITIVE] Prima domanda: "${primaDomanda.testoDomanda}" (Livello: ${primaDomanda.livelloDifficolta})`
    );

    setDomandaCorrente(primaDomanda);
    setIndiceDomandaCorrente(1);

    // Avvia timer
    avviaTimer();
  }, [avviaTimer]);

  // ─── REGISTRA RISPOSTA (senza auto-next) ───
  const rispondi = useCallback(
    (indiceRisposta: number): { corretta: boolean; tempoReazione: number } => {
      if (!domandaCorrente || !sessioneAttiva) {
        console.warn("[COGNITIVE] ⚠ Nessuna domanda attiva o sessione non attiva");
        return { corretta: false, tempoReazione: 0 };
      }

      // Ferma il timer e calcola tempo di reazione
      const tempoReazione = fermaTimer();

      const rispostaCorretta =
        indiceRisposta === domandaCorrente.rispostaCorretta;

      console.log("───────────────────────────────────────");
      console.log(
        `[COGNITIVE] Risposta data: ${indiceRisposta} | Corretta: ${domandaCorrente.rispostaCorretta}`
      );
      console.log(
        `[COGNITIVE] Esito: ${rispostaCorretta ? "✅ CORRETTA" : "❌ SBAGLIATA"}`
      );
      console.log(`[COGNITIVE] Tempo di reazione: ${tempoReazione} secondi`);

      // ─── AGGIORNA CRONOLOGIA ───
      const nuovaEntry: CronologiaEntry = {
        domandaId: domandaCorrente.id,
        categoria: domandaCorrente.categoria,
        livello: domandaCorrente.livelloDifficolta,
        rispostaData: indiceRisposta,
        corretta: rispostaCorretta,
        tempoReazione: tempoReazione,
        timestamp: Date.now(),
      };
      setCronologiaRisposte((prev) => [...prev, nuovaEntry]);

      // ─── LOGICA ADATTIVA ───
      let nuovoLivello: 1 | 2;
      let nuoveConsecutive: number;

      if (rispostaCorretta) {
        const nuoveConsecutiveCorrette = risposteConsecutiveCorrette + 1;
        nuoveConsecutive = nuoveConsecutiveCorrette;

        console.log(
          `[COGNITIVE] Risposte consecutive corrette: ${nuoveConsecutiveCorrette}`
        );

        if (nuoveConsecutiveCorrette >= 2 && livelloDifficoltaAttuale < 2) {
          nuovoLivello = 2;
          console.log(
            `[COGNITIVE] ⬆️ LIVELLO AUMENTATO: ${livelloDifficoltaAttuale} → ${nuovoLivello}`
          );
          nuoveConsecutive = 0;
        } else {
          nuovoLivello = livelloDifficoltaAttuale;
        }

        // Punteggio invisibile
        const bonusVelocita = Math.max(0, 10 - tempoReazione);
        const puntiGuadagnati = 10 + bonusVelocita;
        setPunteggioInvisibile((prev) => prev + puntiGuadagnati);

        console.log(
          `[COGNITIVE] Punteggio: +${puntiGuadagnati} (base: 10, bonus velocità: ${bonusVelocita})`
        );
      } else {
        nuovoLivello = 1;
        nuoveConsecutive = 0;

        if (livelloDifficoltaAttuale > 1) {
          console.log(
            `[COGNITIVE] ⬇️ LIVELLO ABBASSATO: ${livelloDifficoltaAttuale} → 1`
          );
        } else {
          console.log(
            `[COGNITIVE] ⚠ Livello già al minimo (1)`
          );
        }

        console.log(`[COGNITIVE] Punteggio: +0 (risposta errata)`);
      }

      setRisposteConsecutiveCorrette(nuoveConsecutive);

      if (nuovoLivello !== livelloDifficoltaAttuale) {
        setLivelloDifficoltaAttuale(nuovoLivello);
      }

      console.log(
        `[COGNITIVE] Livello attuale: ${nuovoLivello}`
      );
      console.log("───────────────────────────────────────");

      return { corretta: rispostaCorretta, tempoReazione };
    },
    [
      domandaCorrente,
      sessioneAttiva,
      risposteConsecutiveCorrette,
      livelloDifficoltaAttuale,
      fermaTimer,
    ]
  );

  // ─── TERMINA SESSIONE ───
  const terminaSessione = useCallback(() => {
    fermaTimer();
    setSessioneAttiva(false);
    setSessioneCompletata(true);

    console.log("═══════════════════════════════════════");
    console.log("[COGNITIVE] ■ SESSIONE TERMINATA");
    console.log(`[COGNITIVE] Punteggio finale: ${punteggioInvisibile}`);
    console.log(`[COGNITIVE] Domande rispondendo: ${indiceDomandaCorrente - 1}`);
    console.log(`[COGNITIVE] Livello finale: ${livelloDifficoltaAttuale}`);
    console.log("═══════════════════════════════════════");
  }, [fermaTimer, punteggioInvisibile, indiceDomandaCorrente, livelloDifficoltaAttuale]);

  // ─── CLEANUP ───
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // ─── RETURN ───
  return {
    // Stato
    punteggioInvisibile,
    livelloDifficoltaAttuale,
    domandaCorrente,
    indiceDomandaCorrente,
    tempoDiReazione,
    sessioneAttiva,
    sessioneCompletata,
    risposteConsecutiveCorrette,
    cronologiaRisposte,

    // Azioni
    avviaSessione,
    rispondi,
    caricaProssimaDomanda,
    terminaSessione,
  };
}
