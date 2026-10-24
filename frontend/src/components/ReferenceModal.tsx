import React from 'react';
import { Eye } from 'lucide-react';
import type { PuzzleImage } from '../types';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: PuzzleImage;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({ isOpen, onClose, image }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-blanco border-2 border-ink rounded-modal max-w-150 p-5 shadow-2xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-ink">
          <div className="w-8 h-8 rounded-full border border-ink bg-cream flex items-center justify-center">
            <Eye className="w-4 h-4 text-ink" />
          </div>
          <h3 className="font-extrabold text-base sm:text-lg">Imagen de referencia</h3>
        </div>

        <div className="w-full rounded-card overflow-hidden border border-ink/30 flex items-center justify-center">
          <img 
            src={image.url} 
            alt={image.name} 
            className="w-auto max-h-120 h-auto object-cover rounded-card" 
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
            className="px-4 py-2 border border-ink rounded-xl font-bold text-xs text-ink hover:bg-cream cursor-pointer shadow-card"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};