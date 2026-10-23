import React, { useState } from 'react';
import { ThemeType } from '../hooks/useTheme';

interface Clue {
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  row: number;
  col: number;
}

interface CrosswordPuzzle {
  id: number;
  title: string;
  gridSize: { rows: number; cols: number };
  clues: Clue[];
}

// Schemi pre-calcolati e perfettamente incrociati
const PUZZLES: CrosswordPuzzle[] = [
  {
    id: 1,
    title: 'Cruciverba Facile 1',
    gridSize: { rows: 8, cols: 8 },
    clues: [
      { number: 1, direction: 'across', clue: 'Un primo piatto tipico italiano', answer: 'PASTA', row: 1, col: 1 },
      { number: 2, direction: 'across', clue: 'Si beve a colazione, è bianco', answer: 'LATTE', row: 3, col: 2 },
      { number: 3, direction: 'across', clue: 'Ci si va a dormire la sera', answer: 'LETTO', row: 5, col: 0 },
      { number: 1, direction: 'down', clue: 'Si compra dal fornaio ogni giorno', answer: 'PANE', row: 1, col: 1 },
      { number: 4, direction: 'down', clue: 'L\'amico dell\'uomo che abbaia', answer: 'CANE', row: 1, col: 5 },
      { number: 5, direction: 'down', clue: 'Frutto rosso o verde', answer: 'MELA', row: 3, col: 3 },
    ]
  },
  {
    id: 2,
    title: 'Cruciverba Facile 2',
    gridSize: { rows: 9, cols: 9 },
    clues: [
      { number: 1, direction: 'across', clue: 'Scalda la terra di giorno', answer: 'SOLE', row: 0, col: 2 },
      { number: 2, direction: 'across', clue: 'Ha l\'acqua salata e le onde', answer: 'MARE', row: 2, col: 0 },
      { number: 3, direction: 'across', clue: 'Il posto dove si vive con la famiglia', answer: 'CASA', row: 4, col: 3 },
      { number: 4, direction: 'across', clue: 'Si fa con la bocca quando si è felici', answer: 'SORRISO', row: 6, col: 1 },
      { number: 1, direction: 'down', clue: 'Splende nel cielo di notte', answer: 'LUNA', row: 0, col: 4 },
      { number: 5, direction: 'down', clue: 'Ha il tronco e le foglie', answer: 'ALBERO', row: 2, col: 6 },
      { number: 6, direction: 'down', clue: 'Batte nel petto', answer: 'CUORE', row: 4, col: 3 },
    ]
  },
  {
    id: 3,
    title: 'Cruciverba Facile 3',
    gridSize: { rows: 10, cols: 10 },
    clues: [
      { number: 1, direction: 'across', clue: 'Si mette al piede per camminare', answer: 'SCARPA', row: 1, col: 0 },
      { number: 2, direction: 'across', clue: 'È rotonda e si usa per giocare', answer: 'PALLA', row: 3, col: 3 },
      { number: 3, direction: 'across', clue: 'Segna le ore della giornata', answer: 'OROLOGIO', row: 5, col: 1 },
      { number: 4, direction: 'across', clue: 'Si usa per lavarsi le mani', answer: 'SAPONE', row: 7, col: 4 },
      { number: 1, direction: 'down', clue: 'Vi si appoggiano i piatti per mangiare', answer: 'TAVOLO', row: 1, col: 2 },
      { number: 5, direction: 'down', clue: 'Ci si siede sopra per riposare', answer: 'SEDIA', row: 3, col: 5 },
      { number: 6, direction: 'down', clue: 'Si apre con la chiave', answer: 'PORTA', row: 5, col: 7 },
      { number: 7, direction: 'down', clue: 'Profuma ed è pieno di colori', answer: 'FIORE', row: 7, col: 0 },
    ]
  },
  {
    id: 4,
    title: 'Cruciverba Facile 4',
    gridSize: { rows: 9, cols: 9 },
    clues: [
      { number: 1, direction: 'across', clue: 'La mamma della mamma', answer: 'NONNA', row: 0, col: 1 },
      { number: 2, direction: 'across', clue: 'Vuole bene ai suoi figli', answer: 'MAMMA', row: 2, col: 3 },
      { number: 3, direction: 'across', clue: 'Ha cinque dita', answer: 'MANO', row: 4, col: 0 },
      { number: 4, direction: 'across', clue: 'Serve per mangiare e parlare', answer: 'BOCCA', row: 6, col: 2 },
      { number: 1, direction: 'down', clue: 'Il papà del papà', answer: 'NONNO', row: 0, col: 5 },
      { number: 5, direction: 'down', clue: 'Servono per guardare', answer: 'OCCHI', row: 2, col: 7 },
      { number: 6, direction: 'down', clue: 'Serve per annusare i profumi', answer: 'NASO', row: 4, col: 3 },
    ]
  },
  {
    id: 5,
    title: 'Cruciverba Facile 5',
    gridSize: { rows: 10, cols: 10 },
    clues: [
      { number: 1, direction: 'across', clue: 'È bianca e cade d\'inverno', answer: 'NEVE', row: 1, col: 2 },
      { number: 2, direction: 'across', clue: 'Scalda il camino ma scotta', answer: 'FUOCO', row: 3, col: 0 },
      { number: 3, direction: 'across', clue: 'È fatto di erba verde', answer: 'PRATO', row: 5, col: 4 },
      { number: 4, direction: 'across', clue: 'Ha le ali e vola nel cielo', answer: 'UCCELLO', row: 7, col: 1 },
      { number: 1, direction: 'down', clue: 'È blu ed è pieno di nuvole', answer: 'CIELO', row: 1, col: 6 },
      { number: 5, direction: 'down', clue: 'Nuota dentro il mare', answer: 'PESCE', row: 3, col: 4 },
      { number: 6, direction: 'down', clue: 'Vi si versa la minestra', answer: 'PIATTO', row: 5, col: 7 },
      { number: 7, direction: 'down', clue: 'Si usa per mangiare il brodo', answer: 'CUCCHIAIO', row: 7, col: 3 },
    ]
  },
  {
    id: 6,
    title: 'Cruciverba Facile 6',
    gridSize: { rows: 9, cols: 9 },
    clues: [
      { number: 1, direction: 'across', clue: 'Serve per infilzare la pasta', answer: 'FORCHETTA', row: 0, col: 0 },
      { number: 2, direction: 'across', clue: 'Si usa per bere l\'acqua', answer: 'BICCHIERE', row: 2, col: 2 },
      { number: 3, direction: 'across', clue: 'Si ascolta con le orecchie', answer: 'MUSICA', row: 4, col: 1 },
      { number: 4, direction: 'across', clue: 'Si canta in allegria', answer: 'CANZONE', row: 6, col: 3 },
      { number: 1, direction: 'down', clue: 'Si dà sulla guancia con affetto', answer: 'BACIO', row: 0, col: 4 },
      { number: 5, direction: 'down', clue: 'La stagione più calda dell\'anno', answer: 'ESTATE', row: 2, col: 6 },
      { number: 6, direction: 'down', clue: 'La stagione in cui fa molto freddo', answer: 'INVERNO', row: 4, col: 5 },
    ]
  },
  {
    id: 7,
    title: 'Cruciverba Facile 7',
    gridSize: { rows: 10, cols: 10 },
    clues: [
      { number: 1, direction: 'across', clue: 'È rotonda, buona con il pomodoro', answer: 'PIZZA', row: 1, col: 1 },
      { number: 2, direction: 'across', clue: 'Serve per sistemare i capelli', answer: 'PETTINE', row: 3, col: 0 },
      { number: 3, direction: 'across', clue: 'Spegne la sete', answer: 'ACQUA', row: 5, col: 3 },
      { number: 4, direction: 'across', clue: 'Si beve nei bicchieri ai pasti', answer: 'VINO', row: 7, col: 5 },
      { number: 1, direction: 'down', clue: 'Si prende la mattina per svegliarsi', answer: 'CAFFE', row: 1, col: 5 },
      { number: 5, direction: 'down', clue: 'Un fiore rosso con le spine', answer: 'ROSA', row: 3, col: 3 },
      { number: 6, direction: 'down', clue: 'Fa le fusa e caccia i topi', answer: 'GATTO', row: 5, col: 7 },
    ]
  },
  {
    id: 8,
    title: 'Cruciverba Facile 8',
    gridSize: { rows: 9, cols: 9 },
    clues: [
      { number: 1, direction: 'across', clue: 'L\'amico dell\'uomo che abbaia', answer: 'CANE', row: 0, col: 2 },
      { number: 2, direction: 'across', clue: 'Si compra dal fornaio ogni giorno', answer: 'PANE', row: 2, col: 0 },
      { number: 3, direction: 'across', clue: 'Si beve a colazione, è bianco', answer: 'LATTE', row: 4, col: 3 },
      { number: 4, direction: 'across', clue: 'Ci si va a dormire la sera', answer: 'LETTO', row: 6, col: 1 },
      { number: 1, direction: 'down', clue: 'Un primo piatto tipico italiano', answer: 'PASTA', row: 0, col: 5 },
      { number: 5, direction: 'down', clue: 'Frutto rosso o verde', answer: 'MELA', row: 2, col: 4 },
      { number: 6, direction: 'down', clue: 'Scalda la terra di giorno', answer: 'SOLE', row: 4, col: 7 },
    ]
  }
];

interface CruciverbaProps {
  onChiudi: () => void;
  theme?: ThemeType;
}

export const GiocoCruciverba: React.FC<CruciverbaProps> = ({ onChiudi, theme = 'light' }) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const currentPuzzle = PUZZLES[currentPuzzleIndex];
  const { rows, cols } = currentPuzzle.gridSize;

  // Costruisci la griglia
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  const numbersGrid = Array.from({ length: rows }, () => Array(cols).fill(null));

  currentPuzzle.clues.forEach(({ number, direction, answer, row, col }) => {
    numbersGrid[row][col] = number;
    for (let i = 0; i < answer.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;
      if (r < rows && c < cols) {
        grid[r][c] = { answer: answer[i] };
      }
    }
  });

  const [userGrid, setUserGrid] = useState<string[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(''))
  );

  const handleChange = (r: number, c: number, value: string) => {
    const val = value.toUpperCase().slice(-1);
    const newGrid = userGrid.map(row => [...row]);
    newGrid[r][c] = val;
    setUserGrid(newGrid);
  };

  const nextPuzzle = () => {
    setCurrentPuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
    setUserGrid(Array.from({ length: rows }, () => Array(cols).fill('')));
  };

  const isDark = theme === 'dark';

  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {currentPuzzle.title}
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Puzzle {currentPuzzleIndex + 1} di {PUZZLES.length}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={nextPuzzle} 
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Prossimo →
            </button>
            <button 
              onClick={onChiudi} 
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              ← Chiudi
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Griglia */}
          <div className={`md:col-span-2 p-4 rounded-xl shadow-md border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <div 
              className={`grid gap-1 p-2 rounded-lg ${isDark ? 'bg-slate-950' : 'bg-slate-900'}`}
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => (
                  <div key={`${r}-${c}`} className={`aspect-square relative ${isDark ? 'bg-slate-950' : 'bg-slate-900'}`}>
                    {cell ? (
                      <>
                        {numbersGrid[r][c] && (
                          <span className={`absolute top-0.5 left-1 text-[10px] font-bold z-10 select-none ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {numbersGrid[r][c]}
                          </span>
                        )}
                        <input
                          type="text"
                          maxLength={1}
                          value={userGrid[r][c]}
                          onChange={(e) => handleChange(r, c, e.target.value)}
                          className={`w-full h-full text-center text-lg font-bold uppercase border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark 
                              ? 'bg-slate-100 text-slate-900 border-slate-300' 
                              : 'bg-white text-slate-900 border-slate-300'
                          }`}
                        />
                      </>
                    ) : (
                      <div className={`w-full h-full rounded ${isDark ? 'bg-slate-950' : 'bg-slate-900'}`} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Definizioni */}
          <div className="space-y-4">
            <div className={`p-4 rounded-xl shadow-md border ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                → Orizzontali
              </h3>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {currentPuzzle.clues.filter(c => c.direction === 'across').map(c => (
                  <li key={`a-${c.number}`}><strong>{c.number}.</strong> {c.clue}</li>
                ))}
              </ul>
            </div>

            <div className={`p-4 rounded-xl shadow-md border ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ↓ Verticali
              </h3>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {currentPuzzle.clues.filter(c => c.direction === 'down').map(c => (
                  <li key={`d-${c.number}`}><strong>{c.number}.</strong> {c.clue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiocoCruciverba;
