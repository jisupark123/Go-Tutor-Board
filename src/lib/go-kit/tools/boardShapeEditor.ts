import type { DataObject } from '@/lib/core-ts/dataObject';
import type Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';

export type EditMode = 'ADD' | 'REMOVE';

type BoardShapeEditorProps = {
  board: Board;
  editMode: EditMode;
  stoneToPlace: Stone;
};

class BoardShapeEditor implements DataObject<BoardShapeEditor, BoardShapeEditorProps> {
  readonly board: Board;
  readonly editMode: EditMode;
  readonly stoneToPlace: Stone;

  constructor(board: Board, editMode: EditMode = 'ADD', stoneToPlace: Stone = Stone.BLACK) {
    this.board = board;
    this.editMode = editMode;
    this.stoneToPlace = stoneToPlace;
  }

  setEditMode(mode: EditMode) {
    return this.copy({ editMode: mode });
  }

  setStoneToPlace(stone: Stone): BoardShapeEditor {
    if (stone === Stone.EMPTY) throw new Error('Cannot set stone to place to EMPTY.');
    return this.copy({ stoneToPlace: stone });
  }

  leftClick(coordinate: Coordinate): BoardShapeEditor | null {
    if (this.editMode === 'ADD') {
      return this.addStone(new Move(coordinate.y, coordinate.x, this.stoneToPlace));
    } else {
      return this.removeStone(coordinate);
    }
  }

  rightClick(coordinate: Coordinate): BoardShapeEditor {
    return this.removeStone(coordinate);
  }

  reset(initialBoard: Board): BoardShapeEditor {
    return this.copy({ board: initialBoard });
  }

  private addStone(move: Move): BoardShapeEditor | null {
    if (move.stone === Stone.EMPTY) {
      throw new Error('Cannot add an empty stone.');
    }
    const { state } = this.board;
    if (state[move.y][move.x] !== Stone.EMPTY) return null;
    return this.copy({ board: this.board.setMove(move) });
  }

  private removeStone(coordinate: Coordinate): BoardShapeEditor {
    return this.copy({ board: this.board.setMove(new Move(coordinate.y, coordinate.x, Stone.EMPTY)) });
  }

  hashCode(): number {
    // TODO: hashcode implementation
    return 0;
  }

  equals(other: unknown): boolean {
    if (!(other instanceof BoardShapeEditor)) {
      return false;
    }
    return (
      this.board.equals(other.board) && this.editMode === other.editMode && this.stoneToPlace === other.stoneToPlace
    );
  }

  copy(props?: Partial<BoardShapeEditorProps> | undefined): BoardShapeEditor {
    return new BoardShapeEditor(
      props?.board ?? this.board,
      props?.editMode ?? this.editMode,
      props?.stoneToPlace ?? this.stoneToPlace,
    );
  }

  toString(): string {
    return `BoardShapeEditor(board: ${this.board.toString()}, editMode: ${this.editMode}, stoneToPlace: ${this.stoneToPlace})`;
  }
}

export default BoardShapeEditor;
