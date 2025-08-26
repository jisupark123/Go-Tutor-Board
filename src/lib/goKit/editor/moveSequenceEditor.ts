import type Board from '@/lib/goKit/core/model/board';
import type Coordinate from '@/lib/goKit/core/model/coordinate';
import Move from '@/lib/goKit/core/model/move';
import Stone, { oppositeStone } from '@/lib/goKit/core/model/stone';
import type { MoveProcessor } from '@/lib/goKit/core/rule/moveProcessor';
import type { SequenceHistory } from '@/lib/goKit/history/sequenceHistory';

class MoveSequenceEditor {
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

  validateAndPlaceMove(coordinate: Coordinate): boolean {
    const { y, x } = coordinate;
    const move = new Move(y, x, this.currentTurn);
    const newBoard = this.moveProcessor.validateMoveAndUpdate(
      this.currentBoard,
      move,
      this.sequenceHistory.boardHistory,
    );
    if (!newBoard) return false;
    this.sequenceHistory.record(newBoard, move);

    return true;
  }

  undo(steps: number): void {
    this.sequenceHistory.undo(steps);
  }

  redo(steps: number): void {
    this.sequenceHistory.redo(steps);
  }

  undoAll(): void {
    this.sequenceHistory.undoAll();
  }

  redoAll(): void {
    this.sequenceHistory.redoAll();
  }

  canUndo(steps: number): boolean {
    return this.sequenceHistory.canUndo(steps);
  }

  canRedo(steps: number): boolean {
    return this.sequenceHistory.canRedo(steps);
  }

  reset(initialBoard: Board): void {
    this.sequenceHistory.reset(initialBoard);
  }
}

export default MoveSequenceEditor;
