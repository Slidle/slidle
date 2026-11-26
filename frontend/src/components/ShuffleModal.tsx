import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface ShuffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ShuffleModal: React.FC<ShuffleModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const modalRef = useModalAccessibility(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shuffle-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-blanco border-2 border-black rounded-modal max-w-110 w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center gap-3 focus:outline-none"
      >
        <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-2 border-ink bg-orange-main flex items-center justify-center shrink-0">
          <RotateCcw className="w-6 h-6 text-ink stroke-[2.5]" />
        </div>

        <h3 id="shuffle-modal-title" className="font-bold text-xl sm:text-3xl text-black">
          ¿Barajar el puzzle?
        </h3>
        <p className="text-sm sm:text-base text-text">
          Tu partida actual, movimientos y cronómetro se reiniciarán con un nuevo tablero.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full justify-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-w-28 px-4 py-2 border border-ink rounded-xl font-bold text-sm sm:text-base shadow-card text-ink hover:bg-cream cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 min-w-28 px-4 py-2 bg-blue-main text-white border border-ink rounded-xl font-bold text-sm sm:text-base shadow-card hover:bg-blue-main/90 cursor-pointer"
          >
            Sí, barajar
          </button>
        </div>
      </div>
    </div>
  );
};