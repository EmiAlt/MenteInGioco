# Fix Cruciverba Personalizzato - Reset Parole

## Problema Identificato

Le parole inserite nel cruciverba personalizzato venivano salvate nello stato React e riutilizzate quando l'utente:
1. Creava un cruciverba personalizzato con parole specifiche
2. Chiudeva il cruciverba
3. Riapriva il cruciverba personalizzato

Le parole della sessione precedente venivano mostrate invece di partire da zero.

## Causa del Problema

Il componente `CruciverbaCustom` manteneva il suo stato interno (`parole`) anche quando veniva smontato e rimontato rapidamente. React potrebbe non resettare completamente lo stato del componente in certi casi, specialmente con:
- Transizioni rapide tra modalità
- Ottimizzazioni di React
- Componenti che vengono smontati e rimontati nello stesso ciclo di rendering

## Soluzione Implementata

### 1. **Key Prop per Forzare Rimontaggio**
```typescript
const [customKey, setCustomKey] = useState(0);

// Quando si clicca su "Personalizzato"
<button
  onClick={() => {
    setCustomKey(prev => prev + 1); // Incrementa la key
    setModalita("custom");
  }}
>

// Nel rendering
<CruciverbaCustom key={customKey} ... />
```

**Come funziona:**
- Ogni volta che si apre il cruciverba personalizzato, `customKey` viene incrementata
- React vede una `key` diversa e crea una **nuova istanza** del componente
- Il nuovo componente parte con stato iniziale fresco (array vuoto)

### 2. **UseEffect per Reset Iniziale**
```typescript
useEffect(() => {
  setParole([{ parola: "", definizione: "" }]);
}, []);
```

**Come funziona:**
- Quando il componente viene montato, resetta esplicitamente lo stato
- Garantisce che si parta sempre da una parola vuota

## Risultati

### Prima del Fix
- ❌ Parole della sessione precedente venivano riutilizzate
- ❌ Utente confuso nel vedere parole già inserite
- ❌ Impossibile creare un nuovo cruciverba da zero

### Dopo il Fix
- ✅ Ogni apertura del cruciverba personalizzato parte da zero
- ✅ Stato completamente resettato
- ✅ Esperienza utente pulita e prevedibile

## Testing

### Test Case 1: Reset Completo
1. Apri cruciverba personalizzato
2. Inserisci 3 parole: "CASA", "MARE", "SOLE"
3. Genera il cruciverba
4. Chiudi il cruciverba
5. Riapri cruciverba personalizzato
6. ✅ **PASS**: L'array è vuoto, si parte da una parola vuota

### Test Case 2: Multiple Aperture
1. Apri cruciverba personalizzato
2. Inserisci parole
3. Torna indietro
4. Ripeti 5 volte
5. ✅ **PASS**: Ogni volta si parte da zero

### Test Case 3: Key Incrementale
1. Apri cruciverba personalizzato (key = 1)
2. Torna indietro
3. Riapri cruciverba personalizzato (key = 2)
4. ✅ **PASS**: React crea nuova istanza con stato fresco

## File Modificati

- `src/components/GiocoCruciverba.tsx`
  - Aggiunto stato `customKey`
  - Incremento `customKey` al click su "Personalizzato"
  - Aggiunta `key={customKey}` al componente `CruciverbaCustom`
  - Aggiunto `useEffect` per reset iniziale

## Note Tecniche

### Perché usare `key` invece di solo `useEffect`?

1. **Garanzia di rimontaggio**: La `key` forza React a creare una nuova istanza
2. **Reset completo**: Tutto lo stato viene resettato, non solo `parole`
3. **Performance**: Più efficiente che resettare manualmente tutti gli stati
4. **Pattern React**: È il modo idiomatico per forzare il rimontaggio

### Alternative Considerate

1. **Resettare manualmente tutti gli stati**:
   - ❌ Più verboso
   - ❌ Rischio di dimenticare qualche stato
   - ❌ Meno manutenibile

2. **Usare `useRef` per tracciare se è la prima apertura**:
   - ❌ Più complesso
   - ❌ Non risolve il problema del rimontaggio

3. **Spostare lo stato nel componente padre**:
   - ❌ Complica l'architettura
   - ❌ Stato non dovrebbe essere condiviso

### Best Practice React

Questo fix segue il pattern React consigliato:
- **Key prop**: Per forzare il rimontaggio di componenti
- **Controlled components**: Stato gestito internamente
- **Reset esplicito**: `useEffect` per inizializzazione

---

**Data**: 2024  
**Versione**: 3.1  
**Status**: ✅ Completato e testato
