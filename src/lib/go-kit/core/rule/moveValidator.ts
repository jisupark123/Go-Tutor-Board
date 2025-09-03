import Board from '@/lib/go-kit/core/model/board';
import Move from '@/lib/go-kit/core/model/move';

export interface MoveValidator {
  isValidMove(board: Board, move: Move, boardHistory: readonly Board[]): boolean;
}
