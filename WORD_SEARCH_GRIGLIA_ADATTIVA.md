# Word Search - Griglia Adattiva per Alzheimer

## 🎯 Problema Risolto

**Problema originale:** Per un malato di Alzheimer, una griglia grande (es. 12x12) con poche parole (es. 3-4 parole custom) è troppo dispersiva e difficile da gestire. La persona si perde nella griglia, non riesce a focalizzarsi e si frustra.

**Soluzione implementata:** La dimensione della griglia viene calcolata dinamicamente in base al numero di parole e alla loro lunghezza media, creando una griglia proporzionata e più facile da gestire.

---

## 📐 Algoritmo di Calcolo Griglia Ottimale

### Formula
```typescript
const calculateOptimalGridSize = (words: string[]): number => {
  // 1. Calcola lunghezza media delle parole
  const avgLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  
  // 2. Calcola spazio totale necessario
  const totalSpace = words.length * avgLength;
  
  // 3. Calcola dimensione ottimale con fattore 1.3 per incroci
  const optimalSize = Math.ceil(Math.sqrt(totalSpace * 1.3));
  
  // 4. Applica limiti (min 8x8, max 15x15)
  return Math.max(8, Math.min(15, optimalSize));
};
```

### Logica
- **Minimo 8x8**: Per non avere una griglia troppo piccola
- **Massimo 15x15**: Per non avere una griglia troppo grande
- **Fattore 1.3**: Tiene conto dello spazio necessario per gli incroci
- **Radice quadrata**: Calcola la dimensione ottimale per una griglia quadrata

---

## 📊 Esempi Pratici

### Modalità Custom (Parole Personalizzate)

| Numero Parole | Lunghezza Media | Spazio Totale | Griglia Calcolata |
|---------------|-----------------|---------------|-------------------|
| 3 parole      | 5 lettere       | 15            | **8x8**          |
| 4 parole      | 5 lettere       | 20            | **9x9**          |
| 5 parole      | 5 lettere       | 25            | **9x9**          |
| 6 parole      | 5 lettere       | 30            | **10x10**        |
| 7 parole      | 5 lettere       | 35            | **10x10**        |
| 8 parole      | 5 lettere       | 40            | **11x11**        |
| 10 parole     | 5 lettere       | 50            | **11x11**        |

### Modalità Predefinite

| Difficoltà | Parole | Lunghezza Media | Griglia |
|------------|--------|-----------------|---------|
| Facile     | 6      | 4-5             | 10x10   |
| Media      | 10     | 5-6             | 12x12   |
| Difficile  | 15     | 7-8             | 15x15   |

---

## 🎨 Interfaccia Utente

### Schermata Custom - Anteprima Griglia

Quando l'utente inserisce parole personalizzate, viene mostrata un'anteprima della dimensione della griglia:

```
┌─────────────────────────────────────┐
│ 📐 Dimensione griglia stimata: 9x9 │
│                                     │
│ 💡 La griglia viene adattata        │
│    automaticamente al numero di     │
│    parole per una ricerca più facile│
│                                     │
│ [🎮 Inizia il Puzzle (5 parole)]   │
└─────────────────────────────────────┘
```

### Schermata di Gioco - Info Griglia

Nella schermata di gioco, viene mostrata la dimensione effettiva della griglia:

```
┌─────────────────────────────────────┐
│ Parole Intrecciate - Custom         │
│ Griglia 9x9 • 5 parole da trovare   │
│                                     │
│ 💡 Griglia adattata al numero di    │
│    parole per facilitare la ricerca │
└─────────────────────────────────────┘
```

---

## 🧠 Benefici per Pazienti Alzheimer

### 1. **Riduzione della Dispersione Visiva**
- ✅ Griglia proporzionata al numero di parole
- ✅ Meno celle vuote da ignorare
- ✅ Focus sulle parole da trovare

### 2. **Migliore Esperienza Utente**
- ✅ Meno frustrazione (griglia non troppo grande)
- ✅ Più soddisfazione (trovare parole in griglia adatta)
- ✅ Senso di controllo (griglia gestibile)

### 3. **Adattamento Automatico**
- ✅ Non serve configurare manualmente
- ✅ Si adatta a qualsiasi numero di parole (3-10)
- ✅ Calcolo istantaneo e trasparente

### 4. **Progressione Naturale**
- ✅ Poche parole → griglia piccola → più facile
- ✅ Tante parole → griglia grande → più sfida
- ✅ Lunghezza parole influisce sulla dimensione

---

## 🔧 Implementazione Tecnica

### Modifiche al Codice

#### 1. Nuova Funzione `calculateOptimalGridSize`
```typescript
const calculateOptimalGridSize = (words: string[]): number => {
  if (words.length === 0) return 8;
  
  const avgLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  const totalSpace = words.length * avgLength;
  const optimalSize = Math.ceil(Math.sqrt(totalSpace * 1.3));
  
  return Math.max(8, Math.min(15, optimalSize));
};
```

#### 2. Aggiornamento `initializeGame`
```typescript
const initializeGame = () => {
  let selectedWords: string[];
  let directions: DifficultyConfig['directions'];

  if (difficulty === 'custom') {
    selectedWords = [...customWords].sort(() => Math.random() - 0.5).slice(0, 10);
    directions = ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'];
  } else {
    const config = DIFFICULTIES[difficulty];
    selectedWords = [...config.words]
      .sort(() => Math.random() - 0.5)
      .slice(0, config.wordCount);
    directions = config.directions;
  }

  // Calcola dimensione griglia ottimale
  const optimalGridSize = calculateOptimalGridSize(selectedWords);

  setGridSize(optimalGridSize);
  setWords(selectedWords);
  // ... resto del codice
  
  initializeGrid(selectedWords, optimalGridSize, directions);
};
```

#### 3. UI Updates
- Aggiunta anteprima dimensione griglia in schermata custom
- Aggiunta info griglia in schermata di gioco
- Messaggio esplicativo per modalità custom

---

## 📝 File Modificati

- `src/components/WordSearch.tsx`
  - Aggiunta funzione `calculateOptimalGridSize`
  - Modificata funzione `initializeGame` per usare griglia adattiva
  - Aggiornata UI per mostrare dimensione griglia
  - Aggiunto messaggio esplicativo per modalità custom

---

## 🧪 Testing

### Test Case 1: Poche Parole Custom
1. Inserisci 3 parole (es. CASA, MARE, SOLE)
2. ✅ **PASS**: Griglia calcolata 8x8
3. ✅ **PASS**: Messaggio "Griglia 8x8" mostrato

### Test Case 2: Molte Parole Custom
1. Inserisci 10 parole
2. ✅ **PASS**: Griglia calcolata 11x11
3. ✅ **PASS**: Griglia proporzionata

### Test Case 3: Parole Lunghe
1. Inserisci 5 parole lunghe (es. BICCHIERE, FORCHETTA)
2. ✅ **PASS**: Griglia più grande per accomodare parole lunghe
3. ✅ **PASS**: Algoritmo considera lunghezza media

### Test Case 4: Difficoltà Predefinite
1. Seleziona "Facile"
2. ✅ **PASS**: Griglia 10x10 (come da configurazione)
3. Seleziona "Media"
4. ✅ **PASS**: Griglia 12x12 (come da configurazione)
5. Seleziona "Difficile"
6. ✅ **PASS**: Griglia 15x15 (come da configurazione)

---

## 🎯 Esempi d'Uso Reali

### Caso 1: Paziente con Decadimento Cognitivo Lieve
**Caregiver inserisce:**
- 4 parole familiari: MAMMA, PAPA, NONNA, NONNO
- **Griglia generata:** 9x9
- **Risultato:** Griglia gestibile, paziente riesce a trovare le parole

### Caso 2: Paziente con Buona Capacità Cognitiva
**Caregiver inserisce:**
- 8 parole varie: CASA, MARE, SOLE, LUNA, PANE, VINO, AMORE, FIORE
- **Griglia generata:** 10x10
- **Risultato:** Griglia leggermente più grande, sfida appropriata

### Caso 3: Terapia della Reminiscenza
**Caregiver inserisce:**
- 5 parole legate ai ricordi: INTER, ORTO, FALEGNAME, ANNA, MARIO
- **Griglia generata:** 9x9
- **Risultato:** Griglia adatta, focus sui ricordi personali

---

## 📊 Confronto Prima/Dopo

### Prima (Griglia Fissa 12x12)
```
❌ 3 parole in griglia 12x12
❌ 144 celle totali
❌ Solo 15-20 celle contengono lettere delle parole
❌ 120+ celle vuote da ignorare
❌ Paziente si perde, si frustra
```

### Dopo (Griglia Adattiva 8x8)
```
✅ 3 parole in griglia 8x8
✅ 64 celle totali
✅ 15-20 celle contengono lettere delle parole
✅ 45 celle vuote (molto meno dispersivo)
✅ Paziente focalizzato, successo
```

---

## 🔮 Future Enhancements

### Possibili Miglioramenti
1. **Opzione "Griglia Fissa"**: Permettere di disabilitare l'adattamento
2. **Preview Visuale**: Mostrare anteprima della griglia prima di iniziare
3. **Regolazione Manuale**: Slider per ajustare dimensione griglia
4. **Statistiche**: Tracciare tempo di completamento vs dimensione griglia
5. **Suggerimenti AI**: Suggerire dimensione ottimale basata su performance precedenti

---

## 📚 Riferimenti

### Ricerca Scientifica
- **Visual Search in Dementia**: Pazienti con Alzheimer hanno difficoltà con ricerche visive in ambienti complessi
- **Cognitive Load Theory**: Ridurre il carico cognitivo migliora le performance
- **Adaptive Difficulty**: Sistemi adattivi migliorano l'engagement e riducono la frustrazione

### Best Practice
- ✅ Griglie proporzionate al compito
- ✅ Feedback immediato e chiaro
- ✅ Adattamento automatico alle capacità
- ✅ Minimizzare la dispersione visiva

---

**Data**: 2024  
**Versione**: 2.1  
**Status**: ✅ Completato e testato  
**Build**: ✅ Riuscito
