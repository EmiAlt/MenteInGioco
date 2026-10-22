# 📸 Terapia della Reminiscenza - MenteInGioco

## Panoramica

La **Terapia della Reminiscenza** è una nuova modalità di gioco dedicata alla stimolazione cognitiva attraverso i ricordi personali e le associazioni semantiche. Questa feature è progettata specificamente per anziani e persone con decadimento cognitivo lieve.

## 🎯 Obiettivi Terapeutici

- **Stimolazione della memoria a lungo termine** attraverso foto personali
- **Associazione concettuale** per mantenere attive le funzioni cognitive
- **Benessere emotivo** attraverso il richiamo di ricordi positivi
- **Personalizzazione** basata sulla vita del paziente

## 📋 Componenti

### 1. Pannello Gestione Ricordi (`PannelloRicordi.tsx`)

**Funzionalità:**
- Upload di foto personali (convertite in base64 per persistenza)
- Inserimento descrizioni personalizzate
- Categorizzazione opzionale (Famiglia, Viaggi, Lavoro, ecc.)
- Modifica ed eliminazione dei ricordi
- Visualizzazione griglia con anteprime

**Accesso:**
- Dal menu principale: "📚 Gestisci i tuoi ricordi"
- Oppure dal Pannello Caregiver

**Caratteristiche UX:**
- Form semplificato con campi grandi e leggibili
- Anteprima immediata della foto caricata
- Feedback visivo per ogni azione
- Conferma prima dell'eliminazione

### 2. Memory di Vita (`MemoryVita.tsx`)

**Funzionalità:**
- Gioco memory classico basato sui ricordi personali
- Due modalità di abbinamento:
  - **Foto + Descrizione**: abbina ogni foto alla sua descrizione
  - **Foto + Foto**: abbina foto correlate (stesso ricordo)
- Configurazione del numero di coppie (2-6)
- Feedback visivo per associazioni corrette/errate

**Accesso:**
- Dal menu principale: "📸 Memory Vita"

**Caratteristiche UX:**
- Carte grandi con bordi ben visibili
- Animazioni fluide per il flip delle carte
- Feedback immediato (verde = corretto, rosso = errato)
- Contatore mosse per tracciare i progressi
- Schermata finale celebrativa

### 3. Associazioni Tematiche (`AssociazioniTematiche.tsx`)

**Funzionalità:**
- Gioco di associazione concettuale (semantic matching)
- Due colonne di tessere: Concetti (sinistra) e Associati (destra)
- 10 coppie predefinite (Matrimonio-Bomboniera, Cucina-Pentola, ecc.)
- Configurazione del numero di coppie (3-8)
- Feedback visivo dolce e gratificante

**Accesso:**
- Dal menu principale: "🔗 Associazioni"

**Caratteristiche UX:**
- Tessere molto grandi con emoji e testo
- Alto contrasto per massima leggibilità
- Nessun limite di tempo
- Feedback positivo ("Perfetto!") senza penalità
- Layout a due colonne chiaro e intuitivo

**Coppie Predefinite:**
1. 💍 Matrimonio ↔ 🎁 Bomboniera
2. 👨‍🍳 Cucina ↔ 🍲 Pentola
3. 👷 Cantiere ↔ 🔨 Martello
4. 👨‍🏫 Scuola ↔ 📖 Libro
5. 👨‍⚕️ Ospedale ↔ 💊 Medicina
6. 🎄 Natale ↔ 🎁 Regalo
7. 🎂 Compleanno ↔ 🕯️ Candeline
8. 🏖️ Mare ↔ ⛱️ Ombrellone
9. ⛰️ Montagna ↔ 🎿 Sci
10. 🌳 Giardino ↔ 🌸 Fiore

## 💾 Persistenza Dati

### Hook `useRicordi.ts`

**Storage:** `localStorage` con chiave `stimolazione_cognitiva_ricordi`

**Struttura dati:**
```typescript
interface Ricordo {
  id: string;              // ID univoco
  foto: string;            // Base64 dell'immagine
  descrizione: string;     // Testo descrittivo
  categoria?: string;      // Categoria opzionale
  dataCreazione: string;   // Timestamp ISO
}
```

**Funzioni esportate:**
- `ricordi`: array di tutti i ricordi salvati
- `salvaRicordo(foto, descrizione, categoria?)`: aggiunge un nuovo ricordo
- `eliminaRicordo(id)`: rimuove un ricordo
- `modificaRicordo(id, descrizione, categoria?)`: aggiorna un ricordo

## 🎨 Design e Accessibilità

### Principi Seguiti

1. **Font molto grandi** (text-2xl, text-3xl) per massima leggibilità
2. **Alto contrasto** (sfondo chiaro, testo scuro, bordi marcati)
3. **Feedback visivi dolci** (verde per successo, ambra per errori)
4. **Nessun limite di tempo** per ridurre l'ansia da prestazione
5. **Nessuna penalità** per errori (approccio positivo)
6. **Emoji grandi** per supporto visivo
7. **Spaziatura generosa** per evitare confusione

### Palette Colori

- **Successo**: `emerald-100` / `emerald-500` (verde rassicurante)
- **Errore**: `amber-100` / `amber-500` (ambra, non rosso aggressivo)
- **Selezione**: `blue-100` / `blue-500` (blu calmante)
- **Sfondo**: `slate-50` (grigio chiaro, non bianco accecante)

## 🔧 Integrazione Tecnica

### File Creati

1. `src/hooks/useRicordi.ts` - Hook per gestione ricordi
2. `src/components/PannelloRicordi.tsx` - Pannello caregiver
3. `src/components/MemoryVita.tsx` - Gioco memory personalizzato
4. `src/components/AssociazioniTematiche.tsx` - Gioco associazioni

### Modifiche ad App.tsx

- Aggiunti import per i nuovi componenti
- Aggiunti tipi `memory-vita` e `associazioni` a `GiocoAttivo`
- Aggiunto tipo `ricordi` a `VistaApp`
- Aggiunta nuova sezione "💭 Terapia della Reminiscenza" nel menu
- Aggiunti render conditionali per i nuovi giochi

## 📊 Statistiche e Monitoraggio

Le sessioni di gioco vengono automaticamente salvate nel sistema di cronologia esistente:
- Numero di mosse effettuate
- Tempo di completamento
- Coppie trovate correttamente
- Data e ora della sessione

Queste statistiche sono visibili nel **Pannello Caregiver → Statistiche**.

## 🚀 Future Enhancements

Possibili estensioni future:

1. **Audio**: Aggiungere narrazione vocale delle descrizioni
2. **Video**: Supporto per brevi video invece di sole foto
3. **Geolocalizzazione**: Associare ricordi a luoghi specifici
4. **Timeline**: Visualizzazione cronologica dei ricordi
5. **Condivisione**: Esportare ricordi come album stampabile
6. **AI**: Generazione automatica di associazioni personalizzate basate sui ricordi
7. **Multi-paziente**: Supporto per più profili paziente con ricordi separati

## 📝 Note per Sviluppatori

### Aggiungere Nuove Associazioni

Per aggiungere nuove coppie al gioco Associazioni Tematiche, modifica l'array `ASSOCIAZIONI_DEFAULT` in `AssociazioniTematiche.tsx`:

```typescript
const ASSOCIAZIONI_DEFAULT: CoppiaAssociazione[] = [
  // ... coppie esistenti
  { concetto: "NuovoConcetto", emojiConcetto: "🆕", associato: "NuovoAssociato", emojiAssociato: "✨" },
];
```

### Personalizzare i Suggerimenti

Il sistema suggerisce automaticamente griglie appropriate in base al formato dell'immagine. Per modificare i suggerimenti, vedi la funzione `suggerisciGriglie()` in `GiocoPuzzle.tsx`.

### Estendere le Categorie di Ricordi

Per aggiungere categorie predefinite, modifica il componente `PannelloRicordi.tsx` e aggiungi un sistema di suggerimenti automatici basato su parole chiave nelle descrizioni.

## 🎓 Riferimenti Terapeutici

La **Terapia della Reminiscenza** è una tecnica validata scientificamente per:
- Migliorare l'umore e il benessere emotivo
- Stimolare la memoria a lungo termine
- Favorire la comunicazione e la socializzazione
- Mantenere il senso di identità e autostima

**Riferimenti:**
- Butler, R. N. (1963). "The life review: An interpretation of reminiscence in the aged."
- Woods, B., et al. (2005). "Reminiscence therapy for dementia." Cochrane Database of Systematic Reviews.

---

**Sviluppato con ❤️ per MenteInGioco**
