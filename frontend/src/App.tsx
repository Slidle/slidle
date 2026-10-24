import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { DifficultySelector } from './components/DifficultySelector';
import type { BoardMode } from './components/DifficultySelector';
import { BoardPreviewCard } from './components/BoardPreviewCard';
import { UserStats } from './components/UserStats';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { PuzzleBoard } from './components/PuzzleBoard';
import { ActiveGameControls } from './components/ActiveGameControls';
import { ReferenceModal } from './components/ReferenceModal';
import { ShuffleModal } from './components/ShuffleModal';
import { OnboardingModal } from './components/OnboardingModal';
import type { TileState, GameStatus, PuzzleImage } from './types';
import { createInitialBoard, getSlidePath, isPuzzleSolved, shuffleBoard, getGridSize, getBlankId, calculateCompletionBonus, POINTS_PER_TILE } from './utils/puzzle';


const DEFAULT_IMAGE: PuzzleImage = {
  name: 'Retrato de gatito',
  url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4fM4fYVmrffNBcw1-R-z7wOFeoM5TuULOBOzirHzJP-xdR5fygFvjH-c&s=10',
};

export default function App() {
  const [boardMode, setBoardMode] = useState<BoardMode>('4x4');
  const [tiles, setTiles] = useState<TileState[]>(() => createInitialBoard());
  const [status, setStatus] = useState<GameStatus>('idle');
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [scoredTileIds, setScoredTileIds] = useState<number[]>([]);

  // Estados visuales de partida activa
  const [showStats, setShowStats] = useState(true);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isShuffleOpen, setIsShuffleOpen] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = window.setInterval(() => {
        setTimeSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Iniciar partida desde el botón "Comenzar desafío"
  const handleStartChallenge = () => {
    const initialShuffled = shuffleBoard('medium', boardMode);
    setTiles(initialShuffled);
    setTimeSeconds(0);
    setMoves(0);
    setScore(0);
    setScoredTileIds([]); // Resetea las piezas puntuadas
    setStatus('playing');
  };

  const handleTileClick = useCallback(
    (clickedPos: number) => {
      // Si la partida no está en curso (por ejemplo, sigue en 'idle' o está 'paused'), bloquea el clic
      if (status !== 'playing') return;

      const gridSize = getGridSize(boardMode);
      const blankId = getBlankId(boardMode);

      const blankTile = tiles.find((t) => t.isBlank || t.id === blankId);
      if (!blankTile) return;

      const blankPos = blankTile.currentPos;
      const path = getSlidePath(clickedPos, blankPos, gridSize);
      if (!path || path.length === 0) return;

      // Incrementa movimientos
      setMoves((prev) => prev + 1);

      setTiles((prev) => {
        const nextTiles = prev.map((t) => ({ ...t }));
        let currentEmpty = blankPos;

        for (const movePos of path) {
          const tileIndex = nextTiles.findIndex((t) => t.currentPos === movePos);
          const blankIndex = nextTiles.findIndex((t) => t.currentPos === currentEmpty);

          if (tileIndex !== -1 && blankIndex !== -1) {
            nextTiles[tileIndex].currentPos = currentEmpty;
            nextTiles[blankIndex].currentPos = movePos;
            currentEmpty = movePos;
          }
        }

        // Identificar fichas que están bien ubicadas y que NO habían sumado antes
        const pointsPerTile = POINTS_PER_TILE[boardMode];
        const newScoredIds: number[] = [];

        nextTiles.forEach((tile) => {
          if (!tile.isBlank && tile.currentPos === tile.originalPos) {
            if (!scoredTileIds.includes(tile.id)) {
              newScoredIds.push(tile.id);
            }
          }
        });

        if (newScoredIds.length > 0) {
          setScoredTileIds((prevIds) => [...prevIds, ...newScoredIds]);
          setScore((prevScore) => prevScore + newScoredIds.length * pointsPerTile);
        }

        // Si se completó el tablero, sumamos el bonus final
        if (isPuzzleSolved(nextTiles)) {
          setStatus('won');
          const finalBonus = calculateCompletionBonus(boardMode, timeSeconds, moves + 1);
          setScore((prevScore) => prevScore + (newScoredIds.length * pointsPerTile) + finalBonus);
        }

        return nextTiles;
      });
    },
    [tiles, status, boardMode, moves, scoredTileIds, timeSeconds]
  );

    const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    try {
      return localStorage.getItem('slidle_onboarding_completed') !== 'true';
    } catch {
      return true;
    }
  });

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem('slidle_onboarding_completed', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink font-sans flex flex-col items-center py-4 sm:py-6 px-3 sm:px-6">
      <div className="w-full max-w-310 flex flex-col gap-5 sm:gap-6 pb-16 sm:pb-0">
        
        {/* Navbar adaptativa según status */}
        <Navbar
          status={status}
          boardMode={boardMode}
          userLevel={null}
          userName="Invitado"
          userInitials="I"
        />

        {/* Transición suave entre pantalla de inicio y pantalla de juego activo */}
        <AnimatePresence mode="wait">
          {status === 'idle' ? (
            <motion.div
              key="idle-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              {/* Encabezado */}
              <header className="flex flex-col gap-0.5 text-left -my-1">
                <h1 className="text-2xl sm:text-[34px] font-extrabold tracking-tight leading-tight text-ink m-0">
                  ¿Listo para tu desafío de hoy?
                </h1>
                <p className="text-sm sm:text-base font-normal text-text m-0">
                  Ordena las piezas y completa la imagen
                </p>
              </header>

              {/* Selector de modo */}
              <DifficultySelector
                selectedMode={boardMode}
                onSelectMode={(mode) => {
                  setBoardMode(mode);
                  setTiles(createInitialBoard(mode));
                  setTimeSeconds(0);
                  setMoves(0);
                  setStatus('idle');
                }}
                disabled={false}
              />

              {/* Grid: Vista previa y estadísticas */}
              <main className="grid grid-cols-1 lg:grid-cols-[1fr_335px] gap-6 items-stretch">
                <BoardPreviewCard
                  isStarted={false}
                  onStart={handleStartChallenge}
                >
                  <PuzzleBoard
                    tiles={tiles}
                    mode={boardMode} // <--- AGREGÁ ESTA LÍNEA ACÁ
                    currentImage={DEFAULT_IMAGE}
                    showNumbers={true}
                    status={status}
                    onTileClick={handleTileClick}
                    onResume={() => setStatus('playing')}
                    className="max-w-120"
                  />
                </BoardPreviewCard>

                <UserStats
                  timeSeconds={timeSeconds}
                  moves={moves}
                  score={0}
                  dailyGoalPoints={0}
                  targetDailyGoal={2000}
                  streakDays={0}
                  isNewUser={true}
                />
              </main>

              <BottomNav isNewUser={true} />
            </motion.div>
          ) : (
            <motion.div
              key="active-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <ActiveGameControls
                timeSeconds={timeSeconds}
                moves={moves}
                score={score}
                isPaused={status === 'paused'}
                onTogglePause={() => setStatus((s) => (s === 'playing' ? 'paused' : 'playing'))}
                showStats={showStats}
                onToggleStats={() => setShowStats((s) => !s)}
                onShuffleRequest={() => setIsShuffleOpen(true)}
                onOpenReference={() => setIsReferenceOpen(true)}
              >
                <PuzzleBoard
                  tiles={tiles}
                  mode={boardMode}
                  currentImage={DEFAULT_IMAGE}
                  showNumbers={true}
                  status={status}
                  onTileClick={handleTileClick}
                  onResume={() => setStatus('playing')}
                  className="w-full" 
                />
              </ActiveGameControls>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer onOpenHowToPlay={() => setIsOnboardingOpen(true)} />

        {/* Modales */}
        <ReferenceModal
          isOpen={isReferenceOpen}
          onClose={() => setIsReferenceOpen(false)}
          image={DEFAULT_IMAGE}
        />

        <ShuffleModal
          isOpen={isShuffleOpen}
          onClose={() => setIsShuffleOpen(false)}
          onConfirm={handleStartChallenge}
        />

        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={handleCloseOnboarding}
        />

      </div>
    </div>
  );
}