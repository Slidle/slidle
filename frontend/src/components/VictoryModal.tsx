import React from 'react';
import { Trophy, Star, Flame, Clock, RefreshCw, RotateCcw, ArrowRight, Bookmark, X } from 'lucide-react';
import logoSvg from '../assets/Logo.svg';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardMode: '3x3' | '4x4';
  score: number;
  timeSeconds: number;
  moves: number;
  streakDays?: number;
  dailyGoalPoints: number;
  targetDailyGoal?: number;
  onSaveAsGuest: () => void;
  onPlayAgain: () => void;
  onNextChallenge: () => void;
  onViewLeaderboard?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onClose,
  boardMode,
  score,
  timeSeconds,
  moves,
  streakDays = 1,
  dailyGoalPoints,
  targetDailyGoal = 2000,
  onSaveAsGuest,
  onPlayAgain,
  onNextChallenge,
  onViewLeaderboard,
}) => {
  if (!isOpen) return null;

  // Formatear segundos a MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Porcentaje para la barra de meta diaria (topeado en 100%)
  const progressPercentage = Math.min(100, Math.round((dailyGoalPoints / targetDailyGoal) * 100));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-card bg-white shadow-2xl overflow-hidden my-auto"
      >
        {/* Botón cerrar (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3.5 right-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 bg-white/80 text-ink/70 hover:bg-white hover:text-ink transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ZONA SUPERIOR */}
        <div className="bg-cream px-6 pt-6 pb-5 text-center border-b border-ink/15">
          {/* Logo Slidle */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="flex items-center gap-2">
              <img
                src={logoSvg}
                alt="Logo Slidle"
                className="h-6 w-auto object-contain"
              />
            </div>
          </div>

          {/* Ícono Trofeo verde */}
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 border border-ink text-white shadow-[0_2px_0px_#000000]">
            <Trophy className="h-6 w-6" />
          </div>

          {/* Título y subtítulo */}
          <h2 className="text-2xl font-bold text-ink tracking-tight">
            ¡Puzzle resuelto!
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-medium text-ink/70">
            Completaste el desafío {boardMode} de hoy. ¡Excelente trabajo!
          </p>

          {/* Tarjeta 1: Puntuación obtenida + Racha */}
          <div className="mt-5 flex items-center justify-between rounded-lg bg-white border border-ink px-4 py-3 text-left shadow-[0_1px_0px_#000000]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black bg-amber-50 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-text">
                  Puntuación obtenida
                </span>
                <span className="text-xl font-extrabold text-amber-500 leading-tight">
                  {score.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* Pill de Racha */}
            <div className="h-10 flex items-center gap-1.5 rounded-lg bg-orange-main border border-ink px-2.5 py-1 text-[10px] font-extrabold text-ink shadow-card">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black bg-white text-orange-main">
                <Flame className="h-3 w-3 fill-current" />
              </span>
              <span>RACHA {streakDays} de 7 días</span>
            </div>
          </div>

          {/* Tarjetas 2 y 3: Tiempo y Movimientos */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            {/* Tiempo */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-white border border-ink p-3.5 shadow-[0_1px_0px_#000000]">
              <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 border border-ink text-ink">
                <Clock className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                Tiempo
              </span>
              <span className="text-base font-extrabold text-ink">
                {formatTime(timeSeconds)}
              </span>
            </div>

            {/* Movimientos */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-white border border-ink p-3.5 shadow-[0_1px_0px_#000000]">
              <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 border border-ink text-ink">
                <RefreshCw className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                Movimientos
              </span>
              <span className="text-base font-extrabold text-ink">
                {moves}
              </span>
            </div>
          </div>

          {/* Tarjeta 4: Meta diaria */}
          <div className="mt-3 rounded-lg bg-white border border-ink px-4 py-3 text-left shadow-[0_1px_0px_#000000]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-emerald-600">
                +{score} pts sumados a tu meta diaria
              </span>
              <span className="text-ink/60">
                {dailyGoalPoints.toLocaleString('es-AR')} / {targetDailyGoal.toLocaleString('es-AR')} pts
              </span>
            </div>
            {/* Barra de progreso */}
            <div className="h-2.5 w-full rounded-full bg-[#f5efe0] border border-ink/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* ZONA INFERIOR: Fondo blanco con acciones */}
        <div className="bg-white px-6 py-5">
          {/* Bloque: Guardar progreso */}
          <div className="text-left">
            <span className="block text-[11px] font-medium uppercase tracking-wider text-ink/50 mb-2">
              Guardar tu progreso
            </span>

            {/* Google deshabilitado para MVP */}
            <button
              type="button"
              disabled
              title="Disponible en la próxima versión"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink/30 bg-neutral-200 px-4 py-2.5 text-xs sm:text-sm font-bold text-ink/40 cursor-not-allowed select-none"
            >
              <span className="font-extrabold text-base leading-none">G</span>
              <span>Iniciar sesión con Google (Próximamente)</span>
            </button>

            <button
              type="button"
              onClick={onSaveAsGuest}
              className="mt-2.5 w-full text-center text-xs sm:text-sm text-blue-main hover:underline cursor-pointer"
            >
              O guardá como invitado con un nombre aleatorio
            </button>
          </div>

          <hr className="my-4 border-ink/10" />

          {/* Bloque: Continuar */}
          <div className="text-left">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-ink/50 mb-2">
              Continuar
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onPlayAgain}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-ink bg-white px-3 py-2.5 text-xs sm:text-sm font-bold text-ink shadow-[0_1px_0px_#000000] transition hover:bg-neutral-50 active:translate-y-0.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Jugar de nuevo</span>
              </button>

              <button
                type="button"
                onClick={onNextChallenge}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-ink bg-white px-3 py-2.5 text-xs sm:text-sm font-bold text-ink shadow-[0_1px_0px_#000000] transition hover:bg-neutral-50 active:translate-y-0.5 cursor-pointer"
              >
                <span>Siguiente desafío</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Link inferior: Ver clasificación */}
          {onViewLeaderboard && (
            <button
              type="button"
              onClick={onViewLeaderboard}
              className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 cursor-pointer"
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Ver clasificación</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};