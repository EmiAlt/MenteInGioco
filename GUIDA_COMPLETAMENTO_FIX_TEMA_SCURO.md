# Fix Contrasto Testi Tema Scuro - Guida Completamento

## Stato Attuale

✅ **Completato:**
- Quiz (App.tsx) - testo domanda principale
- Cruciverba (GiocoCruciverba.tsx) - titoli e definizioni
- Hook useTheme.ts creato
- App.tsx aggiornato per passare il theme

⏳ **Da completare:**
- IntrusoLogico.tsx
- MemorySemplificato.tsx
- OmbreSagome.tsx
- CompletaCanzone.tsx
- ProverbiPopolari.tsx
- ValigiaSpesa.tsx
- OrologioDigitale.tsx
- AssociazioniTematiche.tsx
- MemoryVita.tsx
- GiocoPuzzle.tsx
- Forza4.tsx
- Tris.tsx

## Pattern da Applicare

### 1. Import e Props

```typescript
import { ThemeType } from '../hooks/useTheme';

interface ComponentProps {
  onChiudi: () => void;
  theme?: ThemeType;
}

export default function Component({ onChiudi, theme = 'light' }: ComponentProps) {
  // ...
}
```

### 2. Classi Condizionali

Sostituisci:
```typescript
// ❌ Prima
<h2 className="text-2xl font-bold text-slate-900">Titolo</h2>

// ✅ Dopo
<h2 className={`text-2xl font-bold transition-colors duration-300 ${
  theme === 'dark' ? 'text-white' : 'text-slate-900'
}`}>Titolo</h2>
```

### 3. Mappatura Colori

| Classe Originale | Tema Chiaro | Tema Scuro |
|-----------------|-------------|------------|
| `text-slate-900` | `text-slate-900` | `text-white` |
| `text-slate-800` | `text-slate-800` | `text-slate-100` |
| `text-slate-700` | `text-slate-700` | `text-slate-200` |
| `text-slate-600` | `text-slate-600` | `text-slate-300` |
| `text-slate-500` | `text-slate-500` | `text-slate-400` |

### 4. Aggiorna App.tsx

```typescript
// ❌ Prima
<Component onChiudi={() => setGiocoAttivo(null)} />

// ✅ Dopo
<Component onChiudi={() => setGiocoAttivo(null)} theme={theme} />
```

## Esempi Specifici per Componente

### IntrusoLogico.tsx
```typescript
// Titolo
<h2 className={`text-2xl font-bold transition-colors duration-300 ${
  theme === 'dark' ? 'text-white' : 'text-slate-900'
}`}>🔍 L'Intruso Logico</h2>

// Istruzioni
<p className={`text-lg transition-colors duration-300 ${
  theme === 'dark' ? 'text-slate-300' : 'text-slate-500'
}`}>Quale di questi non c'entra con gli altri?</p>
```

### MemorySemplificato.tsx
```typescript
// Titolo
<h2 className={`text-2xl font-bold transition-colors duration-300 ${
  theme === 'dark' ? 'text-white' : 'text-slate-900'
}`}>🧠 Trova la Coppia</h2>

// Counter
<p className={`text-sm transition-colors duration-300 ${
  theme === 'dark' ? 'text-slate-300' : 'text-slate-500'
}`}>Mosse: {mosse}</p>
```

### CompletaCanzone.tsx
```typescript
// Titolo canzone
<p className={`text-xl font-bold mb-1 transition-colors duration-300 ${
  theme === 'dark' ? 'text-white' : 'text-slate-900'
}`}>{round.titolo}</p>

// Artista
<p className={`text-lg transition-colors duration-300 ${
  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
}`}>{round.artista} ({round.anno})</p>
```

### ProverbiPopolari.tsx
```typescript
// Inizio proverbio
<p className={`text-3xl font-bold italic transition-colors duration-300 ${
  theme === 'dark' ? 'text-white' : 'text-slate-900'
}`}>"{round.inizio}..."</p>
```

### OrologioDigitale.tsx
```typescript
// Titolo
<h2 className={`text-2xl font-bold transition-colors duration-300 ${
  theme === 'dark' ? 'text-white' : 'text-slate-900'
}`}>⏰ L'Orologio</h2>

// Numeri orologio
<div className={`absolute text-2xl font-bold transition-colors duration-300 ${
  theme === 'dark' ? 'text-white' : 'text-slate-900'
}`}>{num}</div>
```

## Checklist Completamento

Per ogni componente:
- [ ] Importato `ThemeType`
- [ ] Aggiunto `theme` alle props
- [ ] Accettato `theme = 'light'` nel componente
- [ ] Modificati tutti i testi `text-slate-*` con classi condizionali
- [ ] Aggiunto `transition-colors duration-300`
- [ ] Aggiornato App.tsx per passare `theme={theme}`
- [ ] Testato con tema chiaro
- [ ] Testato con tema scuro
- [ ] Build completato senza errori

## Testing

### Test Manuale
1. Avvia l'app
2. Seleziona tema scuro dal footer
3. Naviga in ogni gioco
4. Verifica che tutti i testi siano leggibili
5. Torna al tema chiaro
6. Verifica che i testi tornino scuri

### Test Automatico
```bash
npm run build
```
Deve completare senza errori.

## Note Importanti

1. **NON modificare**:
   - Testi già bianchi (`text-white`)
   - Testi colorati (`text-blue-600`, `text-emerald-600`, etc.)
   - Sfondi (`bg-*`)
   - Bordi (`border-*`)

2. **MODIFICA SOLO**:
   - Testi grigi/scuri (`text-slate-*`)
   - Titoli e sottotitoli
   - Istruzioni e descrizioni
   - Label e counter

3. **Aggiungi sempre**:
   - `transition-colors duration-300` per transizioni fluide

## Priorità

### Alta (da fare subito):
1. IntrusoLogico.tsx - testi domande
2. CompletaCanzone.tsx - titoli canzoni
3. ProverbiPopolari.tsx - testi proverbi
4. OrologioDigitale.tsx - numeri orologio

### Media:
5. MemorySemplificato.tsx - titoli
6. OmbreSagome.tsx - titoli
7. ValigiaSpesa.tsx - contesti
8. AssociazioniTematiche.tsx - concetti

### Bassa (gioco meno testuale):
9. MemoryVita.tsx - descrizioni
10. GiocoPuzzle.tsx - titoli
11. Forza4.tsx - titoli
12. Tris.tsx - titoli

## Stima Tempo

- 2-3 minuti per componente
- Totale: ~30-40 minuti per tutti i 12 componenti
- Testing: ~10 minuti

## Contatti

Se hai domande o problemi, consulta:
- `src/hooks/useTheme.ts` - implementazione hook
- `src/components/GiocoCruciverba.tsx` - esempio completo
- `FIX_CONTRASTO_TEMA_SCURO.md` - documentazione originale

---

**Creato**: 2024
**Ultimo aggiornamento**: 2024
**Status**: ⏳ In completamento
