import React from 'react';
import { Check, X } from 'lucide-react';
import logoSvg from '../assets/Logo.svg';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface GuestWarningModalProps {
  isOpen: boolean;
  onContinueAsGuest: () => void;
  onLoginWithGoogle?: () => void;
  onClose?: () => void;
}

export const GuestWarningModal: React.FC<GuestWarningModalProps> = ({
  isOpen,
  onContinueAsGuest,
  onClose,
}) => {
  const modalRef = useModalAccessibility(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-warning-title"
        tabIndex={-1}
        className="relative w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-xl bg-white p-4 sm:p-8 shadow-2xl border border-neutral-200 text-center focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar aviso de invitado"
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 bg-white text-ink/70 hover:bg-cream hover:text-ink transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Logo Slidle */}
        <div className="flex flex-col items-center justify-center mb-3 sm:mb-4">
          <img
            src={logoSvg}
            alt="Logo Slidle"
            className="h-8 sm:h-12 w-auto object-contain"
          />
        </div>

        {/* Título y subtítulo */}
        <h2
          id="guest-warning-title"
          className="text-lg sm:text-3xl font-bold text-ink tracking-tight"
        >
          Antes de continuar como invitado
        </h2>
        <p className="mt-1 text-xs sm:text-[18px] text-text font-medium">
          Esto es lo que cambia si jugás sin cuenta.
        </p>

        {/* Tarjetas informativas */}
        <div className="mt-4 sm:mt-6 flex flex-col gap-2.5 sm:gap-3 text-left">
          <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-cream px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-card">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-emerald-500 text-white">
              <Check className="h-3.5 w-3.5 stroke-3" />
            </span>
            <p className="text-xs sm:text-base font-semibold text-ink leading-snug">
              Podés jugar y ver tu propio puntaje
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-cream px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-card">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-amber-400 text-xs font-bold text-neutral-900">
              !
            </span>
            <p className="text-xs sm:text-base font-semibold text-ink leading-snug">
              Sin cuenta, no vas a poder ver el ranking global ni comparar tu puntaje con otros jugadores.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-cream px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-card">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-amber-400 text-xs font-bold text-neutral-900">
              !
            </span>
            <p className="text-xs sm:text-base font-semibold text-ink leading-snug">
              Tu historial y tu racha no se guardan si cerrás la app sin iniciar sesión.
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-5 sm:mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            disabled
            title="Disponible en la próxima versión"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink/30 bg-neutral-200 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-ink/40 cursor-not-allowed select-none"
          >
            <span className="font-extrabold text-base leading-none shrink-0">G</span>
            <span>Iniciar sesión con Google (Próximamente)</span>
          </button>

          <button
            type="button"
            onClick={onContinueAsGuest}
            className="w-full rounded-lg border border-ink bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-ink shadow-card transition hover:bg-neutral-50 active:translate-y-0.5 cursor-pointer"
          >
            Continuar como invitado
          </button>
        </div>
      </div>
    </div>
  );
};