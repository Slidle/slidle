import type { Difficulty, TileState } from '../types';

export const GRID_SIZE = 4;
export const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
export const BLANK_ID = 15;

export function createInitialBoard(): TileState[] {
  const tiles: TileState[] = [];
  for (let i = 0; i < TOTAL_TILES; i++) {
    tiles.push({
      id: i,
      originalPos: i,
      currentPos: i,
      isBlank: i === BLANK_ID,
    });
  }
  return tiles;
}

export function getRowCol(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  };
}

export function getIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

export function getDirectNeighbors(pos: number): number[] {
  const { row, col } = getRowCol(pos);
  const neighbors: number[] = [];

  if (row > 0) neighbors.push(getIndex(row - 1, col));
  if (row < GRID_SIZE - 1) neighbors.push(getIndex(row + 1, col));
  if (col > 0) neighbors.push(getIndex(row, col - 1));
  if (col < GRID_SIZE - 1) neighbors.push(getIndex(row, col + 1));

  return neighbors;
}

export function getSlidePath(clickedPos: number, blankPos: number): number[] | null {
  if (clickedPos === blankPos) return null;

  const clicked = getRowCol(clickedPos);
  const blank = getRowCol(blankPos);

  if (clicked.row === blank.row) {
    const path: number[] = [];
    if (clicked.col < blank.col) {
      for (let c = blank.col - 1; c >= clicked.col; c--) {
        path.push(getIndex(clicked.row, c));
      }
    } else {
      for (let c = blank.col + 1; c <= clicked.col; c++) {
        path.push(getIndex(clicked.row, c));
      }
    }
    return path;
  }

  if (clicked.col === blank.col) {
    const path: number[] = [];
    if (clicked.row < blank.row) {
      for (let r = blank.row - 1; r >= clicked.row; r--) {
        path.push(getIndex(r, clicked.col));
      }
    } else {
      for (let r = blank.row + 1; r <= clicked.row; r++) {
        path.push(getIndex(r, clicked.col));
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

export function shuffleBoard(difficulty: Difficulty): TileState[] {
  const tiles = createInitialBoard();
  const steps = SHUFFLE_STEPS[difficulty];

  let currentBlankPos = BLANK_ID;
  let lastMovedPos = -1;

  for (let i = 0; i < steps; i++) {
    const neighbors = getDirectNeighbors(currentBlankPos).filter(p => p !== lastMovedPos);
    const chosenPos = neighbors.length > 0
      ? neighbors[Math.floor(Math.random() * neighbors.length)]
      : getDirectNeighbors(currentBlankPos)[0];

    const blankTileIdx = tiles.findIndex(t => t.currentPos === currentBlankPos);
    const chosenTileIdx = tiles.findIndex(t => t.currentPos === chosenPos);

    tiles[blankTileIdx].currentPos = chosenPos;
    tiles[chosenTileIdx].currentPos = currentBlankPos;

    lastMovedPos = currentBlankPos;
    currentBlankPos = chosenPos;
  }

  if (isPuzzleSolved(tiles)) {
    const neighbors = getDirectNeighbors(currentBlankPos);
    const chosenPos = neighbors[0];
    const blankTileIdx = tiles.findIndex(t => t.currentPos === currentBlankPos);
    const chosenTileIdx = tiles.findIndex(t => t.currentPos === chosenPos);

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