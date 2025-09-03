import Board from '@/lib/go-kit/core/model/board';
import Move from '@/lib/go-kit/core/model/move';

export interface MoveUpdater {
  placeMove(board: Board, move: Move): Board;
}
