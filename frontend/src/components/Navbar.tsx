import React from 'react';
import { ChevronDown } from 'lucide-react';
import logoSvg from '../assets/Logo.svg';
import type { GameStatus } from '../types';
import type { BoardMode } from './DifficultySelector';

interface NavbarProps {
  status?: GameStatus;
  boardMode?: BoardMode;
  userLevel?: string | number | null;
  userName?: string;
  userInitials?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  status = 'idle',
  boardMode = '4x4',
  userLevel = null,
  userName = 'María C.',
  userInitials = 'MC',
}) => {
  const isGameActive = status === 'playing' || status === 'paused';

  return (
    <header className="w-full bg-blanco border border-ink rounded-xl px-3 sm:px-6 py-2 sm:py-3 shadow-card flex items-center justify-between gap-2 sm:gap-4 transition-all">
      {/* 1. Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="https://slidle.github.io/slidle/"
          className="inline-flex items-center shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <img
            src={logoSvg}
            alt="Logo Slidle"
            className="h-6 sm:h-9 w-auto object-contain"
          />
        </a>

        {/* Claim secundario visible solo en desktop */}
        <div className="hidden md:flex items-center gap-3 pl-3 border-l-2 border-ink/10">
          <span className="text-xs font-semibold text-ink/70">
            Un nuevo desafío cada día
          </span>
        </div>
      </div>

      {/* 2. Badges de la derecha */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* --- CASO A: JUEGO ACTIVO O PAUSADO --- */}
        {isGameActive ? (
          <>
            {/* Pastilla azul: Desafío activo */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-3 bg-blue-main text-white border border-ink rounded-badge text-[8px] sm:text-xs font-medium shadow-xs whitespace-nowrap">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white shrink-0" />
              <span>
                <span>Desafío activo: </span>
                {boardMode}
              </span>
            </div>

            {/* Pastilla de Estado: Partida en curso / Partida pausada */}
            <div
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-3 border border-ink rounded-badge text-[8px] sm:text-xs font-bold transition-colors whitespace-nowrap ${
                status === 'paused'
                  ? 'bg-orange-main text-ink'
                  : 'bg-cream text-ink'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
                  status === 'paused' ? 'bg-cream' : 'bg-green-main'
                }`}
              />
              <span>
                {status === 'paused' ? 'Partida Pausada' : 'Partida En curso'}
                <span className="sm:inline hidden">
                  {status === 'paused' ? '' : ''}
                </span>
              </span>
            </div>
          </>
        ) : (
          /* --- CASO B: VISTA INICIAL (IDLE) --- */
          <>
            {/* Pastilla central: Desafío diario */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-cream border border-ink rounded-badge text-[8px] sm:text-xs font-bold text-ink whitespace-nowrap">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-main shrink-0" />
              <span>Desafío diario</span>
              <span className="text-ink/30 font-normal">|</span>
              <span className="text-ink/80 font-semibold hidden sm:inline">
                Sábado, 5 de septiembre
              </span>
              <span className="text-ink/80 font-semibold sm:hidden">
                Sáb, 5 de sep.
              </span>
            </div>
          </>
          
        )}

        {/* Pastilla de Usuario */}
            <button
              type="button"
              className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1 sm:pr-2.5 sm:py-1 bg-blanco border shadow-[-1px_1px_0px_0px_#000000] rounded-xl transition cursor-pointer shrink-0"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-ink bg-orange-main flex items-center justify-center text-[10px] sm:text-xs font-extrabold text-ink shrink-0">
                {userInitials}
              </div>

              <div className="hidden sm:flex flex-col text-left leading-none pr-0.5 whitespace-nowrap">
                <span className="text-sm font-bold text-ink leading-tight">
                  {userName}
                </span>
                <span className="text-[10px] text-text font-semibold leading-tight mt-0.5">
                  {userLevel ? `Nivel ${userLevel}` : '—'}
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ink stroke-[2.5] shrink-0 mr-1 sm:mr-0" />
            </button>
      </div>
    </header>
  );
};