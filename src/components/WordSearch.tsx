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

interface DifficultyConfig {
  gridSize: number;
  wordCount: number;
  directions: Array<'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up'>;
  words: string[];
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

// Configurazioni difficoltà
const DIFFICULTIES: { [key: string]: DifficultyConfig } = {
  facile: {
    gridSize: 10,
    wordCount: 6,
    directions: ['horizontal', 'vertical'],
    words: ['CASA', 'MARE', 'SOLE', 'LUNA', 'PANE', 'VINO', 'AMORE', 'FIORE']
  },
  media: {
    gridSize: 12,
    wordCount: 10,
    directions: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'],
    words: ['CANE', 'GATTO', 'ALBERO', 'MUSICA', 'NONNA', 'NONNO', 'MAMMA', 'PAPA', 'FIUME', 'MONTE', 'PIANTA', 'CIELO']
  },
  difficile: {
    gridSize: 15,
    wordCount: 15,
    directions: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'],
    words: ['BICCHIERE', 'FORCHETTA', 'CUCCHIAIO', 'OROLOGIO', 'SCARPA', 'PETTINE', 'SAPONE', 'ESTATE', 'INVERNO', 'PRIMVERA', 'AUTUNNO', 'MONTAGNA', 'GIARDINO', 'BIBLIOTECA', 'TEATRO']
  }
};

const CUSTOM_WORDS_KEY = 'wordsearch_custom_words';
const MAX_HINTS = 3;

type GamePhase = 'menu' | 'custom' | 'playing';
type Difficulty = 'facile' | 'media' | 'difficile' | 'custom';

export const WordSearch: React.FC<WordSearchProps> = ({ onChiudi, theme = 'light' }) => {
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('facile');
  const [customWords, setCustomWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState('');
  
  const [grid, setGrid] = useState<string[][]>([]);
  const [gridSize, setGridSize] = useState(10);
  const [words, setWords] = useState<string[]>([]);
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState<SelectedCell | null>(null);
  const [currentCell, setCurrentCell] = useState<SelectedCell | null>(null);
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  
  const [hintCells, setHintCells] = useState<SelectedCell[]>([]);
  const [hintsRemaining, setHintsRemaining] = useState(MAX_HINTS);
  const [hintTimeout, setHintTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  const gridRef = useRef<HTMLDivElement>(null);

  // Carica parole custom da localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_WORDS_KEY);
    if (saved) {
      setCustomWords(JSON.parse(saved));
    }
  }, []);

  // Inizializza il gioco quando si passa alla fase playing
  useEffect(() => {
    if (phase === 'playing') {
      initializeGame();
    }
  }, [phase, difficulty]);

  const initializeGame = () => {
    let config: DifficultyConfig;
    let selectedWords: string[];

    if (difficulty === 'custom') {
      // Usa parole custom
      selectedWords = [...customWords].sort(() => Math.random() - 0.5).slice(0, 10);
      config = {
        gridSize: 12,
        wordCount: selectedWords.length,
        directions: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'],
        words: selectedWords
      };
    } else {
      config = DIFFICULTIES[difficulty];
      selectedWords = [...config.words]
        .sort(() => Math.random() - 0.5)
        .slice(0, config.wordCount);
    }

    setGridSize(config.gridSize);
    setWords(selectedWords);
    setFoundWords([]);
    setHintsRemaining(MAX_HINTS);
    setHintCells([]);
    
    initializeGrid(selectedWords, config.gridSize, config.directions);
  };

  const initializeGrid = (wordsToPlace: string[], size: number, directions: string[]) => {
    const newGrid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
    const positions: WordPosition[] = [];

    wordsToPlace.forEach(word => {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)] as WordPosition['direction'];
        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);

        if (canPlaceWord(newGrid, word, startRow, startCol, direction, size)) {
          placeWord(newGrid, word, startRow, startCol, direction);
          positions.push({ word, startRow, startCol, direction });
          placed = true;
        }
        attempts++;
      }
    });

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
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
    direction: string,
    size: number
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

      if (row < 0 || row >= size || col < 0 || col >= size) {
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

  const handleMouseDown = (row: number, col: number) => {
    setSelecting(true);
    setStartCell({ row, col });
    setCurrentCell({ row, col });
    setSelectedCells([{ row, col }]);
  };

  const handleMouseMove = (row: number, col: number) => {
    if (!selecting || !startCell) return;

    setCurrentCell({ row, col });
    const cells = getCellsBetween(startCell, { row, col });
    setSelectedCells(cells);
  };

  const handleMouseUp = () => {
    if (!selecting || !startCell || !currentCell) {
      setSelecting(false);
      return;
    }

    const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
    const reversedWord = selectedCells.map(cell => grid[cell.row][cell.col]).reverse().join('');

    const foundWord = wordPositions.find(
      pos => pos.word === selectedWord || pos.word === reversedWord
    );

    if (foundWord && !foundWords.find(fw => fw.word === foundWord.word)) {
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

  const getCellsBetween = (start: SelectedCell, end: SelectedCell): SelectedCell[] => {
    const cells: SelectedCell[] = [];
    const dRow = Math.sign(end.row - start.row);
    const dCol = Math.sign(end.col - start.col);

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

  const isSelected = (row: number, col: number): boolean => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isHinted = (row: number, col: number): boolean => {
    return hintCells.some(cell => cell.row === row && cell.col === col);
  };

  const getFoundWordColor = (row: number, col: number): string | null => {
    const foundWord = foundWords.find(fw =>
      fw.cells.some(cell => cell.row === row && cell.col === col)
    );
    return foundWord ? foundWord.color : null;
  };

  const handleHint = () => {
    if (hintsRemaining <= 0) return;

    // Trova una parola non ancora trovata
    const unfoundWord = wordPositions.find(
      pos => !foundWords.find(fw => fw.word === pos.word)
    );

    if (!unfoundWord) return;

    // Calcola le celle della parola
    const deltas: { [key: string]: [number, number] } = {
      'horizontal': [0, 1],
      'vertical': [1, 0],
      'diagonal-down': [1, 1],
      'diagonal-up': [-1, 1]
    };

    const [dRow, dCol] = deltas[unfoundWord.direction];
    const cells: SelectedCell[] = [];

    for (let i = 0; i < unfoundWord.word.length; i++) {
      cells.push({
        row: unfoundWord.startRow + i * dRow,
        col: unfoundWord.startCol + i * dCol
      });
    }

    // Evidenzia le celle per 3 secondi
    setHintCells(cells);
    setHintsRemaining(hintsRemaining - 1);

    if (hintTimeout) {
      clearTimeout(hintTimeout);
    }

    const timeout = setTimeout(() => {
      setHintCells([]);
    }, 3000);

    setHintTimeout(timeout);
  };

  const handleAddCustomWord = () => {
    const word = newWord.trim().toUpperCase();
    if (word && word.length >= 3 && word.length <= 10 && !customWords.includes(word)) {
      const updated = [...customWords, word];
      setCustomWords(updated);
      localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(updated));
      setNewWord('');
    }
  };

  const handleRemoveCustomWord = (word: string) => {
    const updated = customWords.filter(w => w !== word);
    setCustomWords(updated);
    localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(updated));
  };

  const isDark = theme === 'dark';

  // SCHERMATA MENU
  if (phase === 'menu') {
    return (
      <div className={`fixed inset-0 z-50 overflow-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="p-4 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficoltà predefinite */}
            <div className={`p-6 rounded-xl shadow-md border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                🎯 Scegli Difficoltà
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setDifficulty('facile');
                    setPhase('playing');
                  }}
                  className={`w-full p-4 rounded-lg font-semibold transition-all ${
                    isDark
                      ? 'bg-green-700 hover:bg-green-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  🌱 Facile (10x10, 6 parole)
                </button>
                <button
                  onClick={() => {
                    setDifficulty('media');
                    setPhase('playing');
                  }}
                  className={`w-full p-4 rounded-lg font-semibold transition-all ${
                    isDark
                      ? 'bg-yellow-700 hover:bg-yellow-600 text-white'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                >
                  ⚡ Media (12x12, 10 parole)
                </button>
                <button
                  onClick={() => {
                    setDifficulty('difficile');
                    setPhase('playing');
                  }}
                  className={`w-full p-4 rounded-lg font-semibold transition-all ${
                    isDark
                      ? 'bg-red-700 hover:bg-red-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  🔥 Difficile (15x15, 15 parole)
                </button>
              </div>
            </div>

            {/* Modalità personalizzata */}
            <div className={`p-6 rounded-xl shadow-md border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ✏️ Parole Personalizzate
              </h3>
              <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Crea il tuo puzzle con parole personalizzate
              </p>
              <button
                onClick={() => setPhase('custom')}
                className={`w-full p-4 rounded-lg font-semibold transition-all ${
                  isDark
                    ? 'bg-blue-700 hover:bg-blue-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                🎨 Crea Puzzle Custom
              </button>
              {customWords.length > 0 && (
                <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  💾 Hai {customWords.length} parole salvate
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCHERMATA CUSTOM
  if (phase === 'custom') {
    return (
      <div className={`fixed inset-0 z-50 overflow-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="p-4 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              ✏️ Parole Personalizzate
            </h2>
            <button
              onClick={() => setPhase('menu')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              ← Indietro
            </button>
          </div>

          <div className={`p-6 rounded-xl shadow-md border mb-6 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Aggiungi Parole
            </h3>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomWord()}
                placeholder="Inserisci una parola (3-10 lettere)"
                maxLength={10}
                className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                onClick={handleAddCustomWord}
                disabled={!newWord.trim() || newWord.length < 3 || newWord.length > 10}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  !newWord.trim() || newWord.length < 3 || newWord.length > 10
                    ? 'bg-slate-400 cursor-not-allowed'
                    : isDark
                    ? 'bg-blue-700 hover:bg-blue-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                ➕ Aggiungi
              </button>
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              💡 Suggerimento: Aggiungi almeno 6 parole per un buon puzzle
            </p>
          </div>

          {customWords.length > 0 && (
            <div className={`p-6 rounded-xl shadow-md border mb-6 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Le Tue Parole ({customWords.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {customWords.map(word => (
                  <div
                    key={word}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                      isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {word}
                    <button
                      onClick={() => handleRemoveCustomWord(word)}
                      className="text-red-500 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              if (customWords.length >= 3) {
                setDifficulty('custom');
                setPhase('playing');
              }
            }}
            disabled={customWords.length < 3}
            className={`w-full p-4 rounded-lg font-semibold text-lg transition-all ${
              customWords.length < 3
                ? 'bg-slate-400 cursor-not-allowed text-slate-600'
                : isDark
                ? 'bg-green-700 hover:bg-green-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            🎮 Inizia il Puzzle ({customWords.length} parole)
          </button>
        </div>
      </div>
    );
  }

  // SCHERMATA DI GIOCO
  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Parole Intrecciate - {difficulty === 'custom' ? 'Custom' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {gridSize}x{gridSize} • {words.length} parole
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleHint}
              disabled={hintsRemaining <= 0 || foundWords.length === words.length}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                hintsRemaining <= 0 || foundWords.length === words.length
                  ? 'bg-slate-400 cursor-not-allowed'
                  : isDark
                  ? 'bg-yellow-700 hover:bg-yellow-600 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
            >
              💡 Aiuto ({hintsRemaining})
            </button>
            <button
              onClick={() => setPhase('menu')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              ← Menu
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Griglia di gioco */}
          <div className={`md:col-span-2 p-4 rounded-xl shadow-md border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div
              ref={gridRef}
              className="grid gap-0.5 select-none"
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {grid.map((row, rowIndex) =>
                row.map((letter, colIndex) => {
                  const foundColor = getFoundWordColor(rowIndex, colIndex);
                  const isCurrentlySelected = isSelected(rowIndex, colIndex);
                  const cellIsHinted = isHinted(rowIndex, colIndex);

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`aspect-square flex items-center justify-center text-sm md:text-lg font-bold cursor-pointer transition-all ${
                        foundColor
                          ? 'rounded-full'
                          : cellIsHinted
                          ? 'bg-yellow-300 rounded-lg animate-pulse'
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
              Parole da Trovare ({foundWords.length}/{words.length})
            </h3>
            <ul className="space-y-2">
              {words.map(word => {
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

            {foundWords.length === words.length && (
              <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
                <p className="text-green-800 font-bold text-lg">
                  🎉 Complimenti! Hai trovato tutte le parole!
                </p>
              </div>
            )}

            {hintsRemaining < MAX_HINTS && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                💡 Aiuti rimanenti: {hintsRemaining}/{MAX_HINTS}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordSearch;
