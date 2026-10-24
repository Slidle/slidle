import React from 'react';
import { Clock, RefreshCw, Star, Play, Eye, EyeOff, RotateCcw, ImageIcon } from 'lucide-react';
import { formatTime } from '../utils/puzzle';
import { motion, AnimatePresence } from 'motion/react';

interface ActiveGameControlsProps {
  timeSeconds: number;
  moves: number;
  score: number;
  isPaused: boolean;
  onTogglePause: () => void;
  showStats: boolean;
  onToggleStats: () => void;
  onShuffleRequest: () => void;
  onOpenReference: () => void;
  children: React.ReactNode; // El PuzzleBoard
}

export const ActiveGameControls: React.FC<ActiveGameControlsProps> = ({
  timeSeconds,
  moves,
  score,
  isPaused,
  onTogglePause,
  showStats,
  onToggleStats,
  onShuffleRequest,
  onOpenReference,
  children,
}) => {
  return (
    <div className="w-full max-w-310 mx-auto flex flex-col items-center gap-4 sm:gap-5">
      {/* 1. Botones de acción superior: Pausar y Ocultar estadísticas */}
      <div className="w-full flex justify-between sm:justify-end gap-2.5">
        <button
          type="button"
          onClick={onTogglePause}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-main hover:bg-blue-main/90 text-white font-bold text-base border border-black rounded-xl shadow-card cursor-pointer transition active:translate-y-0.5"
        >
          <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-blue-main shrink-0">
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          </div>
        </button>

        <button
          type="button"
          onClick={onToggleStats}
          className="flex-2 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blanco hover:bg-cream text-ink font-bold text-sm border border-ink rounded-xl shadow-card cursor-pointer transition active:translate-y-0.5 whitespace-nowrap"
        >
          {showStats ? (
            <EyeOff className="w-4 h-4 text-ink shrink-0" />
          ) : (
            <Eye className="w-4 h-4 text-ink shrink-0" />
          )}
          <span>{showStats ? 'Ocultar estadísticas' : 'Mostrar estadísticas'}</span>
        </button>
      </div>

      {/* 2. Fila horizontal de métricas (animada al mostrar/ocultar) */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full grid grid-cols-3 gap-2 sm:gap-3 overflow-hidden pb-1"
          >
            {/* Tiempo */}
            <div className="bg-blanco border border-black rounded-card p-2 sm:p-3 shadow-card flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-ink bg-cream flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ink stroke-[2.2]" />
              </div>
              <div className="flex flex-col text-center sm:text-left leading-none min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-text font-bold">Tiempo</span>
                <span className="text-xs sm:text-base font-extrabold text-ink tabular-nums mt-0.5">
                  {formatTime(timeSeconds)}
                </span>
              </div>
            </div>

            {/* Movimientos */}
            <div className="bg-blanco border border-black rounded-card p-2 sm:p-3 shadow-card flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-ink bg-cream flex items-center justify-center shrink-0">
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ink stroke-[2.2]" />
              </div>
              <div className="flex flex-col text-center sm:text-left leading-none min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-text font-bold">Movimientos</span>
                <span className="text-xs sm:text-base font-extrabold text-ink tabular-nums mt-0.5">
                  {moves}
                </span>
              </div>
            </div>

            {/* Puntuación */}
            <div className="bg-blanco border border-black rounded-card p-2 sm:p-3 shadow-card flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-ink bg-cream flex items-center justify-center shrink-0">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ink stroke-[2.2]" />
              </div>
              <div className="flex flex-col text-center sm:text-left leading-none min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-text font-bold">Puntuación</span>
                <span className="text-xs sm:text-base font-extrabold text-ink tabular-nums mt-0.5">
                  {score.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Tablero central envuelto */}
      <div
        className={`w-full flex items-center justify-center transition-all duration-300 ease-in-out ${
          showStats 
            ? 'max-w-120 sm:max-w-125'  /* Tamaño estándar cuando las stats están visibles */
            : 'max-w-135 sm:max-w-145'  /* Se agranda cuando se ocultan las stats */
        }`}
      >
        {children}
      </div>

      {/* 4. Botones inferiores: Barajar e Imagen de referencia */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onShuffleRequest}
          className="flex items-center gap-2 px-4 py-2 bg-blanco hover:bg-cream border border-ink rounded-card shadow-card text-xs sm:text-sm font-bold text-ink cursor-pointer transition active:translate-y-0.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-ink" />
          <span>Barajar tablero</span>
        </button>

        <button
          type="button"
          onClick={onOpenReference}
          className="flex items-center gap-2 px-4 py-2 bg-blanco hover:bg-cream border border-ink rounded-card shadow-card text-xs sm:text-sm font-bold text-ink cursor-pointer transition active:translate-y-0.5"
        >
          <ImageIcon className="w-3.5 h-3.5 text-ink" />
          <span>Imagen de referencia</span>
        </button>
      </div>

      <p className="text-xs text-text font-medium text-center -mt-1">
        Las piezas con borde verde ya están en su lugar correcto.
      </p>
    </div>
  );
};