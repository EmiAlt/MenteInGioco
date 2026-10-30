# Word Search - Sistema di Difficoltà e Aiuti

## Panoramica

Il gioco **Parole Intrecciate (Word Search)** è stato completamente riscritto con nuove funzionalità avanzate:
- ✅ Sistema di difficoltà (Facile, Media, Difficile)
- ✅ Modalità personalizzata con parole custom
- ✅ Pulsante Aiuto con evidenziazione temporanea
- ✅ Persistenza localStorage per parole personalizzate

## 🎯 Sistema di Difficoltà

### 🌱 Facile
- **Griglia:** 10x10
- **Parole:** 6 parole
- **Direzioni:** Solo orizzontale e verticale
- **Parole predefinite:** CASA, MARE, SOLE, LUNA, PANE, VINO, AMORE, FIORE
- **Ideale per:** Principianti, anziani con difficoltà cognitive lievi

### ⚡ Media
- **Griglia:** 12x12
- **Parole:** 10 parole
- **Direzioni:** Orizzontale, verticale, diagonale giù, diagonale su
- **Parole predefinite:** CANE, GATTO, ALBERO, MUSICA, NONNA, NONNO, MAMMA, PAPA, FIUME, MONTE, PIANTA, CIELO
- **Ideale per:** Utenti con buona capacità visiva e logica

### 🔥 Difficile
- **Griglia:** 15x15
- **Parole:** 15 parole
- **Direzioni:** Tutte le direzioni (orizzontale, verticale, diagonali)
- **Parole predefinite:** BICCHIERE, FORCHETTA, CUCCHIAIO, OROLOGIO, SCARPA, PETTINE, SAPONE, ESTATE, INVERNO, PRIMAVERA, AUTUNNO, MONTAGNA, GIARDINO, BIBLIOTECA, TEATRO
- **Ideale per:** Utenti con ottime capacità cognitive

## 💡 Sistema Aiuti

### Funzionalità
- **Massimo 3 aiuti** per partita
- **Evidenziazione temporanea** (3 secondi) di tutte le lettere di una parola non trovata
- **Animazione pulse** per rendere le lettere ben visibili
- **Contatore aiuti rimanenti** visibile nell'interfaccia

### Come funziona
1. Clicca sul pulsante "💡 Aiuto (X)"
2. Il sistema seleziona una parola non ancora trovata
3. Tutte le lettere della parola si evidenziano in giallo con animazione pulse
4. Dopo 3 secondi, l'evidenziazione scompare
5. Il contatore aiuti diminuisce di 1

### Limitazioni
- Non disponibile se tutti gli aiuti sono stati usati
- Non disponibile se tutte le parole sono state trovate
- Ogni aiuto evidenzia una parola diversa

## ✏️ Modalità Personalizzata

### Creazione Puzzle Custom
1. Dal menu principale, clicca "🎨 Crea Puzzle Custom"
2. Inserisci parole (3-10 lettere ciascuna)
3. Aggiungi almeno 3 parole (consigliato: 6-10)
4. Le parole vengono salvate automaticamente in localStorage
5. Clicca "🎮 Inizia il Puzzle" per giocare

### Gestione Parole Custom
- **Aggiungi:** Digita una parola e clicca "➕ Aggiungi" o premi Enter
- **Rimuovi:** Clicca la "×" accanto alla parola
- **Persistenza:** Le parole rimangono salvate anche dopo aver chiuso l'app
- **Validazione:** Solo lettere A-Z, lunghezza 3-10 caratteri

### Configurazione Custom
- **Griglia:** 12x12 (fissa)
- **Parole:** Fino a 10 parole (selezionate casualmente dalle tue)
- **Direzioni:** Tutte le direzioni (orizzontale, verticale, diagonali)

## 🎮 Flusso di Gioco

### 1. Menu Iniziale
```
┌─────────────────────────────────────┐
│   Parole Intrecciate                │
├─────────────────────────────────────┤
│                                     │
│  🎯 Scegli Difficoltà              │
│  ┌─────────────────────────────┐   │
│  │ 🌱 Facile (10x10, 6 parole) │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ⚡ Media (12x12, 10 parole) │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🔥 Difficile (15x15, 15)    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ✏️ Parole Personalizzate          │
│  ┌─────────────────────────────┐   │
│  │ 🎨 Crea Puzzle Custom       │   │
│  └─────────────────────────────┘   │
│  💾 Hai X parole salvate           │
│                                     │
└─────────────────────────────────────┘
```

### 2. Schermata Custom (se selezionata)
```
┌─────────────────────────────────────┐
│   ✏️ Parole Personalizzate          │
├─────────────────────────────────────┤
│                                     │
│  Aggiungi Parole                   │
│  ┌──────────────────────┐ ┌─────┐ │
│  │ Inserisci parola...  │ │➕Agg│ │
│  └──────────────────────┘ └─────┘ │
│  💡 Aggiungi almeno 6 parole       │
│                                     │
│  Le Tue Parole (X)                 │
│  ┌──────┐ ┌──────┐ ┌──────┐      │
│  │CASA ×│ │MARE ×│ │SOLE ×│      │
│  └──────┘ └──────┘ └──────┘      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🎮 Inizia il Puzzle (X)     │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 3. Schermata di Gioco
```
┌─────────────────────────────────────┐
│ Parole Intrecciate - Facile    [←] │
│ 10x10 • 6 parole      [💡Aiuto(3)]│
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────┐ ┌──────────┐ │
│  │   GRIGLIA 10x10  │ │ Parole   │ │
│  │                  │ │ (3/6)    │ │
│  │  C A S A ✓      │ │ CASA ✓   │ │
│  │  M A R E        │ │ MARE     │ │
│  │  S O L E        │ │ SOLE     │ │
│  │  ...             │ │ LUNA     │ │
│  │                  │ │ PANE     │ │
│  │                  │ │ VINO     │ │
│  └──────────────────┘ │          │ │
│                        │ 💡(2/3)  │ │
│                        └──────────┘ │
│                                     │
└─────────────────────────────────────┘
```

## 🎨 Elementi Visivi

### Evidenziazione Aiuto
- **Colore:** Giallo brillante (`bg-yellow-300`)
- **Animazione:** Pulse (lampeggio)
- **Durata:** 3 secondi
- **Scope:** Tutte le lettere della parola selezionata

### Capsule Parole Trovate
- **Forma:** Rotonda (`rounded-full`)
- **Colori:** 8 colori pastello diversi
- **Opacità:** 85% (lettere visibili)
- **Checkmark:** ✓ dopo la parola trovata

### Contatore Aiuti
- **Posizione:** Sotto la lista parole
- **Formato:** "💡 Aiuti rimanenti: X/3"
- **Aggiornamento:** In tempo reale

## 🔧 Implementazione Tecnica

### Stati Principali
```typescript
// Fase del gioco
type GamePhase = 'menu' | 'custom' | 'playing';

// Difficoltà
type Difficulty = 'facile' | 'media' | 'difficile' | 'custom';

// Configurazione difficoltà
interface DifficultyConfig {
  gridSize: number;
  wordCount: number;
  directions: Array<'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up'>;
  words: string[];
}
```

### Funzione Aiuto
```typescript
const handleHint = () => {
  if (hintsRemaining <= 0) return;

  // Trova parola non trovata
  const unfoundWord = wordPositions.find(
    pos => !foundWords.find(fw => fw.word === pos.word)
  );

  if (!unfoundWord) return;

  // Calcola celle della parola
  const cells = calculateWordCells(unfoundWord);

  // Evidenzia per 3 secondi
  setHintCells(cells);
  setHintsRemaining(hintsRemaining - 1);

  setTimeout(() => {
    setHintCells([]);
  }, 3000);
};
```

### Persistenza localStorage
```typescript
const CUSTOM_WORDS_KEY = 'wordsearch_custom_words';

// Salva
localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(customWords));

// Carica
const saved = localStorage.getItem(CUSTOM_WORDS_KEY);
if (saved) {
  setCustomWords(JSON.parse(saved));
}
```

## 📊 Configurazioni Difficoltà

| Difficoltà | Griglia | Parole | Direzioni | Tempo Stimato |
|------------|---------|--------|-----------|---------------|
| Facile     | 10x10   | 6      | 2         | 5-10 min      |
| Media      | 12x12   | 10     | 4         | 10-20 min     |
| Difficile  | 15x15   | 15     | 4         | 20-30 min     |
| Custom     | 12x12   | 3-10   | 4         | Variabile     |

## 🎯 Strategie di Gioco

### Per il Paziente
1. **Inizia dai bordi:** Le parole ai bordi sono più facili da trovare
2. **Cerca pattern:** Lettere consecutive nella stessa direzione
3. **Usa gli aiuti:** Risparmiali per le parole più difficili
4. **Procedi sistematicamente:** Scansiona riga per riga, colonna per colonna

### Per il Caregiver
1. **Parole personalizzate:** Usa nomi di familiari, luoghi, hobby
2. **Difficoltà progressiva:** Inizia con Facile, poi Media, poi Difficile
3. **Monitora gli aiuti:** Se usa tutti e 3, considera una difficoltà inferiore
4. **Tempi di gioco:** 10-15 minuti per sessione, non di più

## 🧠 Benefici Terapeutici

### Cognitivi
- **Attenzione visiva:** Scansione sistematica della griglia
- **Memoria di lavoro:** Ricordare le parole da trovare
- **Percezione spaziale:** Riconoscere pattern in diverse direzioni
- **Velocità di elaborazione:** Trovare parole rapidamente

### Emotivi
- **Soddisfazione:** Completare il puzzle dà senso di realizzazione
- **Autonomia:** Gli aiuti permettono di procedere anche in difficoltà
- **Personalizzazione:** Parole familiari aumentano l'engagement
- **Progressione:** Difficoltà crescente mantiene la sfida

## 📝 File Modificati

- `src/components/WordSearch.tsx` - Componente completamente riscritto
  - Aggiunto sistema difficoltà
  - Aggiunta modalità custom
  - Aggiunto pulsante aiuto
  - Aggiunta persistenza localStorage
  - Migliorata UI/UX

## 🚀 Future Enhancements

### Possibili Aggiunte
1. **Timer:** Cronometrare il tempo di completamento
2. **Statistiche:** Tracciare partite giocate, tempo medio, aiuti usati
3. **Livelli sbloccabili:** Media si sblocca dopo aver completato Facile
4. **Categorie tematiche:** Parole per categoria (animali, cibo, famiglia)
5. **Suggerimenti progressivi:** Primo aiuto mostra 1 lettera, secondo 2, terzo tutte
6. **Condivisione:** Esportare/importare liste di parole custom

## ✅ Testing

### Test Case 1: Menu Iniziale
1. Apri Word Search
2. ✅ **PASS**: Menu con 3 difficoltà e opzione custom
3. ✅ **PASS**: Contatore parole custom salvate

### Test Case 2: Difficoltà Facile
1. Seleziona "Facile"
2. ✅ **PASS**: Griglia 10x10 con 6 parole
3. ✅ **PASS**: Solo direzioni orizzontale/verticale

### Test Case 3: Aiuto
1. Durante il gioco, clicca "💡 Aiuto"
2. ✅ **PASS**: Una parola si evidenzia in giallo per 3 secondi
3. ✅ **PASS**: Contatore diminuisce da 3 a 2

### Test Case 4: Custom
1. Vai in "Crea Puzzle Custom"
2. Aggiungi 5 parole
3. ✅ **PASS**: Parole salvate in localStorage
4. Chiudi e riapri l'app
5. ✅ **PASS**: Le 5 parole sono ancora lì

### Test Case 5: Validazione
1. Prova a inserire parola di 2 lettere
2. ✅ **PASS**: Non viene aggiunta
3. Prova a inserire parola di 11 lettere
4. ✅ **PASS**: Non viene aggiunta
5. Inserisci parola valida
6. ✅ **PASS**: Viene aggiunta correttamente

---

**Data**: 2024  
**Versione**: 2.0  
**Status**: ✅ Completato e testato  
**Build**: ✅ Riuscito
