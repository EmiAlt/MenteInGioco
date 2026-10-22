/**
 * Profilo del paziente per la generazione di esercizi personalizzati
 * 
 * Questo profilo contiene informazioni biografiche rilevanti per creare
 * domande di stimolazione cognitiva basate sui ricordi personali e gli hobby
 * del paziente, rendendo gli esercizi più significativi e coinvolgenti.
 */

export interface ProfiloPaziente {
  nome: string;
  annoNascita: number;
  exMestiere: string;
  hobby: string[];
}

/**
 * Costante con i dati del paziente Mario
 */
export const profiloPaziente: ProfiloPaziente = {
  nome: "Mario",
  annoNascita: 1950,
  exMestiere: "Falegname",
  hobby: ["Inter", "Orto"],
};

/**
 * Genera un prompt strutturato da inviare a un'API AI (LLM)
 * per creare quiz personalizzati basati sul profilo del paziente.
 * 
 * @param profilo - Dati del paziente
 * @param numeroDomande - Numero di domande da generare (default: 3)
 * @returns Stringa del prompt completo e strutturato
 */
export function generaPromptPersonalizzato(
  profilo: ProfiloPaziente,
  numeroDomande: number = 3
): string {
  const prompt = `Agisci come un terapista cognitivo specializzato nella stimolazione della memoria per anziani con lieve decadimento cognitivo.

## CONTESTO PAZIENTE
- Nome: ${profilo.nome}
- Anno di nascita: ${profilo.annoNascita} (età: ${new Date().getFullYear() - profilo.annoNascita} anni)
- Ex mestiere: ${profilo.exMestiere}
- Hobby e interessi: ${profilo.hobby.join(", ")}

## TASK
Genera un quiz a scelta multipla di livello FACILE basato sui ricordi e gli hobby di questa persona.
Le domande devono essere:
- Rilevanti per la vita personale del paziente (lavoro, passioni, ricordi d'epoca)
- Rassicuranti e positive, evitando argomenti tristi o frustranti
- Semplici da comprendere, con linguaggio chiaro e diretto
- Stimolanti per la memoria a lungo termine e le conoscenze personali

## REQUISITI TECNICI
Genera esattamente ${numeroDomande} domande.
Ogni domanda deve avere:
- testoDomanda: stringa con la domanda
- opzioni: array di esattamente 3 stringhe (una corretta, due distrattori plausibili)
- rispostaCorretta: indice numerico (0, 1 o 2) della risposta corretta nell'array opzioni

## FORMATO OUTPUT
Restituisci TASSATIVAMENTE il risultato in formato JSON con questa struttura:
[
  {
    "testoDomanda": "stringa della domanda",
    "opzioni": ["opzione 1", "opzione 2", "opzione 3"],
    "rispostaCorretta": 0
  },
  ...
]

Non includere testo aggiuntivo, spiegazioni o commenti. Restituisci SOLO il JSON valido.`;

  return prompt;
}

/**
 * Funzione di utilità per loggare il prompt generato
 */
export function logPromptGenerato(profilo: ProfiloPaziente): void {
  const prompt = generaPromptPersonalizzato(profilo);
  
  console.log("═══════════════════════════════════════");
  console.log("[AI] 📝 PROMPT GENERATO PER LLM");
  console.log("═══════════════════════════════════════");
  console.log(prompt);
  console.log("═══════════════════════════════════════");
  console.log(`[AI] Lunghezza prompt: ${prompt.length} caratteri`);
  console.log("═══════════════════════════════════════");
}
