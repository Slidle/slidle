export type Difficulty = 'easy' | 'medium' | 'hard' | 'master';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'won';

export interface TileState {
  id: number;
  originalPos: number;
  currentPos: number;
  isBlank: boolean;
}

export interface PuzzleImage {
  name: string;
  url: string;
}

export interface ScoreBreakdown {
  totalScore: number;
  baseScore: number;
  timeBonus: number;
  moveBonus: number;
  paceBonus: number;
  difficultyMultiplier: number;
}