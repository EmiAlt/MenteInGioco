import React, { useState, useEffect, useRef } from 'react';
import { ThemeType } from '../hooks/useTheme';

interface WordPosition {
  word: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
}

interface SelectedCell {
  row: number;
  col: number;
}

interface FoundWord {
  word: string;
  cells: SelectedCell[];
  color: string;
}

interface WordSearchProps {
  onChiudi: () => void;
  theme?: ThemeType;
}

// Palette di colori pastello per le parole trovate
const COLORS = [
  'rgba(135, 206, 235, 0.85)', // Azzurro chiaro
  'rgba(64, 224, 208, 0.85)',  // Verde acqua/turchese
  'rgba(255, 165, 0, 0.85)',   // Arancione
  'rgba(255, 215, 0, 0.85)',   // Giallo
  'rgba(255, 105, 180, 0.85)', // Rosa
  'rgba(144, 238, 144, 0.85)', // Verde acido
  'rgba(255, 218, 185, 0.85)', // Albicocca
  'rgba(221, 160, 221, 0.85)', // Viola chiaro
];

// Parole da cercare (tematiche familiari per anziani)
const WORDS = [
  'CASA', 'MARE', 'SOLE', 'LUNA', 'PANE', 'VINO',
  'AMORE', 'FIORE', 'CANE', 'GATTO', 'ALBERO', 'MUSICA'
];

const GRID_SIZE = 12;

export const WordSearch: React.FC<WordSearchProps> = ({ onChiudi, theme = 'light' }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState<SelectedCell | null>(null);
  const [currentCell, setCurrentCell] = useState<SelectedCell | null>(null);
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Inizializza la griglia con le parole nascoste
  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    // Crea griglia vuota
    const newGrid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    const positions: WordPosition[] = [];
    const directions: Array<'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up'> = [
      'horizontal', 'vertical', 'diagonal-down', 'diagonal-up'
    ];

    // Posiziona ogni parola
    WORDS.forEach(word => {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * GRID_SIZE);
        const startCol = Math.floor(Math.random() * GRID_SIZE);

        if (canPlaceWord(newGrid, word, startRow, startCol, direction)) {
          placeWord(newGrid, word, startRow, startCol, direction);
          positions.push({ word, startRow, startCol, direction });
          placed = true;
        }
        attempts++;
      }
    });

    // Riempi le celle vuote con lettere casuali
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    setGrid(newGrid);
    setWordPositions(positions);
  };

  const canPlaceWord = (
    grid: string[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: string
  ): boolean => {
    const deltas: { [key: string]: [number, number] } = {
      'horizontal': [0, 1],
      'vertical': [1, 0],
      'diagonal-down': [1, 1],
      'diagonal-up': [-1, 1]
    };

    const [dRow, dCol] = deltas[direction];

    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dRow;
      const col = startCol + i * dCol;

      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
        return false;
      }

      if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
        return false;
      }
    }

    return true;
  };

  const placeWord = (
    grid: string[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: string
  ) => {
    const deltas: { [key: string]: [number, number] } = {
      'horizontal': [0, 1],
      'vertical': [1, 0],
      'diagonal-down': [1, 1],
      'diagonal-up': [-1, 1]
    };

    const [dRow, dCol] = deltas[direction];

    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dRow;
      const col = startCol + i * dCol;
      grid[row][col] = word[i];
    }
  };

  // Gestisce l'inizio della selezione
  const handleMouseDown = (row: number, col: number) => {
    setSelecting(true);
    setStartCell({ row, col });
    setCurrentCell({ row, col });
    setSelectedCells([{ row, col }]);
  };

  // Gestisce il movimento del mouse durante la selezione
  const handleMouseMove = (row: number, col: number) => {
    if (!selecting || !startCell) return;

    setCurrentCell({ row, col });
    const cells = getCellsBetween(startCell, { row, col });
    setSelectedCells(cells);
  };

  // Gestisce il rilascio del mouse
  const handleMouseUp = () => {
    if (!selecting || !startCell || !currentCell) {
      setSelecting(false);
      return;
    }

    // Controlla se la selezione forma una parola valida
    const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
    const reversedWord = selectedCells.map(cell => grid[cell.row][cell.col]).reverse().join('');

    const foundWord = wordPositions.find(
      pos => pos.word === selectedWord || pos.word === reversedWord
    );

    if (foundWord && !foundWords.find(fw => fw.word === foundWord.word)) {
      // Parola trovata!
      const colorIndex = foundWords.length % COLORS.length;
      setFoundWords([...foundWords, {
        word: foundWord.word,
        cells: selectedCells,
        color: COLORS[colorIndex]
      }]);
    }

    setSelecting(false);
    setStartCell(null);
    setCurrentCell(null);
    setSelectedCells([]);
  };

  // Calcola le celle tra due punti
  const getCellsBetween = (start: SelectedCell, end: SelectedCell): SelectedCell[] => {
    const cells: SelectedCell[] = [];
    const dRow = Math.sign(end.row - start.row);
    const dCol = Math.sign(end.col - start.col);

    // Verifica che sia una linea retta (orizzontale, verticale o diagonale)
    const rowDiff = Math.abs(end.row - start.row);
    const colDiff = Math.abs(end.col - start.col);

    if (rowDiff !== 0 && colDiff !== 0 && rowDiff !== colDiff) {
      return [start];
    }

    const steps = Math.max(rowDiff, colDiff);
    for (let i = 0; i <= steps; i++) {
      cells.push({
        row: start.row + i * dRow,
        col: start.col + i * dCol
      });
    }

    return cells;
  };

  // Controlla se una cella è selezionata
  const isSelected = (row: number, col: number): boolean => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  // Controlla se una cella fa parte di una parola trovata
  const getFoundWordColor = (row: number, col: number): string | null => {
    const foundWord = foundWords.find(fw =>
      fw.cells.some(cell => cell.row === row && cell.col === col)
    );
    return foundWord ? foundWord.color : null;
  };

  const isDark = theme === 'dark';

  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Parole Intrecciate
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
          {/* Griglia di gioco */}
          <div className={`md:col-span-2 p-4 rounded-xl shadow-md border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div
              ref={gridRef}
              className="grid gap-0.5 select-none"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {grid.map((row, rowIndex) =>
                row.map((letter, colIndex) => {
                  const foundColor = getFoundWordColor(rowIndex, colIndex);
                  const isCurrentlySelected = isSelected(rowIndex, colIndex);

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`aspect-square flex items-center justify-center text-lg md:text-xl font-bold cursor-pointer transition-all ${
                        foundColor
                          ? 'rounded-full'
                          : isCurrentlySelected
                          ? 'bg-blue-200 rounded-lg'
                          : isDark
                          ? 'bg-slate-700 hover:bg-slate-600'
                          : 'bg-slate-100 hover:bg-slate-200'
                      } ${isDark ? 'text-white' : 'text-slate-900'}`}
                      style={foundColor ? { backgroundColor: foundColor } : {}}
                      onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                      onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        handleMouseDown(rowIndex, colIndex);
                      }}
                      onTouchMove={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const element = document.elementFromPoint(touch.clientX, touch.clientY);
                        if (element) {
                          const row = parseInt(element.getAttribute('data-row') || '0');
                          const col = parseInt(element.getAttribute('data-col') || '0');
                          if (!isNaN(row) && !isNaN(col)) {
                            handleMouseMove(row, col);
                          }
                        }
                      }}
                      onTouchEnd={handleMouseUp}
                      data-row={rowIndex}
                      data-col={colIndex}
                    >
                      {letter}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Lista parole da trovare */}
          <div className={`p-4 rounded-xl shadow-md border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Parole da Trovare ({foundWords.length}/{WORDS.length})
            </h3>
            <ul className="space-y-2">
              {WORDS.map(word => {
                const found = foundWords.find(fw => fw.word === word);
                return (
                  <li
                    key={word}
                    className={`p-3 rounded-lg font-semibold transition-all ${
                      found
                        ? 'text-white'
                        : isDark
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                    style={found ? { backgroundColor: found.color } : {}}
                  >
                    {word}
                    {found && ' ✓'}
                  </li>
                );
              })}
            </ul>

            {foundWords.length === WORDS.length && (
              <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
                <p className="text-green-800 font-bold text-lg">
                  🎉 Complimenti! Hai trovato tutte le parole!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordSearch;
