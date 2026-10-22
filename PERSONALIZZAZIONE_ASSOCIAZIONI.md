# 🔗 Personalizzazione Associazioni Tematiche

## Panoramica

Il caregiver può ora personalizzare completamente le associazioni usate nel gioco "Associazioni Tematiche", creando coppie di concetti correlati specifici per il paziente.

## 🎯 Come Funziona

### 1. Accesso alla Personalizzazione

Dal menu principale:
1. Clicca su **⚙️ Pannello Caregiver**
2. Vai alla tab **Impostazioni**
3. Clicca su **✏️ Personalizza Attività**
4. Seleziona **🔗 Associazioni**

### 2. Creazione di un'Associazione

Ogni associazione è una coppia di concetti correlati:

```
┌─────────────────────────────────────────┐
│ Associazione 1                          │
├─────────────────────────────────────────┤
│ Concetto (sinistra)    │ Associato (destra) │
│                         │                      │
│ Emoji: 💍               │ Emoji: 🎁            │
│ Testo: Matrimonio       │ Testo: Bomboniera    │
│                         │                      │
│ Anteprima:              │                      │
│ 💍 Matrimonio ↔ 🎁 Bomboniera                  │
└─────────────────────────────────────────┘
```

### 3. Struttura Dati

Ogni associazione ha 4 campi:

```typescript
interface Associazione {
  concetto: string;        // Testo del concetto (es. "Matrimonio")
  emojiConcetto: string;   // Emoji del concetto (es. "💍")
  associato: string;       // Testo dell'associato (es. "Bomboniera")
  emojiAssociato: string;  // Emoji dell'associato (es. "🎁")
}
```

### 4. Salvataggio

- Clicca **💾 Salva Personalizzazioni**
- Le associazioni vengono salvate in localStorage con chiave `associazioni_custom_rounds`
- Il gioco userà automaticamente le tue associazioni invece di quelle predefinite

## 🎨 Esempi di Associazioni Personalizzate

### Basate sui Ricordi del Paziente

```
💍 Matrimonio ↔ 🎁 Bomboniera
👶 Nipoti ↔ 🎂 Compleanno
🏠 Casa ↔ 🔑 Chiave
📸 Foto ↔ 🖼️ Cornice
```

### Basate sul Mestiere

**Se il paziente era un falegname:**
```
🪵 Legno ↔ 🪑 Mobile
🔨 Martello ↔ 🪚 Sega
🏗️ Cantiere ↔ 👷 Operaio
```

**Se il paziente era un insegnante:**
```
📚 Libri ↔ 🎓 Laurea
👨‍🏫 Scuola ↔ 📝 Verifica
🎓 Diploma ↔ 🏆 Successo
```

### Basate sugli Hobby

**Se il paziente tifava Inter:**
```
⚽ Calcio ↔ 🏟️ Stadio
🖤 Nero ↔ 💙 Blu
🏆 Coppa ↔ 🎉 Vittoria
```

**Se il paziente aveva un orto:**
```
🌱 Semina ↔ 🌿 Crescita
🍅 Pomodoro ↔ 🥕 Carota
🌞 Sole ↔ 💧 Acqua
```

### Basate sulla Cultura Italiana

```
🍝 Pasta ↔ 🍅 Pomodoro
☕ Caffè ↔ 🥐 Cornetto
🎭 Teatro ↔ 🎵 Musica
🏛️ Roma ↔ ⛲ Fontana
```

## 🎮 Come il Gioco Usa le Associazioni

### Caricamento

1. Il gioco controlla se esistono associazioni personalizzate in localStorage
2. Se presenti, usa quelle invece delle predefinite
3. Se assenti, usa le 10 associazioni predefinite

### Selezione

- Il gioco seleziona casualmente il numero di coppie configurato (3-10)
- Le coppie vengono mescolate per ogni partita
- Le tessere nelle due colonne vengono mescolate indipendentemente

### Esempio di Partita

Con 5 associazioni personalizzate:

**Colonna Sinistra (Concetti):**
```
💍 Matrimonio
🏠 Casa
📸 Foto
🌱 Orto
⚽ Inter
```

**Colonna Destra (Associati - mescolati):**
```
🔑 Chiave
🎁 Bomboniera
🏟️ Stadio
🖼️ Cornice
🍅 Pomodoro
```

Il paziente deve collegare:
- 💍 Matrimonio ↔ 🎁 Bomboniera
- 🏠 Casa ↔ 🔑 Chiave
- 📸 Foto ↔ 🖼️ Cornice
- 🌱 Orto ↔ 🍅 Pomodoro
- ⚽ Inter ↔ 🏟️ Stadio

## 🎯 Strategie per il Caregiver

### 1. Usa Concetti Familiari

Scegli associazioni che il paziente conosce bene:
- ✅ Eventi di vita (matrimonio, nascita figli)
- ✅ Luoghi significativi (casa, lavoro, vacanze)
- ✅ Hobby e interessi (calcio, orto, cucina)
- ❌ Concetti astratti o sconosciuti

### 2. Mantieni la Coerenza

Le associazioni devono avere un legame logico chiaro:
- ✅ Matrimonio ↔ Bomboniera (causa-effetto)
- ✅ Scuola ↔ Libro (strumento-luogo)
- ❅ Calcio ↔ Pizza (nessun legame ovvio)

### 3. Varia la Difficoltà

**Facile:**
```
🌞 Sole ↔ ☀️ Luce
🌙 Luna ↔ 🌟 Notte
```

**Medio:**
```
💍 Matrimonio ↔ 🎁 Bomboniera
🎂 Compleanno ↔ 🎈 Festa
```

**Difficile:**
```
🏛️ Roma ↔ ⛲ Fontana
📚 Dante ↔ 📖 Divina Commedia
```

### 4. Usa Emoji Riconoscibili

Scegli emoji chiare e familiari:
- ✅ 💍 (anello) per matrimonio
- ✅ 🏠 (casa) per casa
- ❌ 🎊 (confetti) troppo generico

### 5. Crea Categorie Tematiche

Puoi creare sessioni tematiche:

**Sessione "Famiglia":**
```
💍 Matrimonio ↔ 👶 Nipoti
👨‍👩‍👧 Famiglia ↔ 🏠 Casa
🎂 Compleanno ↔ 🎁 Regalo
```

**Sessione "Lavoro":**
```
🏗️ Cantiere ↔ 🔨 Martello
👨‍💼 Ufficio ↔ 💼 Valigetta
🎓 Pensione ↔ 🎉 Festa
```

## 🔧 Configurazione Tecnica

### Storage

- **Chiave localStorage:** `associazioni_custom_rounds`
- **Formato:** Array JSON di oggetti Associazione
- **Limite:** Nessun limite tecnico, ma consigliato 10-20 associazioni

### Reset

Per tornare alle associazioni predefinite:
1. Vai in **Personalizza Attività → Associazioni**
2. Clicca **🔄 Resetta**
3. Conferma la cancellazione

### Backup

Le associazioni sono salvate nel browser. Per fare backup:
1. Apri la console del browser (F12)
2. Esegui: `localStorage.getItem("associazioni_custom_rounds")`
3. Copia il risultato in un file JSON

Per ripristinare:
1. Apri la console del browser
2. Esegui: `localStorage.setItem("associazioni_custom_rounds", '...')`
3. Incolla il JSON salvato

## 📊 Monitoraggio

### Verificare le Associazioni Caricate

Nella schermata di configurazione del gioco, se ci sono associazioni personalizzate, vedrai:

```
┌─────────────────────────────────────┐
│ 🔗 Associazioni Tematiche           │
├─────────────────────────────────────┤
│ 🎨 Verranno usate le tue            │
│    associazioni personalizzate      │
│    (12 disponibili)                 │
├─────────────────────────────────────┤
│ Numero di Coppie: 5                 │
│ [━━━━━━━━━━━━━━━━━━━━━━]            │
│ 3 coppie              10 coppie     │
└─────────────────────────────────────┘
```

### Log nella Console

Quando il gioco carica le associazioni personalizzate, nella console del browser vedrai:

```
[ASSOCIAZIONI] 🎨 Caricate associazioni personalizzate: 12
```

## 🚀 Miglioramenti Futuri

### Possibili Estensioni

1. **Import/Export:**
   - Esportare associazioni in file JSON
   - Importare associazioni da file
   - Condividere associazioni tra caregiver

2. **Categorie:**
   - Raggruppare associazioni per categoria
   - Filtrare per categoria durante il gioco

3. **Suggerimenti AI:**
   - Suggerire associazioni basate sul profilo paziente
   - Generare automaticamente emoji appropriate

4. **Template:**
   - Template predefiniti per mestieri comuni
   - Template per hobby popolari
   - Template per eventi di vita

## 📝 Note per Sviluppatori

### Struttura Dati

```typescript
// src/components/AssociazioniTematiche.tsx
interface CoppiaAssociazione {
  concetto: string;
  emojiConcetto: string;
  associato: string;
  emojiAssociato: string;
}

// localStorage key: "associazioni_custom_rounds"
// Formato: JSON.stringify(CoppiaAssociazione[])
```

### Caricamento Associazioni

```typescript
// In AssociazioniTematiche.tsx
const associazioniCustom = localStorage.getItem("associazioni_custom_rounds");
if (associazioniCustom) {
  const parsed = JSON.parse(associazioniCustom);
  if (Array.isArray(parsed) && parsed.length > 0) {
    associazioniDisponibili = parsed;
  }
}
```

### Salvataggio da PersonalizzaAttività

```typescript
// In PersonalizzaAttività.tsx
const salva = () => {
  const chiave = `${tipo}_custom_rounds`; // "associazioni_custom_rounds"
  localStorage.setItem(chiave, JSON.stringify(rounds));
};
```

## 🎓 Riferimenti Terapeutici

Questo tipo di personalizzazione è basato su:
- **Terapia della Reminiscenza:** Uso di concetti familiari
- **Apprendimento Associativo:** Collegamento tra concetti correlati
- **Personalizzazione:** Adattamento al background del paziente

---

**Versione:** 1.0  
**Ultimo aggiornamento:** 2024  
**Status:** ✅ Completato e testato
