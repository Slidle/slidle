import { useState, useEffect, useRef, useCallback } from 'react';
import { PuzzleBoard } from './components/PuzzleBoard';
import type { TileState, GameStatus, PuzzleImage } from './types';
import { BLANK_ID, getSlidePath, isPuzzleSolved, shuffleBoard, formatTime } from './utils/puzzle';

const DEFAULT_IMAGE: PuzzleImage = {
  name: 'Gatito Diario',
  url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
};

export default function App() {
  const [tiles, setTiles] = useState<TileState[]>(() => shuffleBoard('easy'));
  const [status, setStatus] = useState<GameStatus>('idle');
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [moves, setMoves] = useState(0);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = window.setInterval(() => {
        setTimeSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const handleStartNewGame = () => {
    setTiles(shuffleBoard('easy'));
    setStatus('idle');
    setTimeSeconds(0);
    setMoves(0);
  };

const handleTileClick = useCallback((clickedPos: number) => {
    const blankTile = tiles.find((t) => t.isBlank || t.id === BLANK_ID);
    if (!blankTile) return;

    const blankPos = blankTile.currentPos;
    const path = getSlidePath(clickedPos, blankPos);
    
    // Si no es un movimiento válido, no hace nada
    if (!path || path.length === 0) return;

    if (status === 'idle') setStatus('playing');

    // Incrementa el contador una sola vez
    setMoves((prev) => prev + 1);

    // Aplica el movimiento al tablero
    setTiles((prev) => {
      const nextTiles = prev.map((t) => ({ ...t }));
      let currentEmpty = blankPos;

      for (const movePos of path) {
        const tileIndex = nextTiles.findIndex((t) => t.currentPos === movePos);
        const blankIndex = nextTiles.findIndex((t) => t.currentPos === currentEmpty);

        if (tileIndex !== -1 && blankIndex !== -1) {
          nextTiles[tileIndex].currentPos = currentEmpty;
          nextTiles[blankIndex].currentPos = movePos;
          currentEmpty = movePos;
        }
      }

      if (isPuzzleSolved(nextTiles)) {
        setStatus('won');
      }

      return nextTiles;
    });
  }, [tiles, status]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#151412] text-[#4A453E] dark:text-[#EDE8DF] flex flex-col items-center justify-center p-4">
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold font-serif mb-1">Slidle</h1>
        <div className="flex gap-6 justify-center text-sm font-semibold">
          <span>Tiempo: {formatTime(timeSeconds)}</span>
          <span>Movimientos: {moves}</span>
        </div>
      </header>

      <PuzzleBoard
        tiles={tiles}
        currentImage={DEFAULT_IMAGE}
        showNumbers={true}
        status={status}
        onTileClick={handleTileClick}
        onResume={() => setStatus('playing')}
      />

      {status === 'won' && (
        <div className="mt-4 p-3 bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 rounded-xl font-bold">
          ¡Felicitaciones! Puzzle resuelto en {moves} movimientos y {formatTime(timeSeconds)}.
        </div>
      )}

      <button
        onClick={handleStartNewGame}
        className="mt-5 px-5 py-2 rounded-xl bg-[#3A5A40] text-white text-sm font-semibold shadow hover:opacity-90 transition cursor-pointer"
      >
        Mezclar de nuevo
      </button>
    </div>
  );
}