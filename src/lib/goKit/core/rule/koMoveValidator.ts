import Board from '@/lib/goKit/core/model/board';
import Move from '@/lib/goKit/core/model/move';
import Stone from '@/lib/goKit/core/model/stone';
import type { MoveUpdater } from '@/lib/goKit/core/rule/moveUpdater';
import type { MoveValidator } from '@/lib/goKit/core/rule/moveValidator';
import StandardMoveUpdater from '@/lib/goKit/core/rule/standardMoveUpdater';

class KoMoveValidator implements MoveValidator {
  private readonly moveUpdater: MoveUpdater;

  constructor(moveUpdater?: MoveUpdater) {
    this.moveUpdater = moveUpdater ?? new StandardMoveUpdater();
  }

  isValidMove(board: Board, move: Move, boardHistory: Board[]): boolean {
    const { dimension } = board;
    const { y, x, stone } = move;

    // 수가 바둑판 크기를 벗어나면 에러 발생
    if (!(y >= 0 && y < dimension && x >= 0 && x < dimension)) {
      throw new Error(`Move out of bounds: (${y}, ${x}) for board of dimension ${dimension}`);
    }

    // 돌이 EMPTY이면 에러 발생
    if (stone === Stone.EMPTY) {
      throw new Error(`Move stone cannot be EMPTY`);
    }

    if (boardHistory.length < 2) return true;

    const previousBoard = boardHistory[boardHistory.length - 2];
    const nextBoard = this.moveUpdater.placeMove(board, move);
    return !nextBoard.equals(previousBoard);
  }
}

export default KoMoveValidator;
