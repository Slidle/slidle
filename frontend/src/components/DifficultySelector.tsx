import React from 'react';

export type BoardMode = '3x3' | '4x4';

interface DifficultySelectorProps {
  selectedMode: BoardMode;
  onSelectMode: (mode: BoardMode) => void;
  disabled?: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedMode,
  onSelectMode,
  disabled = false,
}) => {
  return (
    <section className="w-full bg-blanco border border-ink rounded-modal p-4 sm:p-5 shadow-card">
      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-text block mb-3">
        Elegí tu desafío
      </span>

      {/* Siempre 2 columnas (misma fila), con gap ajustado */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Opción 3x3 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectMode('3x3')}
          className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-card border border-ink transition cursor-pointer text-left ${
            selectedMode === '3x3'
              ? 'bg-blue-main text-white shadow-card'
              : 'bg-blanco text-ink hover:bg-cream'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {/* Radio custom */}
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
              selectedMode === '3x3' ? 'border-white bg-white' : 'border-ink bg-white'
            }`}
          >
            {selectedMode === '3x3' && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-main" />
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-x-1.5 leading-tight">
            <span className="font-bold text-xs sm:text-base whitespace-nowrap">
              3x3 Principiante
            </span>
            <span
              className={`text-xs hidden sm:inline ${
                selectedMode === '3x3' ? 'text-white/80' : 'text-text'
              }`}
            >
              8 piezas - Ideal para empezar el día
            </span>
          </div>
        </button>

        {/* Opción 4x4 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectMode('4x4')}
          className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-card border border-ink transition cursor-pointer text-left ${
            selectedMode === '4x4'
              ? 'bg-blue-main text-white shadow-card'
              : 'bg-blanco text-ink hover:bg-cream'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {/* Radio custom */}
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
              selectedMode === '4x4' ? 'border-white bg-white' : 'border-ink bg-white'
            }`}
          >
            {selectedMode === '4x4' && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-main" />
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-x-1.5 leading-tight">
            <span className="font-bold text-xs sm:text-base whitespace-nowrap">
              4x4 Desafío
            </span>
            <span
              className={`text-xs hidden sm:inline ${
                selectedMode === '4x4' ? 'text-white/80' : 'text-text'
              }`}
            >
              15 piezas - Más puntos por completar
            </span>
          </div>
        </button>
      </div>
    </section>
  );
};