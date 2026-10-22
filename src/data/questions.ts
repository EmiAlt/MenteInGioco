/**
 * Struttura JSON delle domande per la stimolazione cognitiva
 * 
 * Categorie disponibili:
 * - "memoria"       → domande di memoria a breve/lungo termine
 * - "orientamento"  → domande di orientamento temporale e spaziale
 * - "linguaggio"    → domande di comprensione e produzione verbale
 * - "calcolo"       → domande di calcolo mentale semplice
 * - "logica"        → domande di ragionamento logico
 * 
 * Livelli di difficoltà:
 * - 1 = facile (adatto a utenti con lieve decadimento cognitivo)
 * - 2 = medio  (adatto a utenti con buone capacità residue)
 */

export interface Domanda {
  id: string;
  testoDomanda: string;
  opzioni: [string, string, string];
  rispostaCorretta: number; // indice 0, 1 o 2
  categoria: "memoria" | "orientamento" | "linguaggio" | "calcolo" | "logica";
  livelloDifficolta: 1 | 2;
}

export const domande: Domanda[] = [
  // ============================
  // LIVELLO 1 - FACILE
  // ============================

  // --- Memoria ---
  {
    id: "mem-1-001",
    testoDomanda: "Quanti mesi ci sono in un anno?",
    opzioni: ["10", "12", "8"],
    rispostaCorretta: 1,
    categoria: "memoria",
    livelloDifficolta: 1,
  },
  {
    id: "mem-1-002",
    testoDomanda: "Quale di questi è un frutto?",
    opzioni: ["Carota", "Mela", "Patata"],
    rispostaCorretta: 1,
    categoria: "memoria",
    livelloDifficolta: 1,
  },
  {
    id: "mem-1-003",
    testoDomanda: "Quante zampe ha un cane?",
    opzioni: ["2", "6", "4"],
    rispostaCorretta: 2,
    categoria: "memoria",
    livelloDifficolta: 1,
  },

  // --- Orientamento ---
  {
    id: "ori-1-001",
    testoDomanda: "Quale stagione viene dopo la primavera?",
    opzioni: ["Inverno", "Autunno", "Estate"],
    rispostaCorretta: 2,
    categoria: "orientamento",
    livelloDifficolta: 1,
  },
  {
    id: "ori-1-002",
    testoDomanda: "In quale momento della giornata si fa colazione?",
    opzioni: ["Mattina", "Sera", "Pomeriggio"],
    rispostaCorretta: 0,
    categoria: "orientamento",
    livelloDifficolta: 1,
  },
  {
    id: "ori-1-003",
    testoDomanda: "Quanti giorni ha una settimana?",
    opzioni: ["5", "7", "6"],
    rispostaCorretta: 1,
    categoria: "orientamento",
    livelloDifficolta: 1,
  },

  // --- Linguaggio ---
  {
    id: "lin-1-001",
    testoDomanda: "Qual è il contrario di 'grande'?",
    opzioni: ["Alto", "Piccolo", "Largo"],
    rispostaCorretta: 1,
    categoria: "linguaggio",
    livelloDifficolta: 1,
  },
  {
    id: "lin-1-002",
    testoDomanda: "Come si chiama il figlio del proprio figlio?",
    opzioni: ["Nipote", "Cugino", "Nephew"],
    rispostaCorretta: 0,
    categoria: "linguaggio",
    livelloDifficolta: 1,
  },
  {
    id: "lin-1-003",
    testoDomanda: "Quale di queste parole indica un animale?",
    opzioni: ["Tavolo", "Gatto", "Finestra"],
    rispostaCorretta: 1,
    categoria: "linguaggio",
    livelloDifficolta: 1,
  },

  // --- Calcolo ---
  {
    id: "cal-1-001",
    testoDomanda: "Quanto fa 2 + 3?",
    opzioni: ["4", "6", "5"],
    rispostaCorretta: 2,
    categoria: "calcolo",
    livelloDifficolta: 1,
  },
  {
    id: "cal-1-002",
    testoDomanda: "Quanto fa 10 - 4?",
    opzioni: ["6", "7", "5"],
    rispostaCorretta: 0,
    categoria: "calcolo",
    livelloDifficolta: 1,
  },
  {
    id: "cal-1-003",
    testoDomanda: "Quante dita ci sono in una mano?",
    opzioni: ["4", "5", "6"],
    rispostaCorretta: 1,
    categoria: "calcolo",
    livelloDifficolta: 1,
  },

  // --- Logica ---
  {
    id: "log-1-001",
    testoDomanda: "Quale di questi non è un mezzo di trasporto?",
    opzioni: ["Automobile", "Treno", "Armadio"],
    rispostaCorretta: 2,
    categoria: "logica",
    livelloDifficolta: 1,
  },
  {
    id: "log-1-002",
    testoDomanda: "Se piove, cosa si usa per non bagnarsi?",
    opzioni: ["Occhiali", "Ombrello", "Cappello"],
    rispostaCorretta: 1,
    categoria: "logica",
    livelloDifficolta: 1,
  },
  {
    id: "log-1-003",
    testoDomanda: "Quale colore si ottiene mescolando rosso e giallo?",
    opzioni: ["Verde", "Arancione", "Viola"],
    rispostaCorretta: 1,
    categoria: "logica",
    livelloDifficolta: 1,
  },

  // ============================
  // LIVELLO 2 - MEDIO
  // ============================

  // --- Memoria ---
  {
    id: "mem-2-001",
    testoDomanda: "In quale anno è iniziata la Seconda Guerra Mondiale?",
    opzioni: ["1939", "1945", "1914"],
    rispostaCorretta: 0,
    categoria: "memoria",
    livelloDifficolta: 2,
  },
  {
    id: "mem-2-002",
    testoDomanda: "Chi ha dipinto la Gioconda?",
    opzioni: ["Michelangelo", "Leonardo da Vinci", "Raffaello"],
    rispostaCorretta: 1,
    categoria: "memoria",
    livelloDifficolta: 2,
  },
  {
    id: "mem-2-003",
    testoDomanda: "Quale pianeta è chiamato il 'pianeta rosso'?",
    opzioni: ["Venere", "Giove", "Marte"],
    rispostaCorretta: 2,
    categoria: "memoria",
    livelloDifficolta: 2,
  },

  // --- Orientamento ---
  {
    id: "ori-2-001",
    testoDomanda: "In quale mese si festeggia il Natale?",
    opzioni: ["Gennaio", "Dicembre", "Novembre"],
    rispostaCorretta: 1,
    categoria: "orientamento",
    livelloDifficolta: 2,
  },
  {
    id: "ori-2-002",
    testoDomanda: "Quale giorno della settimana viene dopo giovedì?",
    opzioni: ["Sabato", "Venerdì", "Mercoledì"],
    rispostaCorretta: 1,
    categoria: "orientamento",
    livelloDifficolta: 2,
  },
  {
    id: "ori-2-003",
    testoDomanda: "Quante ore ci sono in un giorno?",
    opzioni: ["12", "24", "48"],
    rispostaCorretta: 1,
    categoria: "orientamento",
    livelloDifficolta: 2,
  },

  // --- Linguaggio ---
  {
    id: "lin-2-001",
    testoDomanda: "Qual è il sinonimo di 'contento'?",
    opzioni: ["Triste", "Felice", "Arrabbiato"],
    rispostaCorretta: 1,
    categoria: "linguaggio",
    livelloDifficolta: 2,
  },
  {
    id: "lin-2-002",
    testoDomanda: "Come si chiama la paura dell'acqua?",
    opzioni: ["Claustrofobia", "Idrofobia", "Agorafobia"],
    rispostaCorretta: 1,
    categoria: "linguaggio",
    livelloDifficolta: 2,
  },
  {
    id: "lin-2-003",
    testoDomanda: "Quale parola è un verbo?",
    opzioni: ["Bello", "Correre", "Tavolo"],
    rispostaCorretta: 1,
    categoria: "linguaggio",
    livelloDifficolta: 2,
  },

  // --- Calcolo ---
  {
    id: "cal-2-001",
    testoDomanda: "Quanto fa 15 + 27?",
    opzioni: ["42", "43", "41"],
    rispostaCorretta: 0,
    categoria: "calcolo",
    livelloDifficolta: 2,
  },
  {
    id: "cal-2-002",
    testoDomanda: "Quanto fa 6 × 4?",
    opzioni: ["20", "24", "28"],
    rispostaCorretta: 1,
    categoria: "calcolo",
    livelloDifficolta: 2,
  },
  {
    id: "cal-2-003",
    testoDomanda: "Quanto fa 100 - 37?",
    opzioni: ["63", "67", "73"],
    rispostaCorretta: 0,
    categoria: "calcolo",
    livelloDifficolta: 2,
  },

  // --- Logica ---
  {
    id: "log-2-001",
    testoDomanda: "Se tutti i cani sono animali e Fido è un cane, allora:",
    opzioni: ["Fido è un gatto", "Fido è un animale", "Fido è un pesce"],
    rispostaCorretta: 1,
    categoria: "logica",
    livelloDifficolta: 2,
  },
  {
    id: "log-2-002",
    testoDomanda: "Quale numero completa la serie: 2, 4, 6, 8, ...?",
    opzioni: ["9", "10", "12"],
    rispostaCorretta: 1,
    categoria: "logica",
    livelloDifficolta: 2,
  },
  {
    id: "log-2-003",
    testoDomanda: "Se un medico ti dà 3 pillole e dici di prenderne una ogni mezz'ora, in quanto tempo le finirai?",
    opzioni: ["1 ora e mezza", "1 ora", "2 ore"],
    rispostaCorretta: 1,
    categoria: "logica",
    livelloDifficolta: 2,
  },
];
