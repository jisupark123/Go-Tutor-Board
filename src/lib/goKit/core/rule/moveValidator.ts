import Board from '@/lib/goKit/core/model/board';
import Move from '@/lib/goKit/core/model/move';

export interface MoveValidator {
  isValidMove(board: Board, move: Move, boardHistory: readonly Board[]): boolean;
}
