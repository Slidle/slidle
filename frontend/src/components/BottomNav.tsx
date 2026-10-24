import React from 'react';
import { Calendar, BarChart3, Trophy, Settings } from 'lucide-react';

interface BottomNavProps {
  isNewUser?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isNewUser = true }) => {
  return (
    <>
      {/* 1. Versión Desktop: Fila de 4 tarjetas dentro del flujo de la página */}
      <nav className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        {/* Desafíos anteriores */}
        <button
          type="button"
          className="bg-blanco border border-ink rounded-card p-4 shadow-card flex items-center gap-3.5 transition cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-full border border-ink bg-cream flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-ink stroke-2" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-ink leading-tight">
              Desafíos anteriores
            </span>
            <span className="text-xs text-text font-medium leading-tight mt-0.5">
              {isNewUser ? 'Aún no tienes desafíos' : 'Los últimos 30 días'}
            </span>
          </div>
        </button>

        {/* Estadísticas */}
        <button
          type="button"
          className="bg-blanco border border-ink rounded-card p-4 shadow-card flex items-center gap-3.5 transition cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-full border border-ink bg-cream flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-ink stroke-2" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-ink leading-tight">
              Estadísticas
            </span>
            <span className="text-xs text-text font-medium leading-tight mt-0.5">
              Tu evolución completa
            </span>
          </div>
        </button>

        {/* Logros */}
        <button
          type="button"
          className="bg-blanco border border-ink rounded-card p-4 shadow-card flex items-center gap-3.5 transition cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-full border border-ink bg-cream flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-ink stroke-2" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-ink leading-tight">
              Logros
            </span>
            <span className="text-xs text-text font-medium leading-tight mt-0.5">
              {isNewUser ? '0 de 30 desbloqueados' : '14 de 30 desbloqueados'}
            </span>
          </div>
        </button>

        {/* Ajustes */}
        <button
          type="button"
          className="bg-blanco border border-ink rounded-card p-4 shadow-card flex items-center gap-3.5 transition cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-full border border-ink bg-cream flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-ink stroke-2" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-ink leading-tight">
              Ajustes
            </span>
            <span className="text-xs text-text font-medium leading-tight mt-0.5">
              Sonido, tema y cuenta
            </span>
          </div>
        </button>
      </nav>

      {/* 2. Versión Mobile: Barra fija flotante en la parte inferior */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-blanco border-t border-ink px-4 py-2 flex items-center justify-around shadow-[-1px_-2px_0px_0px_#000000] rounded-t-xl">
        <button type="button" className="flex flex-col items-center gap-1 text-ink py-1">
          <Calendar className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold">Desafíos</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-ink py-1">
          <BarChart3 className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold">Estadísticas</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-ink py-1">
          <Trophy className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold">Logros</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-ink py-1">
          <Settings className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold">Ajustes</span>
        </button>
      </nav>
    </>
  );
};