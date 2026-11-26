import React from 'react';
import { Calendar, BarChart3, Trophy, Settings } from 'lucide-react';

interface BottomNavProps {
  isNewUser?: boolean;
}

const NAV_ITEMS = [
  {
    id: 'past-challenges',
    desktopTitle: 'Desafíos anteriores',
    mobileTitle: 'Desafíos',
    getSubtitle: (isNewUser: boolean) =>
      isNewUser ? 'Aún no tienes desafíos' : 'Los últimos 30 días',
    Icon: Calendar,
  },
  {
    id: 'stats',
    desktopTitle: 'Estadísticas',
    mobileTitle: 'Estadísticas',
    getSubtitle: () => 'Tu evolución completa',
    Icon: BarChart3,
  },
  {
    id: 'achievements',
    desktopTitle: 'Logros',
    mobileTitle: 'Logros',
    getSubtitle: (isNewUser: boolean) =>
      isNewUser ? '0 de 30 desbloqueados' : '14 de 30 desbloqueados',
    Icon: Trophy,
  },
  {
    id: 'settings',
    desktopTitle: 'Ajustes',
    mobileTitle: 'Ajustes',
    getSubtitle: () => 'Sonido, tema y cuenta',
    Icon: Settings,
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({ isNewUser = true }) => {
  return (
    <>
      {/* Versión Desktop */}
      <nav
        aria-label="Secciones adicionales"
        className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-3 w-full"
      >
        {NAV_ITEMS.map(({ id, desktopTitle, getSubtitle, Icon }) => (
          <button
            key={id}
            type="button"
            disabled
            aria-disabled="true"
            title="Disponible en la próxima versión"
            className="bg-blanco/80 border border-ink/40 rounded-card p-4 shadow-card flex items-center gap-3.5 text-left opacity-75 cursor-not-allowed select-none"
          >
            <div className="w-10 h-10 rounded-full border border-ink/50 bg-cream flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-ink/70 stroke-2" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-ink leading-tight">
                  {desktopTitle}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-cream border border-ink/20 text-ink/75">
                  Pronto
                </span>
              </div>
              <span className="text-xs text-ink/75 font-medium leading-tight mt-0.5">
                {getSubtitle(isNewUser)}
              </span>
            </div>
          </button>
        ))}
      </nav>

      {/* Versión Mobile */}
      <nav
        aria-label="Navegación móvil"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-blanco border-t border-ink px-4 py-2 flex items-center justify-around shadow-[-1px_-2px_0px_0px_#000000] rounded-t-xl"
      >
        {NAV_ITEMS.map(({ id, mobileTitle, Icon }) => (
          <button
            key={id}
            type="button"
            disabled
            aria-disabled="true"
            aria-label={`${mobileTitle} (disponible próximamente)`}
            title="Disponible en la próxima versión"
            className="flex flex-col items-center gap-1 text-ink/60 py-1 cursor-not-allowed select-none"
          >
            <Icon className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-bold">{mobileTitle}</span>
          </button>
        ))}
      </nav>
    </>
  );
};