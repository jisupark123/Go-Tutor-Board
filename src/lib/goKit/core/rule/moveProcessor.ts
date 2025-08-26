import Board from '@/lib/goKit/core/model/board';
import Move from '@/lib/goKit/core/model/move';

export interface MoveProcessor {
  validateMove(board: Board, move: Move, boardHistory: readonly Board[]): boolean;

  validateMoveAndUpdate(board: Board, move: Move, boardHistory: readonly Board[]): Board | null;
}
