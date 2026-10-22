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
  tempoDiReazione: number; // secondi impiegati per rispondere
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
  const domandeDisponibiliRef = useRef<Domanda[]>([]);
  const livelloPrecedenteRef = useRef<1 | 2>(1);

  // ─── SELEZIONA LA PROSSIMA DOMANDA ───
  const selezionaProssimaDomanda = useCallback(
    (livello: 1 | 2) => {
      // Filtra le domande disponibili per il livello corrente
      const domandeFiltrate = domande.filter(
        (d) => d.livelloDifficolta === livello
      );

      if (domandeFiltrate.length === 0) {
        console.warn(
          `[COGNITIVE] Nessuna domanda disponibile per livello ${livello}`
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
        `[COGNITIVE] Domanda selezionata: "${prossimaDomanda.testoDomanda}" (Livello: ${prossimaDomanda.livelloDifficolta}, Categoria: ${prossimaDomanda.categoria})`
      );

      setDomandaCorrente(prossimaDomanda);
      setIndiceDomandaCorrente((prev) => prev + 1);

      // Avvia il timer
      avviaTimer();
    },
    [domandaCorrente]
  );

  // ─── TIMER ───
  const avviaTimer = useCallback(() => {
    // Pulisci interval precedente
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
    livelloPrecedenteRef.current = 1;

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

  // ─── REGISTRA RISPOSTA ───
  const rispondi = useCallback(
    (indiceRisposta: number) => {
      if (!domandaCorrente || !sessioneAttiva) {
        console.warn("[COGNITIVE] ⚠ Nessuna domanda attiva o sessione non attiva");
        return;
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
        // Risposta corretta
        const nuoveConsecutiveCorrette = risposteConsecutiveCorrette + 1;
        nuoveConsecutive = nuoveConsecutiveCorrette;

        console.log(
          `[COGNITIVE] Risposte consecutive corrette: ${nuoveConsecutiveCorrette}`
        );

        // Se 2 risposte corrette consecutive allo stesso livello → aumenta
        if (
          nuoveConsecutiveCorrette >= 2 &&
          livelloDifficoltaAttuale < 2
        ) {
          nuovoLivello = 2;
          console.log(
            `[COGNITIVE] ⬆️ LIVELLO AUMENTATO: ${livelloDifficoltaAttuale} → ${nuovoLivello}`
          );
          console.log(
            `[COGNITIVE] Motivazione: 2 risposte corrette consecutive al livello ${livelloDifficoltaAttuale}`
          );
          nuoveConsecutive = 0; // Reset dopo promozione
        } else {
          nuovoLivello = livelloDifficoltaAttuale;
        }

        // Aggiorna punteggio invisibile
        // Punteggio base + bonus velocità (più veloce = più punti)
        const bonusVelocita = Math.max(0, 10 - tempoReazione);
        const puntiGuadagnati = 10 + bonusVelocita;
        setPunteggioInvisibile((prev) => prev + puntiGuadagnati);

        console.log(
          `[COGNITIVE] Punteggio: +${puntiGuadagnati} punti (base: 10, bonus velocità: ${bonusVelocita})`
        );
      } else {
        // Risposta sbagliata → abbassa livello a 1
        nuovoLivello = 1;
        nuoveConsecutive = 0;

        if (livelloDifficoltaAttuale > 1) {
          console.log(
            `[COGNITIVE] ⬇️ LIVELLO ABBASSATO: ${livelloDifficoltaAttuale} → 1`
          );
          console.log(
            `[COGNITIVE] Motivazione: Risposta errata → riduzione per evitare frustrazione`
          );
        } else {
          console.log(
            `[COGNITIVE] ⚠ Livello già al minimo (1) - nessun cambiamento`
          );
        }

        console.log(
          `[COGNITIVE] Punteggio: +0 punti (risposta errata)`
        );
      }

      // Aggiorna stato
      setRisposteConsecutiveCorrette(nuoveConsecutive);
      livelloPrecedenteRef.current = livelloDifficoltaAttuale;

      if (nuovoLivello !== livelloDifficoltaAttuale) {
        setLivelloDifficoltaAttuale(nuovoLivello);
      }

      console.log(
        `[COGNITIVE] Livello attuale: ${nuovoLivello} | Punteggio totale: ${punteggioInvisibile + (rispostaCorretta ? 10 + Math.max(0, 10 - tempoReazione) : 0)}`
      );
      console.log("───────────────────────────────────────");

      // ─── SELEZIONA PROSSIMA DOMANDA ───
      // Usa setTimeout per permettere il re-render prima della prossima domanda
      setTimeout(() => {
        const domandeFiltrate = domande.filter(
          (d) => d.livelloDifficolta === nuovoLivello
        );

        if (domandeFiltrate.length === 0) {
          console.warn(
            `[COGNITIVE] Nessuna domanda per livello ${nuovoLivello}`
          );
          setSessioneCompletata(true);
          setSessioneAttiva(false);
          return;
        }

        // Evita ripetizione
        let pool = domandeFiltrate;
        if (domandaCorrente) {
          const senzaCorrente = domandeFiltrate.filter(
            (d) => d.id !== domandaCorrente.id
          );
          if (senzaCorrente.length > 0) {
            pool = senzaCorrente;
          }
        }

        const indiceCasuale = Math.floor(Math.random() * pool.length);
        const prossimaDomanda = pool[indiceCasuale];

        console.log(
          `[COGNITIVE] Prossima domanda: "${prossimaDomanda.testoDomanda}" (Livello: ${prossimaDomanda.livelloDifficolta}, Categoria: ${prossimaDomanda.categoria})`
        );

        setDomandaCorrente(prossimaDomanda);
        setIndiceDomandaCorrente((prev) => prev + 1);

        // Avvia timer per la prossima domanda
        timerInizioRef.current = Date.now();
        setTempoDiReazione(0);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          if (timerInizioRef.current) {
            const trascorso = Math.floor(
              (Date.now() - timerInizioRef.current) / 1000
            );
            setTempoDiReazione(trascorso);
          }
        }, 1000);
      }, 0);
    },
    [
      domandaCorrente,
      sessioneAttiva,
      risposteConsecutiveCorrette,
      livelloDifficoltaAttuale,
      punteggioInvisibile,
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
    console.log(
      `[COGNITIVE] Domande rispondendo: ${indiceDomandaCorrente - 1}`
    );
    console.log(
      `[COGNITIVE] Livello finale raggiunto: ${livelloDifficoltaAttuale}`
    );
    console.log("═══════════════════════════════════════");
  }, [
    fermaTimer,
    punteggioInvisibile,
    indiceDomandaCorrente,
    livelloDifficoltaAttuale,
  ]);

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
    terminaSessione,
  };
}
