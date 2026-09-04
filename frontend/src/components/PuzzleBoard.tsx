import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { TileState, GameStatus, PuzzleImage } from '../types';
import { BLANK_ID, getRowCol, getSlidePath } from '../utils/puzzle';
import { Play, Sparkles, CheckCircle2 } from 'lucide-react';

interface PuzzleBoardProps {
  tiles: TileState[];
  currentImage: PuzzleImage;
  showNumbers: boolean;
  status: GameStatus;
  onTileClick: (clickedPos: number) => void;
  onKeyDownMove?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onResume: () => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  tiles,
  currentImage,
  showNumbers,
  status,
  onTileClick,
  onKeyDownMove,
  onResume,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const blankTile = tiles.find(t => t.isBlank || t.id === BLANK_ID);
  const blankPos = blankTile ? blankTile.currentPos : 15;

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
    <div className="w-full flex flex-col items-center justify-center select-none">
      <div
        id="puzzle-board-container"
        ref={boardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-[440px] aspect-square relative bg-[#EBE7DF] dark:bg-[#22201B] p-2.5 rounded-3xl border border-[#DAD2C3] dark:border-[#38352D] shadow-inner overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Background Grid Slots */}
        <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 sm:gap-1.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={`slot-${i}`}
              className="w-full h-full rounded-xl bg-[#FDFCF8]/60 dark:bg-[#1A1916]/70 border border-dashed border-[#DAD2C3]/80 dark:border-[#38352D] flex items-center justify-center text-[#9A9E7C] font-sans text-xs"
            >
              <span className="opacity-30 text-[11px]">{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Sliding Tiles */}
        <div className="absolute inset-2.5 pointer-events-none">
          {tiles.map((tile) => {
            if (tile.isBlank) return null;

            const { row: targetRow, col: targetCol } = getRowCol(tile.currentPos);
            const { row: origRow, col: origCol } = getRowCol(tile.originalPos);
            const isMovable = getSlidePath(tile.currentPos, blankPos) !== null;
            const isCorrectPosition = tile.currentPos === tile.originalPos;

            const bgPosX = (origCol / 3) * 100;
            const bgPosY = (origRow / 3) * 100;
            const tileNumber = tile.originalPos + 1;

            return (
              <motion.div
                key={`tile-${tile.id}`}
                layout
                initial={false}
                animate={{
                  left: `${targetCol * 25}%`,
                  top: `${targetRow * 25}%`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 30,
                  mass: 0.8,
                }}
                onClick={() => {
                  if (status !== 'paused') {
                    onTileClick(tile.currentPos);
                  }
                }}
                style={{
                  position: 'absolute',
                  width: '25%',
                  height: '25%',
                  padding: '2px',
                }}
                className={`pointer-events-auto cursor-pointer ${isMovable ? 'hover:z-10' : 'cursor-default'}`}
              >
                <div
                  className={`w-full h-full rounded-xl overflow-hidden relative flex items-center justify-center shadow-sm border ${
                    isNumericOnly
                      ? 'bg-[#9A9E7C] text-[#FDFCF8]'
                      : isCorrectPosition
                        ? 'border-[#3A5A40] dark:border-[#84B082]'
                        : 'border-[#DAD2C3] dark:border-[#3A3730]'
                  } ${isMovable ? 'hover:scale-[1.02] active:scale-95' : ''}`}
                  style={{
                    backgroundColor: isNumericOnly ? '#9A9E7C' : '#22201B',
                    backgroundImage: isNumericOnly ? undefined : `url(${currentImage.url})`,
                    backgroundSize: '400% 400%',
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {!isNumericOnly && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15 pointer-events-none" />
                  )}

                  {!isNumericOnly && showNumbers && (
                    <div
                      className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold backdrop-blur-md flex items-center gap-0.5 ${
                        isCorrectPosition
                          ? 'bg-[#3A5A40] text-white'
                          : 'bg-white/90 dark:bg-black/90 text-neutral-800 dark:text-neutral-100'
                      }`}
                    >
                      <span>{tileNumber}</span>
                      {isCorrectPosition && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                  )}

                  {isNumericOnly && (
                    <span className="text-3xl font-bold font-serif text-[#FDFCF8]">
                      {tileNumber}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Paused Overlay */}
        <AnimatePresence>
          {status === 'paused' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-[#FDFCF8]/90 dark:bg-[#151412]/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#A3B18A]/25 border border-[#9A9E7C]/40 flex items-center justify-center text-[#3A5A40] mb-3">
                <Play className="w-6 h-6 ml-0.5" />
              </div>
              <h3 className="text-xl font-bold text-[#3A5A40] dark:text-[#84B082] mb-3">Juego en pausa</h3>
              <button
                onClick={onResume}
                className="px-5 py-2 rounded-full bg-[#A3B18A] text-white text-xs font-bold uppercase tracking-wider"
              >
                Reanudar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#7A746B] dark:text-[#A8A196]">
        <Sparkles className="w-3.5 h-3.5 text-[#3A5A40]" />
        <span>Deslizá las fichas adyacentes al espacio vacío para resolverlo</span>
      </div>
    </div>
  );
};