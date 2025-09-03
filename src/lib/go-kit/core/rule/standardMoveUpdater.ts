import Board from '@/lib/go-kit/core/model/board';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone, { oppositeStone } from '@/lib/go-kit/core/model/stone';
import BoardRuleHelper from '@/lib/go-kit/core/rule/boardRuleHelper';
import type { MoveUpdater } from '@/lib/go-kit/core/rule/moveUpdater';

class StandardMoveUpdater implements MoveUpdater {
  placeMove(board: Board, move: Move): Board {
    const { dimension } = board;
    const { y, x, stone } = move;

    // 수가 바둑판 크기를 벗어나지 않는지 확인
    if (!(y >= 0 && y < dimension && x >= 0 && x < dimension)) {
      throw new Error(`Move out of bounds: (${y}, ${x}) for board of dimension ${dimension}`);
    }

    // 돌이 이미 놓여져 있는지 확인
    if (board.state[y][x] !== Stone.EMPTY) {
      throw new Error(`Cannot place stone at (${y}, ${x}): position already occupied`);
    }

    // 돌이 EMPTY이면 에러 발생
    if (stone === Stone.EMPTY) {
      throw new Error(`Move stone cannot be EMPTY`);
    }

    // 따낼 돌
    const capturedStones: Set<Coordinate> = new Set(
      [...BoardRuleHelper.matchingAdjacentCoordinates(board, move, oppositeStone(stone))]
        .filter((coord) => BoardRuleHelper.libertyCount(board, coord) === 1)
        .flatMap((coord) => [...BoardRuleHelper.stoneChain(board, coord)]),
    );

    // 돌을 놓은 후 잡은 돌들을 모두 제거한 새로운 Board를 반환
    return board.setMove(move).setMoves([...capturedStones].map((coord) => new Move(coord.y, coord.x, Stone.EMPTY)));
  }
}

export default StandardMoveUpdater;
