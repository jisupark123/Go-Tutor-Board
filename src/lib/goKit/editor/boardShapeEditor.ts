import type Board from '@/lib/goKit/core/model/board';
import type Coordinate from '@/lib/goKit/core/model/coordinate';
import Move from '@/lib/goKit/core/model/move';
import Stone from '@/lib/goKit/core/model/stone';

class BoardShapeEditor {
  private board: Board;

  constructor(initialBoard: Board) {
    this.board = initialBoard;
  }

  get result(): Board {
    return this.board;
  }

  addStone(coordinate: Coordinate, stone: Stone): boolean {
    const { y, x } = coordinate;

    if (this.board.get(y, x) !== Stone.EMPTY) {
      return false;
    }

    this.board = this.board.setMove(new Move(coordinate.y, coordinate.x, stone));
    return true;
  }

  removeStone(coordinate: Coordinate): void {
    this.board = this.board.setMove(new Move(coordinate.y, coordinate.x, Stone.EMPTY));
  }
}

export default BoardShapeEditor;
