import type Board from '@/lib/goKit/core/model/board';
import type Coordinate from '@/lib/goKit/core/model/coordinate';
import Move from '@/lib/goKit/core/model/move';
import Stone, { oppositeStone } from '@/lib/goKit/core/model/stone';
import type { MoveProcessor } from '@/lib/goKit/core/rule/moveProcessor';
import type { SequenceHistory } from '@/lib/goKit/history/sequenceHistory';

export type TutorEditorPlaceMode = 'ONLY_BLACK' | 'ONLY_WHITE' | 'ALTERNATE';

class TutorEditor {
  private sequenceHistory: SequenceHistory;
  private moveProcessor: MoveProcessor;
  private _currentTurn: Stone = Stone.BLACK;
  private _placeMode: TutorEditorPlaceMode;

  constructor(
    sequenceHistory: SequenceHistory,
    moveProcessor: MoveProcessor,
    placeMode: TutorEditorPlaceMode = 'ONLY_BLACK',
  ) {
    this.sequenceHistory = sequenceHistory;
    this.moveProcessor = moveProcessor;
    this._placeMode = placeMode;
  }

  get currentBoard(): Board {
    return this.sequenceHistory.currentBoard;
  }

  get currentMove(): Move | null {
    return this.sequenceHistory.currentMove;
  }

  get currentTurn(): Stone {
    return this._currentTurn;
  }

  set currentTurn(turn: Stone) {
    this._currentTurn = turn;
  }

  get placeMode(): TutorEditorPlaceMode {
    return this._placeMode;
  }

  set placeMode(mode: TutorEditorPlaceMode) {
    this._placeMode = mode;
    switch (mode) {
      case 'ONLY_BLACK':
        this._currentTurn = Stone.BLACK;
        break;
      case 'ONLY_WHITE':
        this._currentTurn = Stone.WHITE;
        break;
      case 'ALTERNATE':
        this._currentTurn = Stone.BLACK;
        break;
    }
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

    if (this.placeMode === 'ALTERNATE') {
      this.toggleTurn();
      console.log('Turn toggled to', this.currentTurn);
    }

    return true;
  }

  toggleTurn(): void {
    if (this.placeMode !== 'ALTERNATE') throw new Error('Invalid turn');
    this._currentTurn = oppositeStone(this._currentTurn);
  }

  undo(steps: number): void {
    this.sequenceHistory.undo(steps);
    // this._currentTurn = this.sequenceHistory.moveHistory[]
    // TODO: currentTurn 복구
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
    this._currentTurn = Stone.BLACK;
  }
}

export default TutorEditor;
