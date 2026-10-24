import React from 'react';
import { Play } from 'lucide-react';

interface BoardPreviewCardProps {
  children: React.ReactNode;
  isStarted: boolean;
  onStart: () => void;
}

export const BoardPreviewCard: React.FC<BoardPreviewCardProps> = ({
  children,
  isStarted,
  onStart,
}) => {
  return (
    <article className="w-full h-full bg-blanco border border-ink rounded-modal p-4 sm:p-6 shadow-card flex flex-col justify-between">
      {/* Encabezado interno con título y badge de estado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-ink leading-tight">
            Vista previa del tablero
          </h2>
          <p className="text-xs sm:text-sm font-normal text-ink/70">
            Ordena las piezas y completa la imagen
          </p>
        </div>

        {/* Badge: La partida aún no comenzó */}
        {!isStarted && (
          <div className="self-start sm:self-auto flex items-center gap-2 px-3 py-1 bg-cream border shadow-[-1px_1px_0px_0px_#000000] border-ink rounded-badge text-xs font-bold text-ink">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-main" />
            <span>La partida aún no comenzó</span>
          </div>
        )}
      </div>

      {/* Contenedor central del PuzzleBoard */}
      <div className="flex items-center justify-center my-auto py-2">
        {children}
      </div>

      {/* Pie de la tarjeta: aclaración y botón de inicio */}
      <div className="mt-5 pt-4 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="text-xs text-ink/60 font-semibold">
          Al comenzar, las piezas se mezclan y arranca el cronómetro.
        </p>

        {!isStarted && (
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-blue-main hover:bg-blue-main/90 text-white font-bold text-base sm:text-base border border-black rounded-card shadow-[0_1px_0px_#000000] transition active:translate-y-0.5 cursor-pointer"
          >
            <span>Comenzar desafío</span>
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-blue-main">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
          </button>
        )}
      </div>
    </article>
  );
};