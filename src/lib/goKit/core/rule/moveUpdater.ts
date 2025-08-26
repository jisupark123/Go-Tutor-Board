import Board from '@/lib/goKit/core/model/board';
import Move from '@/lib/goKit/core/model/move';

export interface MoveUpdater {
  placeMove(board: Board, move: Move): Board;
}
