import { Domanda } from "../data/questions";
import { ProfiloPaziente, generaPromptPersonalizzato } from "../data/profiloPaziente";

/**
 * Simulatore di chiamata a un'API AI (LLM)
 * 
 * Questo modulo simula il comportamento di una chiamata API a un modello
 * linguistico (es. OpenAI GPT, Anthropic Claude) che genera domande
 * personalizzate basate sul profilo del paziente.
 */

type DomandaSenzaMeta = Omit<Domanda, "id" | "categoria" | "livelloDifficolta">;

/**
 * Database di domande per mestieri comuni
 */
const DOMANDE_PER_MESTIERE: Record<string, DomandaSenzaMeta[]> = {
  "falegname": [
    { testoDomanda: "Quale attrezzo usa il falegname per tagliare il legno?", opzioni: ["Martello", "Sega", "Cacciavite"], rispostaCorretta: 1 },
    { testoDomanda: "Quale di questi è un tipo di legno usato per fare i mobili?", opzioni: ["Noce", "Rosa", "Bambù"], rispostaCorretta: 0 },
    { testoDomanda: "Cosa si usa per unire due pezzi di legno?", opzioni: ["Colla e chiodi", "Cemento", "Nastro adesivo"], rispostaCorretta: 0 },
    { testoDomanda: "Quale attrezzo serve per lisciare il legno?", opzioni: ["Pialla", "Trapano", "Livella"], rispostaCorretta: 0 },
  ],
  "insegnante": [
    { testoDomanda: "Dove lavora l'insegnante?", opzioni: ["Ospedale", "Scuola", "Fabbrica"], rispostaCorretta: 1 },
    { testoDomanda: "Cosa usa l'insegnante per scrivere alla lavagna?", opzioni: ["Gesso", "Martello", "Pennello"], rispostaCorretta: 0 },
    { testoDomanda: "Chi va a scuola per imparare?", opzioni: ["I pazienti", "Gli alunni", "I clienti"], rispostaCorretta: 1 },
    { testoDomanda: "Cosa si studia a scuola?", opzioni: ["Solo matematica", "Tante materie", "Solo sport"], rispostaCorretta: 1 },
  ],
  "medico": [
    { testoDomanda: "Dove lavora il medico?", opzioni: ["Scuola", "Ospedale", "Stadio"], rispostaCorretta: 1 },
    { testoDomanda: "Cosa usa il medico per ascoltare il cuore?", opzioni: ["Martello", "Stetoscopio", "Termometro"], rispostaCorretta: 1 },
    { testoDomanda: "Chi cura il medico?", opzioni: ["Gli alunni", "I pazienti", "I clienti"], rispostaCorretta: 1 },
    { testoDomanda: "Cosa si prende per guarire?", opzioni: ["La medicina", "Il giornale", "La chiave"], rispostaCorretta: 0 },
  ],
  "cuoco": [
    { testoDomanda: "Dove lavora il cuoco?", opzioni: ["Ristorante", "Banca", "Scuola"], rispostaCorretta: 0 },
    { testoDomanda: "Cosa usa il cuoco per tagliare le verdure?", opzioni: ["Coltello", "Martello", "Forbici"], rispostaCorretta: 0 },
    { testoDomanda: "Cosa si usa per cucinare la pasta?", opzioni: ["Pentola con acqua", "Frigorifero", "Lavatrice"], rispostaCorretta: 0 },
  ],
  "agricoltore": [
    { testoDomanda: "Dove lavora l'agricoltore?", opzioni: ["In campagna", "In ufficio", "In ospedale"], rispostaCorretta: 0 },
    { testoDomanda: "Cosa coltiva l'agricoltore?", opzioni: ["Le macchine", "Le piante", "I vestiti"], rispostaCorretta: 1 },
    { testoDomanda: "Quale attrezzo usa per zappare la terra?", opzioni: ["Zappa", "Computer", "Telefono"], rispostaCorretta: 0 },
  ],
  "impiegato": [
    { testoDomanda: "Dove lavora l'impiegato?", opzioni: ["In ufficio", "In campagna", "In mare"], rispostaCorretta: 0 },
    { testoDomanda: "Cosa usa l'impiegato per scrivere?", opzioni: ["Penna e computer", "Martello", "Zappa"], rispostaCorretta: 0 },
    { testoDomanda: "Cosa fa l'impiegato in ufficio?", opzioni: ["Dorme", "Lavora al computer", "Cucina"], rispostaCorretta: 1 },
  ],
};

/**
 * Database di domande per hobby comuni
 */
const DOMANDE_PER_HOBBY: Record<string, DomandaSenzaMeta[]> = {
  "inter": [
    { testoDomanda: "Di che colore è la maglia della squadra Inter?", opzioni: ["Rosso e nero", "Blu e nero", "Bianco e verde"], rispostaCorretta: 1 },
    { testoDomanda: "Come si chiama lo stadio dove gioca l'Inter?", opzioni: ["Olimpico", "San Siro", "Marassi"], rispostaCorretta: 1 },
    { testoDomanda: "Qual è il soprannome dei tifosi dell'Inter?", opzioni: ["Rossoneri", "Nerazzurri", "Bianconeri"], rispostaCorretta: 1 },
  ],
  "milan": [
    { testoDomanda: "Di che colore è la maglia del Milan?", opzioni: ["Blu e nero", "Rosso e nero", "Verde e bianco"], rispostaCorretta: 1 },
    { testoDomanda: "Qual è il soprannome dei tifosi del Milan?", opzioni: ["Nerazzurri", "Rossoneri", "Bianconeri"], rispostaCorretta: 1 },
  ],
  "juventus": [
    { testoDomanda: "Di che colore è la maglia della Juventus?", opzioni: ["Rosso e nero", "Blu", "Bianco e nero"], rispostaCorretta: 2 },
    { testoDomanda: "Qual è il soprannome dei tifosi della Juve?", opzioni: ["Nerazzurri", "Rossoneri", "Bianconeri"], rispostaCorretta: 2 },
  ],
  "roma": [
    { testoDomanda: "Di che colore è la maglia della Roma?", opzioni: ["Giallo e rosso", "Blu", "Verde"], rispostaCorretta: 0 },
  ],
  "orto": [
    { testoDomanda: "Quale verdura si raccoglie solitamente in estate nell'orto?", opzioni: ["Zucca", "Pomodoro", "Cavolo"], rispostaCorretta: 1 },
    { testoDomanda: "Quale attrezzo si usa per lavorare la terra?", opzioni: ["Martello", "Zappa", "Cacciavite"], rispostaCorretta: 1 },
    { testoDomanda: "Cosa cresce nell'orto?", opzioni: ["Le macchine", "Le verdure", "I vestiti"], rispostaCorretta: 1 },
  ],
  "giardinaggio": [
    { testoDomanda: "Cosa si trova in un giardino?", opzioni: ["Le auto", "I fiori", "I computer"], rispostaCorretta: 1 },
    { testoDomanda: "Quale fiore ha le spine?", opzioni: ["Rosa", "Tulipano", "Margherita"], rispostaCorretta: 0 },
  ],
  "pesca": [
    { testoDomanda: "Dove si va a pescare?", opzioni: ["In montagna", "Al lago o al mare", "In ufficio"], rispostaCorretta: 1 },
    { testoDomanda: "Cosa si usa per pescare?", opzioni: ["La canna", "Il martello", "Il computer"], rispostaCorretta: 0 },
  ],
  "cucina": [
    { testoDomanda: "Dove si cucina?", opzioni: ["In bagno", "In cucina", "In giardino"], rispostaCorretta: 1 },
    { testoDomanda: "Cosa si usa per mescolare la minestra?", opzioni: ["Il cucchiaio", "Il martello", "La forchetta"], rispostaCorretta: 0 },
  ],
  "musica": [
    { testoDomanda: "Cosa si usa per ascoltare la musica?", opzioni: ["Le orecchie", "Gli occhi", "Il naso"], rispostaCorretta: 0 },
    { testoDomanda: "Quale strumento ha i tasti bianchi e neri?", opzioni: ["Chitarra", "Pianoforte", "Tamburo"], rispostaCorretta: 1 },
  ],
  "lettura": [
    { testoDomanda: "Cosa si usa per leggere?", opzioni: ["Un libro", "Un martello", "Una padella"], rispostaCorretta: 0 },
    { testoDomanda: "Dove si trovano tanti libri?", opzioni: ["In biblioteca", "In garage", "In cucina"], rispostaCorretta: 0 },
  ],
};

/**
 * Domande generiche di fallback
 */
const DOMANDE_GENERICHE: DomandaSenzaMeta[] = [
  { testoDomanda: "Quanti giorni ha una settimana?", opzioni: ["5", "7", "10"], rispostaCorretta: 1 },
  { testoDomanda: "Quanti mesi ha un anno?", opzioni: ["10", "12", "8"], rispostaCorretta: 1 },
  { testoDomanda: "Quale stagione viene dopo la primavera?", opzioni: ["Inverno", "Autunno", "Estate"], rispostaCorretta: 2 },
  { testoDomanda: "Quante zampe ha un cane?", opzioni: ["2", "4", "6"], rispostaCorretta: 1 },
  { testoDomanda: "Di che colore è il cielo in una giornata di sole?", opzioni: ["Rosso", "Blu", "Verde"], rispostaCorretta: 1 },
  { testoDomanda: "Quante dita ci sono in una mano?", opzioni: ["3", "5", "7"], rispostaCorretta: 1 },
  { testoDomanda: "Quale animale fa 'miao'?", opzioni: ["Cane", "Gatto", "Mucca"], rispostaCorretta: 1 },
  { testoDomanda: "Cosa si usa per tagliare la carta?", opzioni: ["Forbici", "Martello", "Cucchiaio"], rispostaCorretta: 0 },
];

/**
 * Genera domande personalizzate basate sul profilo del paziente
 */
function generaDomandeDalProfilo(profilo: ProfiloPaziente): DomandaSenzaMeta[] {
  const poolDomande: DomandaSenzaMeta[] = [];

  // 1. Aggiungi domande basate sul mestiere
  const mestiereLower = profilo.exMestiere.toLowerCase();
  for (const [key, domande] of Object.entries(DOMANDE_PER_MESTIERE)) {
    if (mestiereLower.includes(key)) {
      poolDomande.push(...domande);
      break;
    }
  }

  // 2. Aggiungi domande basate sugli hobby
  for (const hobby of profilo.hobby) {
    const hobbyLower = hobby.toLowerCase();
    for (const [key, domande] of Object.entries(DOMANDE_PER_HOBBY)) {
      if (hobbyLower.includes(key)) {
        poolDomande.push(...domande);
        break;
      }
    }
  }

  // 3. Aggiungi domande generiche come fallback
  poolDomande.push(...DOMANDE_GENERICHE);

  return poolDomande;
}

/**
 * Genera risposta fake dall'AI basata sul profilo
 */
function generaRispostaFakeAI(profilo: ProfiloPaziente): DomandaSenzaMeta[] {
  const poolDomande = generaDomandeDalProfilo(profilo);

  // Seleziona 3 domande casuali dal pool, evitando duplicati
  const selezionate: DomandaSenzaMeta[] = [];
  const poolDisponibile = [...poolDomande];

  for (let i = 0; i < 3 && poolDisponibile.length > 0; i++) {
    const idx = Math.floor(Math.random() * poolDisponibile.length);
    selezionate.push(poolDisponibile[idx]);
    poolDisponibile.splice(idx, 1);
  }

  return selezionate;
}

/**
 * Simula una chiamata asincrona all'API AI
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
  console.log(`[AI] Hobby: ${profilo.hobby.join(", ")}`);
  console.log(`[AI] Prompt length: ${prompt.length} chars`);
  console.log("───────────────────────────────────────");
  
  // 2. Simula latenza di rete (1.5-2.5 secondi)
  const latenza = 1500 + Math.random() * 1000;
  console.log(`[AI] ⏳ Attesa risposta... (${Math.round(latenza)}ms)`);
  
  await new Promise((resolve) => setTimeout(resolve, latenza));
  
  // 3. Genera risposta basata sul profilo
  const risposteFake = generaRispostaFakeAI(profilo);
  
  console.log("[AI] ✅ Risposta ricevuta dall'API");
  console.log("───────────────────────────────────────");
  console.log("[AI] 📦 DOMANDE GENERATE DAL PROFILO:");
  risposteFake.forEach((d, idx) => {
    console.log(`[AI]   ${idx + 1}. "${d.testoDomanda}"`);
    console.log(`[AI]      Opzioni: ${d.opzioni.join(" | ")}`);
    console.log(`[AI]      Risposta corretta: ${d.opzioni[d.rispostaCorretta]}`);
  });
  console.log("───────────────────────────────────────");
  
  // 4. Trasforma in formato Domanda completo
  const domandeComplete: Domanda[] = risposteFake.map((d, idx) => ({
    id: `ai-${profilo.nome.toLowerCase()}-${Date.now()}-${idx}`,
    testoDomanda: d.testoDomanda,
    opzioni: d.opzioni as [string, string, string],
    rispostaCorretta: d.rispostaCorretta,
    categoria: "memoria",
    livelloDifficolta: 1,
  }));
  
  console.log("[AI] 🔄 Domande trasformate nel formato interno");
  console.log(`[AI]    - ${domandeComplete.length} domande generate`);
  console.log(`[AI]    - Profilo usato: ${profilo.nome} (${profilo.exMestiere})`);
  console.log("═══════════════════════════════════════");
  
  return domandeComplete;
}

/**
 * Valida che la risposta JSON dell'AI rispetti lo schema richiesto
 */
export function validaRispostaAI(data: unknown): data is DomandaSenzaMeta[] {
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
