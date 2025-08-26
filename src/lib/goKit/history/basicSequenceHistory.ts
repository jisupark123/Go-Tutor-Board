import type Board from '@/lib/goKit/core/model/board';
import type Move from '@/lib/goKit/core/model/move';
import type { SequenceHistory } from '@/lib/goKit/history/sequenceHistory';

class BasicSequenceHistory implements SequenceHistory {
  private _boardHistory: Board[] = [];
  private _moveHistory: Move[] = [];
  private currentIndex: number = 0;

  constructor(initialBoard: Board) {
    this._boardHistory.push(initialBoard);
  }

  get currentBoard(): Board {
    return this._boardHistory[this.currentIndex];
  }

  get currentMove(): Move | null {
    return this._moveHistory[this.currentIndex - 1] ?? null;
  }

  get boardHistory(): Board[] {
    return this._boardHistory;
  }

  get moveHistory(): Move[] {
    return this._moveHistory;
  }

  record(board: Board, move: Move): void {
    if (this.currentIndex < this._boardHistory.length - 1) {
      this._boardHistory.splice(this.currentIndex + 1);
      this._moveHistory.splice(this.currentIndex);
    }

    this._boardHistory.push(board);
    this._moveHistory.push(move);
    this.currentIndex++;
  }

  undo(steps: number): number {
    if (steps < 0) throw new Error('Steps must be non-negative');
    const actualSteps = Math.min(steps, this.currentIndex);
    this.currentIndex -= actualSteps;
    return actualSteps;
  }

  redo(steps: number): number {
    if (steps < 0) throw new Error('Steps must be non-negative');
    const actualSteps = Math.min(steps, this._boardHistory.length - 1 - this.currentIndex);
    this.currentIndex += actualSteps;
    return actualSteps;
  }

  undoAll(): number {
    const steps = this.currentIndex;
    this.currentIndex = 0;
    return steps;
  }

  redoAll(): number {
    const steps = this._boardHistory.length - 1 - this.currentIndex;
    this.currentIndex = this._boardHistory.length - 1;
    return steps;
  }

  canUndo(steps: number): boolean {
    if (steps < 0) throw new Error('Steps must be non-negative');
    return this.currentIndex >= steps;
  }

  canRedo(steps: number): boolean {
    if (steps < 0) throw new Error('Steps must be non-negative');
    return this.currentIndex + steps <= this._boardHistory.length - 1;
  }

  reset(initialBoard: Board): void {
    this._boardHistory = [initialBoard];
    this._moveHistory = [];
    this.currentIndex = 0;
  }
}
export default BasicSequenceHistory;
