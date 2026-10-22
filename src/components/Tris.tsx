import { useState } from 'react';

type Difficolta = 'facile' | 'media' | 'difficile';
type CellType = null | 'X' | 'O';
type GameState = 'selecting' | 'playing' | 'finished';

interface TrisProps {
  onChiudi: () => void;
}

export default function Tris({ onChiudi }: TrisProps) {
  const [difficolta, setDifficolta] = useState<Difficolta>('media');
  const [gameState, setGameState] = useState<GameState>('selecting');
  const [board, setBoard] = useState<CellType[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | 'pareggio' | null>(null);

  function startGame(diff: Difficolta) {
    setDifficolta(diff);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameState('playing');
  }

  function makeMove(index: number) {
    if (board[index] !== null || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameState('finished');
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('pareggio');
      setGameState('finished');
      return;
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    // Se tocca all'AI, gioca dopo un breve delay
    if (nextPlayer === 'O') {
      setTimeout(() => aiMove(newBoard), 500);
    }
  }

  function aiMove(currentBoard: CellType[]) {
    let move = -1;

    if (difficolta === 'facile') {
      // Gioca casualmente
      const availableMoves = currentBoard
        .map((cell, idx) => (cell === null ? idx : -1))
        .filter(idx => idx !== -1);
      move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else if (difficolta === 'media') {
      // 60% di chance di giocare in modo strategico
      if (Math.random() < 0.6) {
        move = findWinningMove(currentBoard, 'O') ?? findWinningMove(currentBoard, 'X') ?? findStrategicMove(currentBoard) ?? getRandomMove(currentBoard);
      } else {
        move = getRandomMove(currentBoard);
      }
    } else {
      // Difficile: sempre strategico con minimax semplificato
      move = findWinningMove(currentBoard, 'O') ?? findWinningMove(currentBoard, 'X') ?? findStrategicMove(currentBoard) ?? getRandomMove(currentBoard);
    }

    if (move === -1) return;

    const newBoard = [...currentBoard];
    newBoard[move] = 'O';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameState('finished');
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('pareggio');
      setGameState('finished');
      return;
    }

    setCurrentPlayer('X');
  }

  function getRandomMove(board: CellType[]): number {
    const availableMoves = board
      .map((cell, idx) => (cell === null ? idx : -1))
      .filter(idx => idx !== -1);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  function findWinningMove(board: CellType[], player: 'X' | 'O'): number | null {
    const availableMoves = board
      .map((cell, idx) => (cell === null ? idx : -1))
      .filter(idx => idx !== -1);

    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = player;
      if (checkWinner(testBoard) === player) {
        return move;
      }
    }
    return null;
  }

  function findStrategicMove(board: CellType[]): number | null {
    // Preferisci il centro
    if (board[4] === null) return 4;
    
    // Poi gli angoli
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(idx => board[idx] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    return null;
  }

  function checkWinner(board: CellType[]): 'X' | 'O' | null {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // righe
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonne
      [0, 4, 8], [2, 4, 6],            // diagonali
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as 'X' | 'O';
      }
    }
    return null;
  }

  function isBoardFull(board: CellType[]): boolean {
    return board.every(cell => cell !== null);
  }

  // Schermata selezione difficoltà
  if (gameState === 'selecting') {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-center space-y-6">
          <div className="text-6xl">⭕</div>
          <h2 className="text-3xl font-bold text-slate-900">Tris</h2>
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

  // Schermata partita finita
  if (gameState === 'finished') {
    const playerSymbol = 'X';
    const aiSymbol = 'O';
    
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 text-center space-y-6">
          <div className="text-7xl">
            {winner === playerSymbol ? '🎉' : winner === aiSymbol ? '😊' : '🤝'}
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            {winner === playerSymbol && 'Bravissimo! Hai vinto!'}
            {winner === aiSymbol && 'Ottima partita!'}
            {winner === 'pareggio' && 'Pareggio!'}
          </h2>
          <p className="text-xl text-slate-600">
            {winner === playerSymbol && 'Sei stato fantastico!'}
            {winner === aiSymbol && 'La prossima volta andrà meglio!'}
            {winner === 'pareggio' && 'Siete stati entrambi bravi!'}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => startGame(difficolta)}
              className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl shadow-lg transition-colors"
            >
              🔄 Gioca Ancora
            </button>
            <button
              onClick={() => setGameState('selecting')}
              className="w-full p-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-lg font-medium rounded-xl transition-colors"
            >
              ⚙️ Cambia Difficoltà
            </button>
            <button
              onClick={onChiudi}
              className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
            >
              ← Torna ai Giochi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Schermata di gioco
  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">⭕ Tris</h2>
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
        <div className="max-w-2xl w-full space-y-6">
          {/* Turno corrente */}
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">
              {currentPlayer === 'X' ? '❌ Tocca a te!' : '⭕ L\'AI sta pensando...'}
            </p>
          </div>

          {/* Griglia di gioco */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl mx-auto max-w-md">
            <div className="grid grid-cols-3 gap-3">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => makeMove(index)}
                  disabled={cell !== null || currentPlayer !== 'X' || winner !== null}
                  className="aspect-square bg-white rounded-lg flex items-center justify-center text-6xl md:text-7xl font-bold hover:bg-slate-100 transition-colors disabled:cursor-not-allowed"
                >
                  {cell === 'X' && <span className="text-red-500">❌</span>}
                  {cell === 'O' && <span className="text-blue-500">⭕</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Legenda */}
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl">❌</div>
              <div className="text-sm text-slate-600 font-medium">Tu</div>
            </div>
            <div>
              <div className="text-3xl">⭕</div>
              <div className="text-sm text-slate-600 font-medium">AI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
