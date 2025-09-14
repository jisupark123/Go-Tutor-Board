import type { DataObject } from '@/lib/core-ts/dataObject';
import type Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone, { oppositeStone } from '@/lib/go-kit/core/model/stone';
import type { MoveProcessor } from '@/lib/go-kit/core/rule/moveProcessor';
import type { SequenceHistory } from '@/lib/go-kit/history/sequenceHistory';

export type PlaceMode = 'ONLY_BLACK' | 'ONLY_WHITE' | 'ALTERNATE';

type PlaceModeSequenceEditorProps = {
  sequenceHistory: SequenceHistory;
  moveProcessor: MoveProcessor;
  placeMode: PlaceMode;
  currentTurn: Stone;
};

class PlaceModeSequenceEditor implements DataObject<PlaceModeSequenceEditor, PlaceModeSequenceEditorProps> {
  private readonly sequenceHistory: SequenceHistory;
  private readonly moveProcessor: MoveProcessor;
  readonly currentTurn: Stone = Stone.BLACK;
  readonly placeMode: PlaceMode;

  constructor(
    sequenceHistory: SequenceHistory,
    moveProcessor: MoveProcessor,
    placeMode: PlaceMode = 'ONLY_BLACK',
    currentTurn: Stone = Stone.BLACK,
  ) {
    this.sequenceHistory = sequenceHistory;
    this.moveProcessor = moveProcessor;
    this.placeMode = placeMode;
    this.currentTurn = currentTurn;
  }

  get currentBoard(): Board {
    return this.sequenceHistory.currentBoard;
  }

  get currentMove(): Move | null {
    return this.sequenceHistory.currentMove;
  }

  // undo, redo 시 해당 시점으로 currentTurn 자동 업데이트
  private updateTurnByRedoHistory(): PlaceModeSequenceEditor {
    if (!this.canRedo(1)) return this.updateTurnByPlaceMode();

    const turn = this.sequenceHistory.redo(1).currentMove!.stone;
    return this.copy({ currentTurn: turn });
  }

  private updateTurnByPlaceMode(): PlaceModeSequenceEditor {
    const turn = this.placeMode === 'ALTERNATE' ? oppositeStone(this.currentTurn) : this.currentTurn;
    return this.copy({ currentTurn: turn });
  }

  validateAndPlaceMove(coordinate: Coordinate): PlaceModeSequenceEditor | null {
    const { y, x } = coordinate;
    const move = new Move(y, x, this.currentTurn);
    const newBoard = this.moveProcessor.validateMoveAndUpdate(
      this.currentBoard,
      move,
      this.sequenceHistory.boardHistory,
    );
    if (!newBoard) return null;

    return this.copy({ sequenceHistory: this.sequenceHistory.record(newBoard, move) }).updateTurnByPlaceMode();
  }

  setCurrentTurn(turn: Stone): PlaceModeSequenceEditor {
    if (turn === Stone.EMPTY) throw new Error('Invalid turn');
    return this.copy({ currentTurn: turn });
  }

  setPlaceMode(mode: PlaceMode): PlaceModeSequenceEditor {
    let nextCurrentTurn: Stone;

    switch (mode) {
      case 'ONLY_BLACK':
        nextCurrentTurn = Stone.BLACK;
        break;
      case 'ONLY_WHITE':
        nextCurrentTurn = Stone.WHITE;
        break;
      case 'ALTERNATE':
        nextCurrentTurn = Stone.BLACK;
        break;
    }
    return this.copy({ placeMode: mode, currentTurn: nextCurrentTurn });
  }

  undo(steps: number): PlaceModeSequenceEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.undo(steps) }).updateTurnByRedoHistory();
  }

  redo(steps: number): PlaceModeSequenceEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.redo(steps) }).updateTurnByRedoHistory();
  }

  undoAll(): PlaceModeSequenceEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.undoAll() }).updateTurnByRedoHistory();
  }

  redoAll(): PlaceModeSequenceEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.redoAll() });
  }

  canUndo(steps: number): boolean {
    return this.sequenceHistory.canUndo(steps);
  }

  canRedo(steps: number): boolean {
    return this.sequenceHistory.canRedo(steps);
  }

  reset(initialBoard?: Board): PlaceModeSequenceEditor {
    return this.copy({
      sequenceHistory: this.sequenceHistory.reset(initialBoard),
      currentTurn: Stone.BLACK,
    });
  }

  hashCode(): number {
    return 0; // TODO: Implement a proper hash code calculation
  }

  equals(_other: unknown): boolean {
    return false; // TODO: Implement proper equality check
  }

  copy(props?: Partial<PlaceModeSequenceEditorProps> | undefined): PlaceModeSequenceEditor {
    return new PlaceModeSequenceEditor(
      props?.sequenceHistory ?? this.sequenceHistory,
      props?.moveProcessor ?? this.moveProcessor,
      props?.placeMode ?? this.placeMode,
      props?.currentTurn ?? this.currentTurn,
    );
  }

  toString(): string {
    return `PlaceModeSequenceEditor {
        currentTurn: ${this.currentTurn},
        placeMode: ${this.placeMode}
      }`;
  }
}

export default PlaceModeSequenceEditor;
