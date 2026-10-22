import { Domanda } from "../data/questions";
import { ProfiloPaziente, generaPromptPersonalizzato } from "../data/profiloPaziente";

/**
 * Simulatore di chiamata a un'API AI (LLM)
 * 
 * Questo modulo simula il comportamento di una chiamata API a un modello
 * linguistico (es. OpenAI GPT, Anthropic Claude) che genera domande
 * personalizzate basate sul profilo del paziente.
 * 
 * In produzione, questa funzione farebbe una fetch() a un endpoint backend
 * che a sua volta chiama l'API del LLM.
 */

/**
 * Risposta fake simulata dall'AI per il profilo di Mario
 * 
 * Queste domande sono coerenti con il profilo:
 * - Falegname (lavoro con il legno, attrezzi)
 * - Inter (calcio, ricordi sportivi)
 * - Orto (verdure, coltivazione)
 * 
 * In produzione, questa risposta verrebbe generata dinamicamente dal LLM
 * e validata per garantire che rispetti lo schema JSON richiesto.
 */
function generaRispostaFakeAI(profilo: ProfiloPaziente): Omit<Domanda, "id" | "categoria" | "livelloDifficolta">[] {
  // Domande personalizzate basate sul profilo di Mario
  const domandePersonalizzate: Omit<Domanda, "id" | "categoria" | "livelloDifficolta">[] = [
    // --- Domanda sul mestiere di Falegname ---
    {
      testoDomanda: "Quale di questi è un attrezzo usato dal falegname per tagliare il legno?",
      opzioni: ["Martello", "Sega", "Cacciavite"],
      rispostaCorretta: 1,
    },
    // --- Domanda sull'Inter ---
    {
      testoDomanda: "Di che colore è la maglia della squadra Inter?",
      opzioni: ["Rosso e nero", "Blu e nero", "Bianco e verde"],
      rispostaCorretta: 1,
    },
    // --- Domanda sull'Orto ---
    {
      testoDomanda: "Quale di queste verdure si raccoglie solitamente in estate nell'orto?",
      opzioni: ["Zucca", "Pomodoro", "Cavolo"],
      rispostaCorretta: 1,
    },
    // --- Domanda sulla falegnameria (tipo di legno) ---
    {
      testoDomanda: "Quale di questi è un tipo di legno usato per fare i mobili?",
      opzioni: ["Noce", "Rosa", "Bambù"],
      rispostaCorretta: 0,
    },
    // --- Domanda sull'Inter (calcio storico) ---
    {
      testoDomanda: "Come si chiama lo stadio dove gioca l'Inter?",
      opzioni: ["Olimpico", "San Siro", "Marassi"],
      rispostaCorretta: 1,
    },
  ];

  // Seleziona 3 domande casuali dal pool
  const pool = [...domandePersonalizzate];
  const selezionate: Omit<Domanda, "id" | "categoria" | "livelloDifficolta">[] = [];
  
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    selezionate.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return selezionate;
}

/**
 * Simula una chiamata asincrona all'API AI
 * 
 * @param profilo - Profilo del paziente
 * @returns Promise con le domande generate (simulate)
 * 
 * In produzione, questa funzione sarebbe:
 * 
 * async function generaDomandeConAI(profilo: ProfiloPaziente): Promise<Domanda[]> {
 *   const prompt = generaPromptPersonalizzato(profilo);
 *   const response = await fetch('/api/genera-domande', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ prompt, profilo })
 *   });
 *   const data = await response.json();
 *   return validaESchema(data);
 * }
 */
export async function simulaChiamataAI(
  profilo: ProfiloPaziente
): Promise<Domanda[]> {
  // 1. Genera e logga il prompt
  const prompt = generaPromptPersonalizzato(profilo);
  
  console.log("═══════════════════════════════════════");
  console.log("[AI] 🚀 CHIAMATA API SIMULATA");
  console.log("═══════════════════════════════════════");
  console.log("[AI] Endpoint: POST /api/v1/genera-domande");
  console.log(`[AI] Modello: gpt-4-turbo (simulato)`);
  console.log(`[AI] Profilo paziente: ${profilo.nome}, ${profilo.exMestiere}`);
  console.log(`[AI] Prompt length: ${prompt.length} chars`);
  console.log("───────────────────────────────────────");
  console.log("[AI] 📝 PROMPT INVIATO:");
  console.log(prompt);
  console.log("───────────────────────────────────────");
  
  // 2. Simula latenza di rete (1.5-2.5 secondi)
  const latenza = 1500 + Math.random() * 1000;
  console.log(`[AI] ⏳ Attesa risposta... (${Math.round(latenza)}ms)`);
  
  await new Promise((resolve) => setTimeout(resolve, latenza));
  
  // 3. Genera risposta fake
  const risposteFake = generaRispostaFakeAI(profilo);
  
  console.log("[AI] ✅ Risposta ricevuta dall'API");
  console.log("───────────────────────────────────────");
  console.log("[AI] 📦 RISPOSTA JSON (raw):");
  console.log(JSON.stringify(risposteFake, null, 2));
  console.log("───────────────────────────────────────");
  
  // 4. Trasforma in formato Domanda completo
  const domandeComplete: Domanda[] = risposteFake.map((d, idx) => ({
    id: `ai-${profilo.nome.toLowerCase()}-${Date.now()}-${idx}`,
    testoDomanda: d.testoDomanda,
    opzioni: d.opzioni as [string, string, string],
    rispostaCorretta: d.rispostaCorretta,
    categoria: "memoria", // Le domande AI sono classificate come memoria personale
    livelloDifficolta: 1, // Sempre livello facile per personalizzazione
  }));
  
  console.log("[AI] 🔄 Domande trasformate nel formato interno:");
  console.log(`[AI]    - ${domandeComplete.length} domande generate`);
  console.log(`[AI]    - ID prefix: ai-${profilo.nome.toLowerCase()}`);
  console.log(`[AI]    - Categoria: memoria (personale)`);
  console.log(`[AI]    - Livello: 1 (facile)`);
  console.log("═══════════════════════════════════════");
  
  return domandeComplete;
}

/**
 * Valida che la risposta JSON dell'AI rispetti lo schema richiesto
 * (utile per il production use case)
 */
export function validaRispostaAI(data: unknown): data is Omit<Domanda, "id" | "categoria" | "livelloDifficolta">[] {
  if (!Array.isArray(data)) return false;
  
  return data.every((item) => {
    if (typeof item !== "object" || item === null) return false;
    if (typeof (item as any).testoDomanda !== "string") return false;
    if (!Array.isArray((item as any).opzioni)) return false;
    if ((item as any).opzioni.length !== 3) return false;
    if (!(item as any).opzioni.every((o: unknown) => typeof o === "string")) return false;
    if (typeof (item as any).rispostaCorretta !== "number") return false;
    if (![0, 1, 2].includes((item as any).rispostaCorretta)) return false;
    return true;
  });
}
