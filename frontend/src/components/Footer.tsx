import React from 'react';

interface FooterProps {
  onOpenHowToPlay?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHowToPlay }) => {
  return (
    <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text font-medium pt-4 pb-2 border-t border-ink/10">
      <p className="text-center sm:text-left">
        © 2026 Slidle puzzle · Fotografías de animales
      </p>

      <ul className="flex items-center gap-4 text-blue-main font-semibold flex-wrap justify-center">
        <li>
          <button
            type="button"
            onClick={onOpenHowToPlay}
            className="hover:underline cursor-pointer bg-transparent border-0 p-0 text-blue-main font-semibold text-xs font-sans"
          >
            Cómo se juega
          </button>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Privacidad
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Términos
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Contacto
          </a>
        </li>
      </ul>
    </footer>
  );
};