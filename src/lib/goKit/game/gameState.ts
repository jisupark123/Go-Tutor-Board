import type Board from '@/lib/goKit/core/model/board';
import type Move from '@/lib/goKit/core/model/move';
import type { Stone } from '@/lib/goKit/core/model/stone';

export type GameState = {
  dimension: number;
  boardHistory: Board[];
  moveHistory: Move[];
  currentBoard: Board;
  currentMove: Move | null;
  currentTurn: Stone;
  komi: number;
  capturedByBlack: number;
  capturedByWhite: number;
};
