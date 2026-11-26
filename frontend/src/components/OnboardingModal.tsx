import React, { useState } from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import logoSvg from '../assets/Logo.svg';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: '¿Qué es Slidle Puzzle?',
    description:
      'Es un juego de puzzles deslizantes con fotografías reales de animales. Tu objetivo es reordenar las piezas hasta reconstruir la imagen completa.',
    buttonText: 'Siguiente',
    renderIcon: () => (
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-blue-main border-2 border-black p-2.5 sm:p-3 flex flex-col justify-between shadow-xs shrink-0">
        <div className="grid grid-cols-2 gap-1.5 h-full">
          <div className="bg-white rounded-md border border-black" />
          <div className="bg-white rounded-md border border-black" />
          <div className="bg-orange-main rounded-md border border-black" />
        </div>
      </div>
    ),
  },
  {
    title: '¿Cómo se juega?',
    description:
      'Movés las piezas haciendo clic, tocando la pantalla o con las flechas del teclado. Podés consultar la foto de referencia en cualquier momento, y cada pieza bien ubicada se resalta en verde con un check.',
    buttonText: 'Siguiente',
    renderIcon: () => (
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-blue-main border-2 border-black p-2.5 sm:p-3 flex flex-col justify-between shadow-xs shrink-0">
        <svg
          className="w-14 h-14 sm:w-17 sm:h-17 fill-cream stroke-black"
          viewBox="-1 0 24 25"
        >
          <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4c-1.1 0-2 .9-2 2v3.8h1.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5V22H17c1.1 0 2-.9 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z" />
        </svg>
      </div>
    ),
  },
  {
    title: 'Un desafío nuevo cada día',
    description:
      'Cada día vas a encontrar un desafío nuevo para resolver. Si jugás seguido, mantenés tu racha activa.',
    buttonText: 'Empezar a jugar',
    renderIcon: () => (
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-orange-main border-2 border-black p-2.5 sm:p-3 flex flex-col justify-between shadow-xs shrink-0">
        <Flame className="w-14 h-14 sm:w-17 sm:h-17 text-white fill-orange-main" />
      </div>
    ),
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const modalRef = useModalAccessibility(isOpen, handleClose);

  if (!isOpen) return null;

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-139.5 max-h-[90dvh] overflow-y-auto overscroll-contain bg-white border-2 border-black rounded-3xl p-4 sm:p-7 shadow-2xl flex flex-col items-center text-center relative transition-all focus:outline-none"
      >
        {/* Header superior: Logo a la izquierda, Omitir a la derecha */}
        <div className="w-full flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <img src={logoSvg} alt="Logo Slidle" className="h-9 sm:h-12 w-auto object-contain" />
          <button
            type="button"
            onClick={handleClose}
            className="text-sm sm:text-base text-text hover:text-ink font-medium transition cursor-pointer px-2 py-1 rounded-lg"
          >
            Omitir
          </button>
        </div>

        {/* Ícono central */}
        <div className="my-2 sm:my-3">{step.renderIcon()}</div>

        {/* Textos */}
        <h3
          id="onboarding-title"
          className="text-lg sm:text-[32px] font-bold text-black mb-2 tracking-tight leading-tight"
        >
          {step.title}
        </h3>
        <p className="text-xs sm:text-base text-text font-medium max-w-110 sm:min-h-13.5">
          {step.description}
        </p>

        {/* Indicadores de paginación */}
        <div className="flex items-center gap-1.5 my-4 sm:my-5" aria-hidden="true">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`transition-all duration-300 ${
                currentStep === idx
                  ? 'w-9 h-3 bg-blue-main rounded-full'
                  : 'w-3 h-3 rounded-full border border-black/40 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Botón principal */}
        <button
          type="button"
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-5 sm:px-6 bg-blue-main hover:bg-blue-main/90 text-white font-bold text-sm sm:text-base border border-black rounded-card shadow-card transition active:translate-y-0.5 cursor-pointer"
        >
          <span>{step.buttonText}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" />
        </button>
      </div>
    </div>
  );
};