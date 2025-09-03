import Board from '@/lib/go-kit/core/model/board';
import Move from '@/lib/go-kit/core/model/move';

export interface MoveProcessor {
  validateMove(board: Board, move: Move, boardHistory: readonly Board[]): boolean;

  validateMoveAndUpdate(board: Board, move: Move, boardHistory: readonly Board[]): Board | null;
}
