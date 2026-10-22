import { useState } from 'react';

type Difficolta = 'facile' | 'media' | 'difficile';
type CellType = null | 'player' | 'ai';
type GameState = 'selecting' | 'playing' | 'finished';

interface Forza4Props {
  onChiudi: () => void;
}

export default function Forza4({ onChiudi }: Forza4Props) {
  const [difficolta, setDifficolta] = useState<Difficolta>('media');
  const [gameState, setGameState] = useState<GameState>('selecting');
  const [board, setBoard] = useState<CellType[][]>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<'player' | 'ai'>('player');
  const [winner, setWinner] = useState<'player' | 'ai' | 'pareggio' | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);

  function createEmptyBoard(): CellType[][] {
    return Array(6).fill(null).map(() => Array(7).fill(null));
  }

  function startGame(diff: Difficolta) {
    setDifficolta(diff);
    setBoard(createEmptyBoard());
    setCurrentPlayer('player');
    setWinner(null);
    setGameState('playing');
  }

  function dropPiece(col: number) {
    if (currentPlayer !== 'player' || winner) return;

    const newBoard = board.map(row => [...row]);
    
    // Trova la riga più bassa disponibile nella colonna
    let row = -1;
    for (let r = 5; r >= 0; r--) {
      if (newBoard[r][col] === null) {
        row = r;
        break;
      }
    }

    if (row === -1) return; // Colonna piena

    newBoard[row][col] = 'player';
    setBoard(newBoard);

    const winCells = checkWinner(newBoard, row, col, 'player');
    if (winCells) {
      setWinner('player');
      setWinningCells(winCells);
      setGameState('finished');
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('pareggio');
      setWinningCells([]);
      setGameState('finished');
      return;
    }

    setCurrentPlayer('ai');
    
    // AI gioca dopo un breve delay
    setTimeout(() => aiMove(newBoard), 500);
  }

  function aiMove(currentBoard: CellType[][]) {
    const newBoard = currentBoard.map(row => [...row]);
    let col = -1;

    if (difficolta === 'facile') {
      // Gioca casualmente
      const availableCols = getAvailableColumns(newBoard);
      col = availableCols[Math.floor(Math.random() * availableCols.length)];
    } else if (difficolta === 'media') {
      // 50% di chance di giocare in modo strategico
      if (Math.random() < 0.5) {
        col = findWinningMove(newBoard, 'ai') ?? findWinningMove(newBoard, 'player') ?? getRandomColumn(newBoard);
      } else {
        col = getRandomColumn(newBoard);
      }
    } else {
      // Difficile: sempre strategico
      col = findWinningMove(newBoard, 'ai') ?? findWinningMove(newBoard, 'player') ?? findStrategicMove(newBoard) ?? getRandomColumn(newBoard);
    }

    if (col === -1) return;

    // Trova la riga
    let row = -1;
    for (let r = 5; r >= 0; r--) {
      if (newBoard[r][col] === null) {
        row = r;
        break;
      }
    }

    newBoard[row][col] = 'ai';
    setBoard(newBoard);

    const winCells = checkWinner(newBoard, row, col, 'ai');
    if (winCells) {
      setWinner('ai');
      setWinningCells(winCells);
      setGameState('finished');
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('pareggio');
      setWinningCells([]);
      setGameState('finished');
      return;
    }

    setCurrentPlayer('player');
  }

  function getAvailableColumns(board: CellType[][]): number[] {
    const cols: number[] = [];
    for (let c = 0; c < 7; c++) {
      if (board[0][c] === null) cols.push(c);
    }
    return cols;
  }

  function getRandomColumn(board: CellType[][]): number {
    const cols = getAvailableColumns(board);
    return cols[Math.floor(Math.random() * cols.length)];
  }

  function findWinningMove(board: CellType[][], player: 'player' | 'ai'): number | null {
    const cols = getAvailableColumns(board);
    for (const col of cols) {
      const testBoard = board.map(row => [...row]);
      let row = -1;
      for (let r = 5; r >= 0; r--) {
        if (testBoard[r][col] === null) {
          row = r;
          break;
        }
      }
      if (row !== -1) {
        testBoard[row][col] = player;
        if (checkWinner(testBoard, row, col, player) !== null) {
          return col;
        }
      }
    }
    return null;
  }

  function findStrategicMove(board: CellType[][]): number | null {
    // Preferisci il centro
    const centerCol = 3;
    if (board[0][centerCol] === null) return centerCol;
    
    // Poi colonne adiacenti al centro
    for (const offset of [1, -1, 2, -2, 3, -3]) {
      const col = centerCol + offset;
      if (col >= 0 && col < 7 && board[0][col] === null) return col;
    }
    
    return null;
  }

  function checkWinner(board: CellType[][], row: number, col: number, player: 'player' | 'ai'): [number, number][] | null {
    const directions = [
      [[0, 1], [0, -1]],   // orizzontale
      [[1, 0], [-1, 0]],   // verticale
      [[1, 1], [-1, -1]],  // diagonale \
      [[1, -1], [-1, 1]],  // diagonale /
    ];

    for (const [dir1, dir2] of directions) {
      const cells: [number, number][] = [[row, col]];
      
      // Conta in una direzione
      let r = row + dir1[0];
      let c = col + dir1[1];
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === player) {
        cells.push([r, c]);
        r += dir1[0];
        c += dir1[1];
      }
      
      // Conta nell'altra direzione
      r = row + dir2[0];
      c = col + dir2[1];
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === player) {
        cells.push([r, c]);
        r += dir2[0];
        c += dir2[1];
      }
      
      if (cells.length >= 4) return cells;
    }
    
    return null;
  }

  function isBoardFull(board: CellType[][]): boolean {
    return board[0].every(cell => cell !== null);
  }

  // Schermata selezione difficoltà
  if (gameState === 'selecting') {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-center space-y-6">
          <div className="text-6xl">🎯</div>
          <h2 className="text-3xl font-bold text-slate-900">Forza 4</h2>
          <p className="text-xl text-slate-600">Scegli la difficoltà</p>
          
          <div className="space-y-3">
            <button
              onClick={() => startGame('facile')}
              className="w-full p-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              🌱 Facile
            </button>
            <button
              onClick={() => startGame('media')}
              className="w-full p-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              ⚡ Media
            </button>
            <button
              onClick={() => startGame('difficile')}
              className="w-full p-6 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              🔥 Difficile
            </button>
          </div>

          <button
            onClick={onChiudi}
            className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
          >
            ← Torna ai Giochi
          </button>
        </div>
      </div>
    );
  }

  // Funzione helper per controllare se una cella è vincente
  function isWinningCell(row: number, col: number): boolean {
    return winningCells.some(([r, c]) => r === row && c === col);
  }

  // Schermata di gioco
  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">🎯 Forza 4</h2>
            <p className="text-sm text-slate-500">
              Difficoltà: {difficolta === 'facile' ? '🌱 Facile' : difficolta === 'media' ? '⚡ Media' : '🔥 Difficile'}
            </p>
          </div>
          <button
            onClick={onChiudi}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg"
          >
            ← Chiudi
          </button>
        </div>
      </div>

      {/* Contenuto */}
      <div className="flex-1 flex flex-col items-center justify-start p-4">
        <div className="max-w-4xl w-full space-y-4">
          {/* Turno corrente */}
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">
              {currentPlayer === 'player' ? '🔴 Tocca a te!' : '🟡 L\'AI sta pensando...'}
            </p>
          </div>

          {/* Griglia di gioco */}
          <div className="bg-blue-600 rounded-xl p-4 shadow-xl">
            <div className="grid grid-cols-7 gap-2">
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isWinning = isWinningCell(rowIndex, colIndex);
                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => dropPiece(colIndex)}
                      disabled={currentPlayer !== 'player' || board[0][colIndex] !== null || gameState === 'finished'}
                      className={`aspect-square bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all disabled:cursor-not-allowed ${
                        isWinning ? 'ring-4 ring-yellow-300 scale-110 animate-pulse' : ''
                      }`}
                    >
                      {cell === 'player' && (
                        <div className={`w-full h-full rounded-full shadow-inner ${
                          isWinning ? 'bg-red-600' : 'bg-red-500'
                        }`} />
                      )}
                      {cell === 'ai' && (
                        <div className={`w-full h-full rounded-full shadow-inner ${
                          isWinning ? 'bg-yellow-500' : 'bg-yellow-400'
                        }`} />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Indicatori colonne */}
          <div className="grid grid-cols-7 gap-2">
            {Array(7).fill(null).map((_, i) => (
              <div key={i} className="text-center text-sm text-slate-500">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modale fine partita */}
      {gameState === 'finished' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white/95 rounded-2xl max-w-xs w-full p-5 text-center space-y-4 shadow-2xl transform animate-in zoom-in-95 duration-300 border-2 border-white">
            <div className="text-5xl">
              {winner === 'player' ? '🎉' : winner === 'ai' ? '😊' : '🤝'}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {winner === 'player' && 'Bravissimo! Hai vinto!'}
              {winner === 'ai' && 'Ottima partita!'}
              {winner === 'pareggio' && 'Pareggio!'}
            </h2>
            <p className="text-base text-slate-600">
              {winner === 'player' && 'Sei stato fantastico!'}
              {winner === 'ai' && 'La prossima volta andrà meglio!'}
              {winner === 'pareggio' && 'Siete stati entrambi bravi!'}
            </p>
            
            <div className="flex flex-row gap-3">
              <button
                onClick={() => startGame(difficolta)}
                className="flex-1 py-2.5 px-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg shadow transition-colors"
                title="Riavvia Partita"
              >
                🔄
              </button>
              <button
                onClick={() => {
                  setGameState('selecting');
                  setWinningCells([]);
                }}
                className="flex-1 py-2.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                title="Cambia Difficoltà"
              >
                ⚙️
              </button>
              <button
                onClick={onChiudi}
                className="flex-1 py-2.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                title="Esci"
              >
                ←
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
