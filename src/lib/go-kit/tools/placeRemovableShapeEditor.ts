import type { DataObject } from '@/lib/core-ts/dataObject';
import type Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone, { oppositeStone } from '@/lib/go-kit/core/model/stone';

export type EditMode = 'ONLY_BLACK' | 'ONLY_WHITE' | 'ALTERNATE' | 'REMOVE';

type PlaceRemovableShapeEditorProps = {
  board: Board;
  editMode: EditMode;
  stoneToPlace: Stone;
};

class PlaceRemovableShapeEditor implements DataObject<PlaceRemovableShapeEditor, PlaceRemovableShapeEditorProps> {
  readonly board: Board;
  readonly editMode: EditMode;
  readonly stoneToPlace: Stone;

  constructor(board: Board, editMode: EditMode = 'ONLY_BLACK', stoneToPlace: Stone = Stone.BLACK) {
    this.board = board;
    this.editMode = editMode;
    this.stoneToPlace = stoneToPlace;
  }

  setEditMode(mode: EditMode) {
    const nextStoneMapping: Record<EditMode, Stone> = {
      ONLY_BLACK: Stone.BLACK,
      ONLY_WHITE: Stone.WHITE,
      ALTERNATE: Stone.BLACK,
      REMOVE: this.stoneToPlace, // keep current stoneToPlace in REMOVE mode
    };
    const nextStone = nextStoneMapping[mode];
    return this.copy({ editMode: mode, stoneToPlace: nextStone });
  }

  setStoneToPlace(stone: Stone): PlaceRemovableShapeEditor {
    if (stone === Stone.EMPTY) throw new Error('Cannot set stone to place to EMPTY.');

    return this.copy({ stoneToPlace: stone });
  }

  leftClick(coordinate: Coordinate): PlaceRemovableShapeEditor | null {
    const { y, x } = coordinate;
    if (this.editMode === 'REMOVE') {
      return this.removeStone(coordinate);
    }
    const move = new Move(y, x, this.stoneToPlace);
    const newEditor = this.addStone(move);
    if (newEditor) {
      return newEditor.updateTurnByEditMode();
    } else {
      return null;
    }
  }

  rightClick(coordinate: Coordinate): PlaceRemovableShapeEditor {
    return this.removeStone(coordinate).updateTurnByEditMode();
  }

  reset(initialBoard: Board): PlaceRemovableShapeEditor {
    return this.copy({ board: initialBoard });
  }

  private updateTurnByEditMode(): PlaceRemovableShapeEditor {
    const turn = this.editMode === 'ALTERNATE' ? oppositeStone(this.stoneToPlace) : this.stoneToPlace;
    return this.copy({ stoneToPlace: turn });
  }

  private addStone(move: Move): PlaceRemovableShapeEditor | null {
    if (move.stone === Stone.EMPTY) {
      throw new Error('Cannot add an empty stone.');
    }
    const { state } = this.board;
    if (state[move.y][move.x] !== Stone.EMPTY) return null;
    return this.copy({ board: this.board.setMove(move) });
  }

  private removeStone(coordinate: Coordinate): PlaceRemovableShapeEditor {
    return this.copy({ board: this.board.setMove(new Move(coordinate.y, coordinate.x, Stone.EMPTY)) });
  }

  hashCode(): number {
    // TODO: hashcode implementation
    return 0;
  }

  equals(other: unknown): boolean {
    if (!(other instanceof PlaceRemovableShapeEditor)) {
      return false;
    }

    return (
      this.board.equals(other.board) && this.editMode === other.editMode && this.stoneToPlace === other.stoneToPlace
    );
  }

  copy(props?: Partial<PlaceRemovableShapeEditorProps> | undefined): PlaceRemovableShapeEditor {
    return new PlaceRemovableShapeEditor(
      props?.board ?? this.board,
      props?.editMode ?? this.editMode,
      props?.stoneToPlace ?? this.stoneToPlace,
    );
  }

  toString(): string {
    return `PlaceRemovableShapeEditor(board: ${this.board.toString()}, editMode: ${this.editMode}, stoneToPlace: ${this.stoneToPlace})`;
  }
}

export default PlaceRemovableShapeEditor;
