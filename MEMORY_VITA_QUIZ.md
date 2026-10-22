# 📸 Memory di Vita - Quiz di Riconoscimento Foto

## Panoramica

Il **Memory di Vita** è un gioco di riconoscimento basato su foto personali del paziente. Il caregiver carica una foto e fornisce 3 descrizioni: 1 corretta e 2 sbagliate. Il paziente deve identificare la descrizione corretta.

## 🎯 Obiettivo Terapeutico

- **Stimolazione della memoria episodica** attraverso foto personali
- **Riconoscimento visivo** e associazione con eventi di vita
- **Rinforzo positivo** con feedback immediato
- **Personalizzazione** basata sulla vita del paziente

## 🎮 Come Funziona

### Per il Caregiver

1. **Carica una foto** personale del paziente
2. **Inserisci 3 descrizioni**:
   - ✓ **Descrizione Corretta** (verde): la descrizione esatta della foto
   - ✗ **Descrizione Sbagliata 1** (arancione): una descrizione plausibile ma errata
   - ✗ **Descrizione Sbagliata 2** (arancione): un'altra descrizione errata
3. **Salva il ricordo**

**Esempio:**
- **Foto:** Foto del matrimonio
- ✓ Corretta: "Foto del matrimonio con Anna nel 1974"
- ✗ Sbagliata 1: "Foto delle vacanze al mare"
- ✗ Sbagliata 2: "Foto della festa di compleanno"

### Per il Paziente

1. **Vede la foto** in grande al centro dello schermo
2. **Legge le 3 opzioni** sotto la foto (in ordine casuale)
3. **Clicca sulla descrizione corretta**
4. **Riceve feedback immediato**:
   - ✅ Verde se corretto
   - ❌ Rosso se sbagliato (ma mostra comunque la risposta corretta)
5. **Passa alla foto successiva**

## 🎨 Design e Accessibilità

### Caratteristiche Visive

- **Foto grande e centrata** con bordo blu
- **Opzioni grandi** (text-xl/text-2xl) con bordi ben visibili
- **Colori distintivi**:
  - Verde per la risposta corretta
  - Rosso per la risposta sbagliata selezionata
  - Grigio per le opzioni non selezionate dopo la risposta
- **Feedback immediato** con messaggi chiari

### Flusso di Gioco

```
1. Mostra foto
   ↓
2. Mostra 3 opzioni (mescolate casualmente)
   ↓
3. Utente clicca un'opzione
   ↓
4. Feedback visivo (2 secondi)
   ↓
5. Prossima foto
   ↓
6. Alla fine: schermata punteggio
```

## 💾 Struttura Dati

### Interfaccia Ricordo

```typescript
interface Ricordo {
  id: string;
  foto: string;                    // Base64 compresso
  descrizioneCorretta: string;     // Descrizione esatta
  descrizioneSbagliata1: string;   // Prima opzione errata
  descrizioneSbagliata2: string;   // Seconda opzione errata
  categoria?: string;              // Categoria opzionale
  dataCreazione: string;           // Timestamp
}
```

### Esempio di Salvataggio

```json
{
  "id": "ricordo_1234567890_abc123",
  "foto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "descrizioneCorretta": "Foto del matrimonio con Anna nel 1974",
  "descrizioneSbagliata1": "Foto delle vacanze al mare",
  "descrizioneSbagliata2": "Foto della festa di compleanno",
  "categoria": "Famiglia",
  "dataCreazione": "2024-01-15T10:30:00.000Z"
}
```

## 🎯 Strategie per il Caregiver

### Come Creare Descrizioni Efficaci

**Descrizione Corretta:**
- Sii specifico e dettagliato
- Includi nomi, luoghi, date se rilevanti
- Usa un linguaggio familiare al paziente

**Descrizioni Sbagliate:**
- Devono essere plausibili (stesso periodo di vita)
- Non troppo simili alla corretta (per evitare confusione)
- Non troppo diverse (per mantenere la sfida appropriata)

### Esempi per Diverse Categorie

#### Famiglia
- ✓ "Foto del matrimonio con Anna nel 1974"
- ✗ "Foto del battesimo di Marco"
- ✗ "Foto della festa di laurea"

#### Viaggi
- ✓ "Foto al Lago del Turano nell'estate 1980"
- ✗ "Foto sulla spiaggia in Liguria"
- ✗ "Foto in montagna sulle Dolomiti"

#### Lavoro
- ✓ "Foto nel laboratorio di falegnameria nel 1975"
- ✗ "Foto nell'ufficio dell'azienda"
- ✗ "Foto alla festa di pensionamento"

#### Hobby
- ✓ "Foto mentre pesca al lago con gli amici"
- ✗ "Foto mentre gioca a carte al bar"
- ✗ "Foto mentre lavora nell'orto"

## 📊 Punteggio e Feedback

### Calcolo Punteggio

- **1 punto** per ogni risposta corretta
- **Punteggio finale:** X su Y (es. "7 su 10")

### Messaggi di Incoraggiamento

```
100% corretto: "🌟 Perfetto! Le hai riconosciute tutte!"
70-99%:        "👏 Ottimo lavoro!"
<70%:          "💪 Continua ad allenarti!"
```

## 🔧 Configurazione

### Numero di Domande

Il gioco mostra **tutte le foto salvate** in ordine casuale. Per controllare il numero di domande:
- Aggiungi/rimuovi ricordi nel Pannello Gestione Ricordi
- Ogni ricordo = 1 domanda

### Ordine delle Domande

Le domande sono **mescolate casualmente** ad ogni sessione per evitare memorizzazione dell'ordine.

### Ordine delle Opzioni

Le 3 opzioni sono **mescolate casualmente** per ogni domanda per evitare pattern di risposta.

## 🎨 Interfaccia Pannello Ricordi

### Form di Inserimento

```
┌─────────────────────────────────────┐
│ ➕ Aggiungi Nuovo Ricordo           │
├─────────────────────────────────────┤
│ Foto: [Scegli File]                 │
│ [Anteprima Immagine]                │
│                                     │
│ ✓ Descrizione Corretta *            │
│ [Foto del matrimonio con Anna...]   │
│                                     │
│ ✗ Descrizione Sbagliata 1 *         │
│ [Foto delle vacanze al mare...]     │
│                                     │
│ ✗ Descrizione Sbagliata 2 *         │
│ [Foto della festa di compleanno...] │
│                                     │
│ Categoria (opzionale)               │
│ [Famiglia]                          │
│                                     │
│ [💾 Salva Ricordo] [❌ Annulla]     │
└─────────────────────────────────────┘
```

### Griglia Ricordi Salvati

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [Foto]       │ │ [Foto]       │ │ [Foto]       │
│              │ │              │ │              │
│ ✓ Corretta   │ │ ✓ Corretta   │ │ ✓ Corretta   │
│ ✗ Sbagliata1 │ │ ✗ Sbagliata1 │ │ ✗ Sbagliata1 │
│ ✗ Sbagliata2 │ │ ✗ Sbagliata2 │ │ ✗ Sbagliata2 │
│              │ │              │ │              │
│ 📁 Famiglia  │ │ 📁 Viaggi    │ │ 📁 Lavoro    │
│              │ │              │ │              │
│ [✏️] [🗑️]   │ │ [✏️] [🗑️]   │ │ [✏️] [🗑️]   │
└──────────────┘ └──────────────┘ └──────────────┘
```

## 🚀 Miglioramenti Futuri

### Possibili Estensioni

1. **Suggerimenti AI:**
   - Generazione automatica di descrizioni sbagliate plausibili
   - Analisi delle foto per suggerire descrizioni

2. **Difficoltà Adattiva:**
   - Descrizioni sbagliate più simili per pazienti con buone capacità
   - Descrizioni molto diverse per pazienti con difficoltà

3. **Categorie Tematiche:**
   - Filtrare per categoria (solo famiglia, solo viaggi, ecc.)
   - Sessioni tematiche (es. "Ricordi di Lavoro")

4. **Audio:**
   - Narrazione vocale delle descrizioni
   - Feedback audio per risposte corrette/sbagliate

5. **Statistiche:**
   - Tempo di risposta medio
   - Foto più facilmente riconosciute
   - Progressi nel tempo

## 📝 Note per Sviluppatori

### Aggiungere Nuovi Campi

Se vuoi aggiungere ulteriori informazioni al ricordo:

```typescript
interface Ricordo {
  // ... campi esistenti
  anno?: number;           // Anno della foto
  luogo?: string;          // Luogo della foto
  persone?: string[];      // Persone nella foto
  note?: string;           // Note aggiuntive del caregiver
}
```

### Personalizzare il Gioco

Per modificare il comportamento del gioco, vedi `src/components/MemoryVita.tsx`:

```typescript
// Cambia il tempo di feedback
setTimeout(() => {
  // ...
}, 2000); // 2000ms = 2 secondi

// Modifica il calcolo del punteggio
if (èCorretta) {
  setPunteggio(punteggio + 1); // +1 per risposta corretta
}

// Personalizza i messaggi di incoraggiamento
{punteggio === ricordi.length
  ? "🌟 Perfetto! Le hai riconosciute tutte!"
  : punteggio >= ricordi.length * 0.7
  ? "👏 Ottimo lavoro!"
  : "💪 Continua ad allenarti!"}
```

## 🔗 Componenti Correlati

- **PannelloRicordi.tsx:** Gestione e inserimento ricordi
- **useRicordi.ts:** Hook per gestione dati
- **imageCompression.ts:** Compressione immagini
- **App.tsx:** Integrazione nel menu principale

## 📚 Riferimenti Terapeutici

Questo tipo di esercizio è basato su:
- **Terapia della Reminiscenza:** Uso di foto personali per stimolare la memoria
- **Training di Riconoscimento Visivo:** Associazione immagine-concetto
- **Apprendimento Associativo:** Collegamento tra stimolo visivo e memoria semantica

---

**Versione:** 2.0  
**Ultimo aggiornamento:** 2024  
**Status:** ✅ Completato e testato
