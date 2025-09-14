import type { DataObject } from '@/lib/core-ts/dataObject';
import type Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone, { oppositeStone } from '@/lib/go-kit/core/model/stone';
import type { MoveProcessor } from '@/lib/go-kit/core/rule/moveProcessor';
import type { SequenceHistory } from '@/lib/go-kit/history/sequenceHistory';

type MoveSequenceEditorProps = {
  sequenceHistory: SequenceHistory;
  moveProcessor: MoveProcessor;
  initialTurn: Stone;
};

class MoveSequenceEditor implements DataObject<MoveSequenceEditor, MoveSequenceEditorProps> {
  private sequenceHistory: SequenceHistory;
  private moveProcessor: MoveProcessor;
  private initialTurn: Stone;

  constructor(sequenceHistory: SequenceHistory, moveProcessor: MoveProcessor, initialTurn: Stone = Stone.BLACK) {
    this.sequenceHistory = sequenceHistory;
    this.moveProcessor = moveProcessor;
    this.initialTurn = initialTurn;
  }

  get currentBoard(): Board {
    return this.sequenceHistory.currentBoard;
  }

  get currentMove(): Move | null {
    return this.sequenceHistory.currentMove;
  }

  get currentTurn(): Stone {
    return this.currentMove?.stone ? oppositeStone(this.currentMove.stone) : this.initialTurn;
  }

  validateAndPlaceMove(coordinate: Coordinate): MoveSequenceEditor | null {
    const { y, x } = coordinate;
    const newMove = new Move(y, x, this.currentTurn);
    const newBoard = this.moveProcessor.validateMoveAndUpdate(
      this.currentBoard,
      newMove,
      this.sequenceHistory.boardHistory,
    );
    if (!newBoard) return null;

    return this.copy({ sequenceHistory: this.sequenceHistory.record(newBoard, newMove) });
  }

  undo(steps: number): MoveSequenceEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.undo(steps) });
  }

  redo(steps: number): MoveSequenceEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.redo(steps) });
  }

  undoAll(): MoveSequenceEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.undoAll() });
  }

  redoAll(): MoveSequenceEditor {
    return this.copy({ sequenceHistory: this.sequenceHistory.redoAll() });
  }

  canUndo(steps: number): boolean {
    return this.sequenceHistory.canUndo(steps);
  }

  canRedo(steps: number): boolean {
    return this.sequenceHistory.canRedo(steps);
  }

  hashCode(): number {
    return 0; // TODO: Implement a proper hash code calculation
  }

  equals(_other: unknown): boolean {
    return false; // TODO: Implement proper equality check
  }

  copy(props?: Partial<MoveSequenceEditorProps> | undefined): MoveSequenceEditor {
    return new MoveSequenceEditor(
      props?.sequenceHistory ?? this.sequenceHistory,
      props?.moveProcessor ?? this.moveProcessor,
      props?.initialTurn ?? this.initialTurn,
    );
  }

  toString(): string {
    return `MoveSequenceEditor {
        sequenceHistory: ${this.sequenceHistory},
        moveProcessor: ${this.moveProcessor},
        initialTurn: ${this.initialTurn}
      }`;
  }
}

export default MoveSequenceEditor;
