import type { DataObject } from '@/lib/core-ts/dataObject';
import type Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone, { oppositeStone } from '@/lib/go-kit/core/model/stone';
import type { MoveProcessor } from '@/lib/go-kit/core/rule/moveProcessor';
import type { SequenceHistory } from '@/lib/go-kit/history/sequenceHistory';

export type TutorEditorPlaceMode = 'ONLY_BLACK' | 'ONLY_WHITE' | 'ALTERNATE';

type TutorEditorProps = {
  sequenceHistory: SequenceHistory;
  moveProcessor: MoveProcessor;
  placeMode: TutorEditorPlaceMode;
  currentTurn: Stone;
};

class TutorEditor implements DataObject<TutorEditor, TutorEditorProps> {
  private readonly sequenceHistory: SequenceHistory;
  private readonly moveProcessor: MoveProcessor;
  readonly currentTurn: Stone = Stone.BLACK;
  readonly placeMode: TutorEditorPlaceMode;

  constructor(
    sequenceHistory: SequenceHistory,
    moveProcessor: MoveProcessor,
    placeMode: TutorEditorPlaceMode = 'ONLY_BLACK',
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

  // // undo, redo 시 해당 시점으로 currentTurn 자동 업데이트
  private updateTurnByRedoHistory(): TutorEditor {
    if (!this.canRedo(1)) return this;

    const turn = this.sequenceHistory.redo(1).currentMove!.stone;
    return this.copy({ currentTurn: turn });
  }

  private updateTurnByPlaceMode(): TutorEditor {
    const turn = this.placeMode === 'ALTERNATE' ? oppositeStone(this.currentTurn) : this.currentTurn;
    return this.copy({ currentTurn: turn });
  }

  validateAndPlaceMove(coordinate: Coordinate): TutorEditor | null {
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

  setCurrentTurn(turn: Stone): TutorEditor {
    if (turn === Stone.EMPTY) throw new Error('Invalid turn');
    return this.copy({ currentTurn: turn });
  }

  setPlaceMode(mode: TutorEditorPlaceMode): TutorEditor {
    const nextCurrentTurn = mode === 'ONLY_WHITE' ? Stone.WHITE : Stone.BLACK;
    return this.copy({ placeMode: mode, currentTurn: nextCurrentTurn });
  }

  undo(steps: number): TutorEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.undo(steps) }).updateTurnByRedoHistory();
    // this._currentTurn = this.sequenceHistory.moveHistory[]
    // TODO: currentTurn 복구
  }

  redo(steps: number): TutorEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.redo(steps) }).updateTurnByRedoHistory();
  }

  undoAll(): TutorEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.undoAll() }).updateTurnByRedoHistory();
  }

  redoAll(): TutorEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.redoAll() });
  }

  canUndo(steps: number): boolean {
    return this.sequenceHistory.canUndo(steps);
  }

  canRedo(steps: number): boolean {
    return this.sequenceHistory.canRedo(steps);
  }

  reset(initialBoard: Board): TutorEditor {
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

  copy(props?: Partial<TutorEditorProps> | undefined): TutorEditor {
    return new TutorEditor(
      props?.sequenceHistory ?? this.sequenceHistory,
      props?.moveProcessor ?? this.moveProcessor,
      props?.placeMode ?? this.placeMode,
      props?.currentTurn ?? this.currentTurn,
    );
  }

  toString(): string {
    return `TutorEditor {
        currentTurn: ${this.currentTurn},
        placeMode: ${this.placeMode}
      }`;
  }
}

export default TutorEditor;
