import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ShuffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ShuffleModal: React.FC<ShuffleModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-blanco border-2 border-black rounded-modal max-w-110 w-full max-h-77 p-6 shadow-2xl flex flex-col items-center text-center gap-3">
        <div className="w-15 h-15 rounded-full border-2 border-ink bg-orange-main flex items-center justify-center">
          <RotateCcw className="w-6 h-6 text-ink stroke-[2.5]" />
        </div>

        <h3 className="font-bold text-lg sm:text-3xl text-black">¿Barajar el puzzle?</h3>
        <p className="text-base text-text">
          Tu partida actual, movimientos y cronómetro se reiniciarán con un nuevo tablero.
        </p>

        <div className="flex items-center gap-3 w-full justify-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-ink rounded-xl font-bold text-base shadow-card text-ink hover:bg-cream cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 bg-blue-main text-white border border-ink rounded-xl font-bold text-base shadow-card hover:bg-blue-main/90 cursor-pointer"
          >
            Sí, barajar
          </button>
        </div>
      </div>
    </div>
  );
};