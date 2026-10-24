import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { TileState, GameStatus, PuzzleImage } from '../types';
import { getRowCol, getSlidePath, getGridSize, getBlankId } from '../utils/puzzle';
import { Play } from 'lucide-react';
import type { BoardMode } from './DifficultySelector';

interface PuzzleBoardProps {
  tiles: TileState[];
  currentImage: PuzzleImage;
  showNumbers: boolean;
  status: GameStatus;
  mode?: BoardMode; // '3x3' | '4x4'
  onTileClick: (clickedPos: number) => void;
  onKeyDownMove?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onResume: () => void;
  className?: string;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  tiles,
  currentImage,
  showNumbers,
  status,
  mode = '4x4', 
  onTileClick,
  onKeyDownMove,
  onResume,
  className = 'w-full',
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const gridSize = mode === '3x3' ? 3 : 4;
  const totalSlots = gridSize * gridSize; 
  const blankId = totalSlots - 1; 
  const tileDimensionPercent = 100 / gridSize; 
  const bgScalePercent = gridSize * 100; 

  const blankTile = tiles.find((t) => t.isBlank || t.id === blankId);
  const blankPos = blankTile ? blankTile.currentPos : totalSlots - 1;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0 || !onKeyDownMove) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const threshold = 30;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > threshold) onKeyDownMove('right');
      else if (dx < -threshold) onKeyDownMove('left');
    } else {
      if (dy > threshold) onKeyDownMove('down');
      else if (dy < -threshold) onKeyDownMove('up');
    }
  };

  const isNumericOnly = !currentImage.url;

  return (
    <div className={`w-full aspect-square flex flex-col items-center justify-center select-none transition-all duration-300 ${className}`}>
      <div
        id="puzzle-board-container"
        ref={boardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full aspect-square relative bg-white p-2.5 rounded-[24px] border-2 border-black shadow-card overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Grilla dinámica según modo */}
        <div
          className={`w-full h-full grid gap-1.5 ${
            mode === '3x3' ? 'grid-cols-3 grid-rows-3' : 'grid-cols-4 grid-rows-4'
          }`}
        >
          {Array.from({ length: totalSlots }).map((_, i) => {
            const isBlankSlot = i === blankPos && status === 'playing';
            return (
              <div
                key={`slot-${i}`}
                className={`w-full h-full rounded-[14px] transition-colors ${
                  isBlankSlot
                    ? 'bg-cream/40 border-2 border-dashed border-ink/30'
                    : 'border-0 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Fichas deslizantes */}
        <div className="absolute inset-2.5 pointer-events-none">
          {tiles.map((tile) => {
            if (tile.isBlank) return null;

            // Pasamos gridSize para que calcule fila y columna en base a 3 (no a 4)
            const { row: targetRow, col: targetCol } = getRowCol(tile.currentPos, gridSize);
            const { row: origRow, col: origCol } = getRowCol(tile.originalPos, gridSize);
            const isMovable = getSlidePath(tile.currentPos, blankPos, gridSize) !== null;
            const isCorrectPosition = tile.currentPos === tile.originalPos && status === 'playing';

            // Recorte dinámico de imagen
            const bgPosX = (origCol / (gridSize - 1)) * 100;
            const bgPosY = (origRow / (gridSize - 1)) * 100;
            const tileNumber = tile.originalPos + 1;

            return (
              <motion.div
                key={`tile-${tile.id}`}
                layout
                initial={false}
                animate={{
                  left: `${targetCol * tileDimensionPercent}%`,
                  top: `${targetRow * tileDimensionPercent}%`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 30,
                  mass: 0.8,
                }}
                onClick={() => {
                  if (status === 'playing') {
                    onTileClick(tile.currentPos);
                  }
                }}
                style={{
                  position: 'absolute',
                  width: `${tileDimensionPercent}%`,
                  height: `${tileDimensionPercent}%`,
                  padding: '2.5px',
                }}
                className={`pointer-events-auto ${
                  status === 'playing' && isMovable
                    ? 'cursor-pointer hover:z-10'
                    : 'cursor-default pointer-events-none'
                }`}
              >
                <div
                  className={`w-full h-full rounded-[14px] overflow-hidden relative flex items-center justify-center shadow-xs transition-all ${
                    isCorrectPosition
                      ? 'border-2 border-green-main'
                      : 'border border-ink/40'
                  } ${isMovable && status === 'playing' ? 'hover:scale-[1.01] active:scale-95' : ''}`}
                  style={{
                    backgroundColor: isNumericOnly ? '#9A9E7C' : '#22201B',
                    backgroundImage: isNumericOnly ? undefined : `url(${currentImage.url})`,
                    backgroundSize: `${bgScalePercent}% ${bgScalePercent}%`,
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {showNumbers && (
                    <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-white border border-black/80 flex items-center justify-center text-[10px] font-extrabold text-ink shadow-xs">
                      <span>{tileNumber}</span>
                    </div>
                  )}

                  {isCorrectPosition && (
                    <div className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-green-main border border-black/30 flex items-center justify-center text-white shadow-xs">
                      <svg className="w-2.5 h-2.5 stroke-[3.5] fill-none stroke-current" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Overlay de Pausa */}
        <AnimatePresence>
          {status === 'paused' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-blanco/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-black bg-cream flex items-center justify-center text-blue-main mb-2 shadow-xs">
                <Play className="w-7 h-7 fill-current ml-0.5" />
              </div>

              <h3 className="text-3xl font-bold text-ink mb-2">Pausado</h3>
              <p className="text-sm text-text max-w-xs mb-4">
                El cronómetro está detenido. Tus movimientos y tu puntuación se conservan.
              </p>

              <button
                type="button"
                onClick={onResume}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-main hover:bg-blue-main/90 text-white font-bold text-xs sm:text-sm border border-black rounded-xl shadow-card cursor-pointer transition active:translate-y-0.5"
              >
                <span>Reanudar juego</span>
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-blue-main">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};