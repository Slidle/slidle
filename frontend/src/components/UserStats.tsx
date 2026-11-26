import React from 'react';
import { Clock, RefreshCw, Star, Flame } from 'lucide-react';
import { formatTime } from '../utils/puzzle';

interface UserStatsProps {
  timeSeconds: number;
  moves: number;
  score?: number;
  dailyGoalPoints?: number;
  targetDailyGoal?: number;
  streakDays?: number;
  isNewUser?: boolean;
}

export const UserStats: React.FC<UserStatsProps> = ({
  timeSeconds,
  moves,
  score = 0,
  dailyGoalPoints = 0,
  targetDailyGoal = 2000,
  streakDays = 0,
  isNewUser = true,
}) => {
  const goalPercentage = Math.min(100, Math.round((dailyGoalPoints / targetDailyGoal) * 100));
  const remainingPoints = Math.max(0, targetDailyGoal - dailyGoalPoints);

  return (
    <aside className="w-full bg-transparent border-0 shadow-none p-0 sm:bg-blanco sm:border sm:border-ink sm:rounded-modal sm:p-5 sm:shadow-card flex flex-col gap-3">
      <h2 className="text-base sm:text-xl font-bold sm:font-medium text-ink leading-tight">
        Tus estadísticas
      </h2>

      {/* Contenedor de las 3 métricas */}
      <div className="grid grid-cols-3 sm:flex sm:flex-col gap-2 sm:gap-3 pt-0.5">
        {/* 1. TIEMPO */}
        <div className="bg-cream border border-black rounded-card p-2 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-3 min-h-27.5 sm:min-h-0 sm:h-22 justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-ink bg-blanco flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-ink stroke-[2.2]" />
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0 overflow-hidden w-full">
            <span className="text-[10px] sm:text-[13px] tracking-wider uppercase text-ink/80 font-semibold leading-none">
              Tiempo
            </span>
            <span
              className={`text-base sm:text-[18px] tabular-nums leading-tight py-0.5 ${
                timeSeconds === 0 ? 'text-ink/75 font-bold' : 'text-ink font-extrabold'
              }`}
            >
              {isNewUser && timeSeconds === 0 ? '—' : formatTime(timeSeconds)}
            </span>
            <span className="text-[9px] sm:text-[11px] text-ink/80 font-semibold leading-tight line-clamp-2">
              {isNewUser ? 'Jugá tu primer desafío' : 'Mejor marca: 01:58'}
            </span>
          </div>
        </div>

        {/* 2. MOVIMIENTOS */}
        <div className="bg-cream border border-black rounded-card p-2 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-3 min-h-27.5 sm:min-h-0 sm:h-22 justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-ink bg-blanco flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-ink stroke-[2.2]" />
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0 overflow-hidden w-full">
            <span className="text-[10px] sm:text-[13px] tracking-wider uppercase text-ink/80 font-semibold leading-none">
              Movimientos
            </span>
            <span
              className={`text-base sm:text-[18px] tabular-nums leading-tight py-0.5 ${
                moves === 0 ? 'text-ink/75 font-bold' : 'text-ink font-extrabold'
              }`}
            >
              {isNewUser && moves === 0 ? '—' : moves}
            </span>
            <span className="text-[9px] sm:text-[11px] text-ink/80 font-semibold leading-tight line-clamp-2">
              {isNewUser ? 'Jugá tu primer desafío' : 'Mejor marca: 41 mov.'}
            </span>
          </div>
        </div>

        {/* 3. PUNTUACIÓN */}
        <div className="bg-cream border border-black rounded-card p-2 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-3 min-h-27.5 sm:min-h-0 sm:h-22 justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-ink bg-blanco flex items-center justify-center shrink-0">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-ink stroke-[2.2]" />
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0 overflow-hidden w-full">
            <span className="text-[10px] sm:text-[13px] tracking-wider uppercase text-ink/80 font-semibold leading-none">
              Puntuación
            </span>
            <span
              className={`text-base sm:text-[18px] tabular-nums leading-tight py-0.5 ${
                score === 0 ? 'text-ink/75 font-bold' : 'text-ink font-extrabold'
              }`}
            >
              {isNewUser && score === 0 ? '—' : score.toLocaleString('es-AR')}
            </span>
            <span className="text-[9px] sm:text-[11px] text-ink/80 font-semibold leading-tight line-clamp-2">
              {isNewUser ? 'Sin puntuación' : 'Mejor marca: 1.860 pts'}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-blue-soft my-0.5" />

      <div className="grid sm:flex sm:flex-col gap-2 sm:gap-3.5">
        {/* 4. META DEL DÍA */}
        <div className="w-full bg-cream border border-ink rounded-card p-3.5 sm:p-4 shadow-card flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-1 font-medium">
            <span className="text-ink font-bold text-sm sm:text-base">Meta del día</span>
            <span className="text-emerald-700 text-xs sm:text-sm font-extrabold tabular-nums">
              {dailyGoalPoints.toLocaleString('es-AR')} / {targetDailyGoal.toLocaleString('es-AR')} pts
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={dailyGoalPoints}
            aria-valuemin={0}
            aria-valuemax={targetDailyGoal}
            aria-label="Progreso de la meta diaria"
            className="w-full h-2.5 bg-blanco border border-ink rounded-full overflow-hidden p-px"
          >
            <div
              className="h-full bg-green-main rounded-full transition-all duration-300"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>

          <span className="text-[11px] sm:text-xs text-ink/80 font-semibold text-left">
            {dailyGoalPoints === 0
              ? '¡Empezá a sumar!'
              : `Te faltan ${remainingPoints.toLocaleString('es-AR')} puntos para cumplir la meta.`}
          </span>
        </div>

        {/* 5. TARJETA RACHA */}
        <div
          className={`w-full border border-ink rounded-card p-3.5 sm:px-5 sm:py-8 shadow-card flex items-center gap-3.5 transition-colors ${
            streakDays > 0 ? 'bg-orange-main text-ink' : 'bg-cream text-ink'
          }`}
        >
          <div className="w-10 h-10 rounded-full border border-ink bg-blanco flex items-center justify-center shrink-0">
            <Flame
              className={`w-5 h-5 ${
                streakDays > 0 ? 'text-orange-main fill-orange-main' : 'text-ink'
              }`}
            />
          </div>
          <div className="flex flex-col text-left justify-center gap-0.5 leading-tight">
            <span className="text-xs sm:text-[13px] tracking-wider uppercase text-ink/80 font-semibold">
              Racha
            </span>
            <span className="text-sm sm:text-[15px] font-extrabold text-ink leading-snug">
              {streakDays > 0 ? `${streakDays} días seguidos` : 'Jugá hoy para iniciar tu racha'}
            </span>
            {streakDays > 0 && (
              <span className="text-[11px] sm:text-xs font-semibold text-ink/90">
                Volvé mañana para no perderla
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};