import type { DataObject } from '@/lib/core-ts/dataObject';
import type Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';

type BoardShapeEditorProps = {
  board: Board;
};

class BoardShapeEditor implements DataObject<BoardShapeEditor, BoardShapeEditorProps> {
  readonly board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  addStone(move: Move): BoardShapeEditor | null {
    if (move.stone === Stone.EMPTY) {
      throw new Error('Cannot add an empty stone.');
    }
    const { state } = this.board;
    if (state[move.y][move.x] !== Stone.EMPTY) return null;
    return this.copy({ board: this.board.setMove(move) });
  }

  removeStone(coordinate: Coordinate): BoardShapeEditor {
    return this.copy({ board: this.board.setMove(new Move(coordinate.y, coordinate.x, Stone.EMPTY)) });
  }

  hashCode(): number {
    return this.board.hashCode();
  }

  equals(other: unknown): boolean {
    if (!(other instanceof BoardShapeEditor)) {
      return false;
    }
    return this.board.equals(other.board);
  }

  copy(props?: Partial<BoardShapeEditorProps> | undefined): BoardShapeEditor {
    return new BoardShapeEditor(props?.board ?? this.board);
  }

  toString(): string {
    return `BoardShapeEditor: ${this.board.toString()}`;
  }
}

export default BoardShapeEditor;
