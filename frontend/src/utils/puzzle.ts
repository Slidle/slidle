import type { Difficulty, TileState } from '../types';

export type BoardMode = '3x3' | '4x4';

export function getGridSize(mode: BoardMode = '4x4'): number {
  return mode === '3x3' ? 3 : 4;
}

export function getTotalTiles(mode: BoardMode = '4x4'): number {
  const size = getGridSize(mode);
  return size * size;
}

export function getBlankId(mode: BoardMode = '4x4'): number {
  return getTotalTiles(mode) - 1; // 8 en 3x3, 15 en 4x4
}

// Valores por defecto (retrocompatibilidad)
export const GRID_SIZE = 4;
export const TOTAL_TILES = 16;
export const BLANK_ID = 15;

export function createInitialBoard(mode: BoardMode = '4x4'): TileState[] {
  const total = getTotalTiles(mode);
  const blankId = getBlankId(mode);
  const tiles: TileState[] = [];

  for (let i = 0; i < total; i++) {
    tiles.push({
      id: i,
      originalPos: i,
      currentPos: i,
      isBlank: i === blankId,
    });
  }
  return tiles;
}

export function getRowCol(index: number, gridSize: number = 4): { row: number; col: number } {
  return {
    row: Math.floor(index / gridSize),
    col: index % gridSize,
  };
}

export function getIndex(row: number, col: number, gridSize: number = 4): number {
  return row * gridSize + col;
}

export function getDirectNeighbors(pos: number, gridSize: number = 4): number[] {
  const { row, col } = getRowCol(pos, gridSize);
  const neighbors: number[] = [];

  if (row > 0) neighbors.push(getIndex(row - 1, col, gridSize));
  if (row < gridSize - 1) neighbors.push(getIndex(row + 1, col, gridSize));
  if (col > 0) neighbors.push(getIndex(row, col - 1, gridSize));
  if (col < gridSize - 1) neighbors.push(getIndex(row, col + 1, gridSize));

  return neighbors;
}

export function getSlidePath(clickedPos: number, blankPos: number, gridSize: number = 4): number[] | null {
  if (clickedPos === blankPos) return null;

  const clicked = getRowCol(clickedPos, gridSize);
  const blank = getRowCol(blankPos, gridSize);

  if (clicked.row === blank.row) {
    const path: number[] = [];
    if (clicked.col < blank.col) {
      for (let c = blank.col - 1; c >= clicked.col; c--) {
        path.push(getIndex(clicked.row, c, gridSize));
      }
    } else {
      for (let c = blank.col + 1; c <= clicked.col; c++) {
        path.push(getIndex(clicked.row, c, gridSize));
      }
    }
    return path;
  }

  if (clicked.col === blank.col) {
    const path: number[] = [];
    if (clicked.row < blank.row) {
      for (let r = blank.row - 1; r >= clicked.row; r--) {
        path.push(getIndex(r, clicked.col, gridSize));
      }
    } else {
      for (let r = blank.row + 1; r <= clicked.row; r++) {
        path.push(getIndex(r, clicked.col, gridSize));
      }
    }
    return path;
  }

  return null;
}

export function isPuzzleSolved(tiles: TileState[]): boolean {
  for (const tile of tiles) {
    if (tile.currentPos !== tile.originalPos) {
      return false;
    }
  }
  return true;
}

export const SHUFFLE_STEPS: Record<Difficulty, number> = {
  easy: 35,
  medium: 85,
  hard: 200,
  master: 320,
};

export function shuffleBoard(difficulty: Difficulty = 'medium', mode: BoardMode = '4x4'): TileState[] {
  const tiles = createInitialBoard(mode);
  const gridSize = getGridSize(mode);
  const blankId = getBlankId(mode);
  const steps = mode === '3x3' ? 30 : SHUFFLE_STEPS[difficulty];

  let currentBlankPos = blankId;
  let lastMovedPos = -1;

  for (let i = 0; i < steps; i++) {
    const neighbors = getDirectNeighbors(currentBlankPos, gridSize).filter((p) => p !== lastMovedPos);
    const chosenPos =
      neighbors.length > 0
        ? neighbors[Math.floor(Math.random() * neighbors.length)]
        : getDirectNeighbors(currentBlankPos, gridSize)[0];

    const blankTileIdx = tiles.findIndex((t) => t.currentPos === currentBlankPos);
    const chosenTileIdx = tiles.findIndex((t) => t.currentPos === chosenPos);

    tiles[blankTileIdx].currentPos = chosenPos;
    tiles[chosenTileIdx].currentPos = currentBlankPos;

    lastMovedPos = currentBlankPos;
    currentBlankPos = chosenPos;
  }

  if (isPuzzleSolved(tiles)) {
    const neighbors = getDirectNeighbors(currentBlankPos, gridSize);
    const chosenPos = neighbors[0];
    const blankTileIdx = tiles.findIndex((t) => t.currentPos === currentBlankPos);
    const chosenTileIdx = tiles.findIndex((t) => t.currentPos === chosenPos);

    tiles[blankTileIdx].currentPos = chosenPos;
    tiles[chosenTileIdx].currentPos = currentBlankPos;
  }

  return tiles;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const POINTS_PER_TILE: Record<BoardMode, number> = {
  '3x3': 100, 
  '4x4': 150, 
};

export function calculateCompletionBonus(
  mode: BoardMode,
  seconds: number,
  moves: number
): number {
  const is3x3 = mode === '3x3';

  // Base de bonus por completar
  const baseBonus = is3x3 ? 1200 : 2800;
  const timePenalty = is3x3 ? 2 : 3;
  const movePenalty = is3x3 ? 4 : 6;
  const minBonus = is3x3 ? 100 : 250;

  const totalDeductions = (seconds * timePenalty) + (moves * movePenalty);
  return Math.max(minBonus, baseBonus - totalDeductions);
}