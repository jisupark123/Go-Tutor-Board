import Board from '@/lib/go-kit/core/model/board';
import Move from '@/lib/go-kit/core/model/move';
import Stone, { oppositeStone } from '@/lib/go-kit/core/model/stone';
import BoardRuleHelper from '@/lib/go-kit/core/rule/boardRuleHelper';
import type { MoveValidator } from '@/lib/go-kit/core/rule/moveValidator';

export class BasicMoveValidator implements MoveValidator {
  isValidMove(board: Board, move: Move, _boardHistory: readonly Board[]): boolean {
    const { dimension } = board;
    const { state } = board;
    const { y, x, stone } = move;

    // 수가 바둑판 크기를 벗어나면 에러 발생
    if (!(y >= 0 && y < dimension && x >= 0 && x < dimension)) {
      throw new Error(`Move out of bounds: (${y}, ${x}) for board of dimension ${dimension}`);
    }

    // 돌이 EMPTY이면 에러 발생
    if (stone === Stone.EMPTY) {
      throw new Error(`Move stone cannot be EMPTY`);
    }

    // 돌이 이미 놓여져 있는지 확인
    if (state[y][x] !== Stone.EMPTY) {
      return false;
    }

    // 돌을 놓았을 때 활로가 하나 이상 있다면 착수 가능
    if (BoardRuleHelper.libertyCount(board.setMove(move), move) > 0) {
      return true;
    }

    // 상대 돌을 따낼 수 있으면 착수 가능
    for (const coord of BoardRuleHelper.matchingAdjacentCoordinates(board, move, oppositeStone(stone))) {
      if (BoardRuleHelper.libertyCount(board, coord) === 1) return true;
    }

    return false;
  }
}

export default BasicMoveValidator;
