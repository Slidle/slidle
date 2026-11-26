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
import { GuestWarningModal } from './components/GuestWarningModal';
import { VictoryModal } from './components/VictoryModal';
import type { TileState, GameStatus, PuzzleImage } from './types';
import { createInitialBoard, getSlidePath, isPuzzleSolved, shuffleBoard, getGridSize, getBlankId, calculateCompletionBonus, POINTS_PER_TILE } from './utils/puzzle';
import daily1 from './assets/Daily1.jpg';

const DEFAULT_IMAGE: PuzzleImage = {
  name: 'Tigre',
  url: daily1,
};

export default function App() {
  const [boardMode, setBoardMode] = useState<BoardMode>('4x4');
  const [tiles, setTiles] = useState<TileState[]>(() => createInitialBoard());
  const [status, setStatus] = useState<GameStatus>('idle');
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [scoredTileIds, setScoredTileIds] = useState<number[]>([]);

  // Estados visuales de partida activa y modales
  const [showStats, setShowStats] = useState(true);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isShuffleOpen, setIsShuffleOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [hasAcceptedGuest, setHasAcceptedGuest] = useState(false);
  const [hasStartedMoving, setHasStartedMoving] = useState(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    try {
      return localStorage.getItem('slidle_onboarding_completed') !== 'true';
    } catch {
      return true;
    }
  });

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (status === 'playing' && hasStartedMoving) {
      startTimeRef.current = Date.now();

      timerRef.current = window.setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsedMs = accumulatedTimeRef.current + (Date.now() - startTimeRef.current);
          setTimeSeconds(Math.floor(elapsedMs / 1000));
        }
      }, 250);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (startTimeRef.current !== null && hasStartedMoving && status === 'paused') {
        accumulatedTimeRef.current += Date.now() - startTimeRef.current;
      }
      startTimeRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, hasStartedMoving]);

  const handleStartChallenge = () => {
    const initialShuffled = shuffleBoard('medium', boardMode);
    setTiles(initialShuffled);
    setTimeSeconds(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
    setHasStartedMoving(false);
    setMoves(0);
    setScore(0);
    setScoredTileIds([]);
    setIsVictoryModalOpen(false);
    setStatus('playing');
  };

  const handleTileClick = useCallback(
    (clickedPos: number) => {
      if (status !== 'playing') return;

      const gridSize = getGridSize(boardMode);
      const blankId = getBlankId(boardMode);

      const blankTile = tiles.find((t) => t.isBlank || t.id === blankId);
      if (!blankTile) return;

      const blankPos = blankTile.currentPos;
      const path = getSlidePath(clickedPos, blankPos, gridSize);
      if (!path || path.length === 0) return;

      if (!hasStartedMoving) {
        setHasStartedMoving(true);
      }

      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const nextTiles = tiles.map((t) => ({ ...t }));
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

      setTiles(nextTiles);

      const pointsPerTile = POINTS_PER_TILE[boardMode];
      const newScoredIds: number[] = [];

      nextTiles.forEach((tile) => {
        if (!tile.isBlank && tile.currentPos === tile.originalPos) {
          if (!scoredTileIds.includes(tile.id)) {
            newScoredIds.push(tile.id);
          }
        }
      });

      const tilePointsEarned = newScoredIds.length * pointsPerTile;
      if (newScoredIds.length > 0) {
        setScoredTileIds((prevIds) => [...prevIds, ...newScoredIds]);
      }

      if (isPuzzleSolved(nextTiles)) {
        setStatus('won');
        setIsVictoryModalOpen(true);

        const finalElapsedMs =
          accumulatedTimeRef.current +
          (startTimeRef.current !== null ? Date.now() - startTimeRef.current : 0);
        const finalSeconds = Math.floor(finalElapsedMs / 1000);
        setTimeSeconds(finalSeconds);

        const finalBonus = calculateCompletionBonus(boardMode, finalSeconds, nextMoves);
        setScore((prevScore) => prevScore + tilePointsEarned + finalBonus);
      } else if (tilePointsEarned > 0) {
        setScore((prevScore) => prevScore + tilePointsEarned);
      }
    },
    [tiles, status, boardMode, moves, scoredTileIds, hasStartedMoving]
  );

  const handleDirectionMove = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (status !== 'playing') return;
      if (isReferenceOpen || isShuffleOpen || isOnboardingOpen || isGuestModalOpen || isVictoryModalOpen) return;

      const gridSize = getGridSize(boardMode);
      const blankId = getBlankId(boardMode);
      const blankTile = tiles.find((t) => t.isBlank || t.id === blankId);
      if (!blankTile) return;

      const blankRow = Math.floor(blankTile.currentPos / gridSize);
      const blankCol = blankTile.currentPos % gridSize;

      let targetRow = blankRow;
      let targetCol = blankCol;

      if (direction === 'up') targetRow = blankRow + 1;
      if (direction === 'down') targetRow = blankRow - 1;
      if (direction === 'left') targetCol = blankCol + 1;
      if (direction === 'right') targetCol = blankCol - 1;

      if (targetRow < 0 || targetRow >= gridSize || targetCol < 0 || targetCol >= gridSize) return;

      const targetPos = targetRow * gridSize + targetCol;
      handleTileClick(targetPos);
    },
    [
      status,
      boardMode,
      tiles,
      handleTileClick,
      isReferenceOpen,
      isShuffleOpen,
      isOnboardingOpen,
      isGuestModalOpen,
      isVictoryModalOpen,
    ]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') handleDirectionMove('up');
        if (e.key === 'ArrowDown') handleDirectionMove('down');
        if (e.key === 'ArrowLeft') handleDirectionMove('left');
        if (e.key === 'ArrowRight') handleDirectionMove('right');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [status, handleDirectionMove]);

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem('slidle_onboarding_completed', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleStartChallengeClick = () => {
    if (!hasAcceptedGuest) {
      setIsGuestModalOpen(true);
      return;
    }

    handleStartChallenge();
  };

  const handleConfirmGuest = () => {
    setHasAcceptedGuest(true);
    setIsGuestModalOpen(false);
    handleStartChallenge();
  };

  const handlePlayAgain = () => {
    handleStartChallenge();
  };

  const handleNextChallenge = () => {
    const nextMode = boardMode === '3x3' ? '4x4' : '3x3';
    setBoardMode(nextMode);
    const initialShuffled = shuffleBoard('medium', nextMode);
    setTiles(initialShuffled);
    setTimeSeconds(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
    setHasStartedMoving(false);
    setMoves(0);
    setScore(0);
    setScoredTileIds([]);
    setIsVictoryModalOpen(false);
    setStatus('playing');
  };

  const handleSaveAsGuest = () => {
    console.log('Guardar partida como invitado:', {
      boardMode,
      timeSeconds,
      moves,
      score,
    });
    alert('¡Puntaje guardado como invitado!');
  };

  return (
    <div className="min-h-screen bg-cream text-ink font-sans flex flex-col items-center py-3 px-3 sm:px-6">
      <div className="w-full max-w-300 flex flex-col gap-4">
        
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
              className="flex flex-col gap-4"
            >
              {/* Encabezado */}
              <header className="flex flex-col gap-0.5 text-left -my-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-ink m-0">
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
                  accumulatedTimeRef.current = 0;
                  startTimeRef.current = null;
                  setHasStartedMoving(false);
                  setMoves(0);
                  setStatus('idle');
                }}
                disabled={false}
              />

              {/* Grid: Vista previa y estadísticas */}
              <main className="grid grid-cols-1 lg:grid-cols-[1fr_355px] gap-3 items-stretch">
                <BoardPreviewCard
                  isStarted={false}
                  onStart={handleStartChallengeClick}
                >
                  <PuzzleBoard
                    tiles={tiles}
                    mode={boardMode}
                    currentImage={DEFAULT_IMAGE}
                    showNumbers={true}
                    status={status}
                    onTileClick={handleTileClick}
                    onResume={() => setStatus('playing')}
                    className="max-w-110"
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
                isGameOver={status === 'won'}
                onTogglePause={() =>
                  setStatus((s) => {
                    if (s === 'playing') return 'paused';
                    if (s === 'paused') return 'playing';
                    return s;
                  })
                }
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
                  onKeyDownMove={handleDirectionMove}
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

        <GuestWarningModal
          isOpen={isGuestModalOpen}
          onContinueAsGuest={handleConfirmGuest}
          onLoginWithGoogle={() => console.log('Login próximamente')}
          onClose={() => setIsGuestModalOpen(false)}
        />

        <VictoryModal
          isOpen={isVictoryModalOpen}
          onClose={() => setIsVictoryModalOpen(false)}
          boardMode={boardMode}
          score={score}
          timeSeconds={timeSeconds}
          moves={moves}
          streakDays={1}
          dailyGoalPoints={score}
          targetDailyGoal={2000}
          onSaveAsGuest={handleSaveAsGuest}
          onPlayAgain={handlePlayAgain}
          onNextChallenge={handleNextChallenge}
          onViewLeaderboard={() => console.log('Ver clasificación próximamente')}
        />
      </div>
    </div>
  );
}