import React from 'react';
import { Eye } from 'lucide-react';
import type { PuzzleImage } from '../types';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: PuzzleImage;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({ isOpen, onClose, image }) => {
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
        aria-labelledby="reference-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-150 max-h-[90dvh] overflow-y-auto bg-blanco border-2 border-ink rounded-modal p-4 sm:p-5 shadow-2xl flex flex-col gap-3 focus:outline-none"
      >
        <div className="flex items-center gap-2 text-ink">
          <div className="w-8 h-8 rounded-full border border-ink bg-cream flex items-center justify-center shrink-0">
            <Eye className="w-4 h-4 text-ink" />
          </div>
          <h3 id="reference-modal-title" className="font-extrabold text-base sm:text-lg">
            Imagen de referencia
          </h3>
        </div>

        <div className="w-full rounded-card overflow-hidden border border-ink/30 flex items-center justify-center bg-cream/30">
          <img
            src={image.url}
            alt={image.name}
            className="w-auto max-h-[52dvh] sm:max-h-110 h-auto object-contain rounded-card"
          />
        </div>

        <div className="flex flex-col text-left">
          <h4 className="font-extrabold text-sm text-ink">{image.name}</h4>
          <p className="text-xs text-text">Así se ve la imagen completa cuando ordenas todas las piezas.</p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-ink rounded-xl font-bold text-xs sm:text-sm text-ink hover:bg-cream cursor-pointer shadow-card"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};