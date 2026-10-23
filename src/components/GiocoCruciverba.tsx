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

// Schema pre-calcolato semplice e funzionante
const PUZZLE: CrosswordPuzzle = {
  id: 1,
  title: 'Cruciverba Facile',
  gridSize: { rows: 7, cols: 7 },
  clues: [
    { number: 1, direction: 'across', clue: 'Un primo piatto tipico italiano', answer: 'PASTA', row: 0, col: 1 },
    { number: 2, direction: 'across', clue: 'Si beve a colazione, è bianco', answer: 'LATTE', row: 2, col: 1 },
    { number: 3, direction: 'across', clue: 'Ci si va a dormire la sera', answer: 'LETTO', row: 4, col: 0 },
    { number: 1, direction: 'down', clue: 'Si compra dal fornaio ogni giorno', answer: 'PANE', row: 0, col: 1 },
    { number: 4, direction: 'down', clue: 'L\'amico dell\'uomo che abbaia', answer: 'CANE', row: 0, col: 5 },
    { number: 5, direction: 'down', clue: 'Frutto rosso o verde', answer: 'MELA', row: 2, col: 3 },
  ]
};

interface CruciverbaProps {
  onChiudi: () => void;
  theme?: ThemeType;
}

export const GiocoCruciverba: React.FC<CruciverbaProps> = ({ onChiudi, theme = 'light' }) => {
  const { rows, cols } = PUZZLE.gridSize;

  // Costruisci la griglia vuota
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  const numbersGrid = Array.from({ length: rows }, () => Array(cols).fill(null));

  // Posiziona le parole nella griglia
  PUZZLE.clues.forEach(({ number, direction, answer, row, col }) => {
    numbersGrid[row][col] = number;
    for (let i = 0; i < answer.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;
      if (r < rows && c < cols) {
        grid[r][c] = { answer: answer[i] };
      }
    }
  });

  // Stato per le risposte dell'utente
  const [userGrid, setUserGrid] = useState<string[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(''))
  );

  // Gestisce il cambio di una cella
  const handleChange = (r: number, c: number, value: string) => {
    const val = value.toUpperCase().slice(-1);
    const newGrid = userGrid.map(row => [...row]);
    newGrid[r][c] = val;
    setUserGrid(newGrid);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {PUZZLE.title}
          </h2>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Griglia del cruciverba */}
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
            {/* Orizzontali */}
            <div className={`p-4 rounded-xl shadow-md border ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                → Orizzontali
              </h3>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {PUZZLE.clues.filter(c => c.direction === 'across').map(c => (
                  <li key={`a-${c.number}`}><strong>{c.number}.</strong> {c.clue}</li>
                ))}
              </ul>
            </div>

            {/* Verticali */}
            <div className={`p-4 rounded-xl shadow-md border ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ↓ Verticali
              </h3>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {PUZZLE.clues.filter(c => c.direction === 'down').map(c => (
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
