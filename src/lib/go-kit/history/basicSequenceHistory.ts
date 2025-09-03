import type { DataObject } from '@/lib/core-ts/dataObject';
import type Board from '@/lib/go-kit/core/model/board';
import type Move from '@/lib/go-kit/core/model/move';
import type { SequenceHistory } from '@/lib/go-kit/history/sequenceHistory';

type BasicSequenceHistoryProps = {
  boardHistory: Board[];
  moveHistory: Move[];
  currentIndex: number;
};

class BasicSequenceHistory implements SequenceHistory, DataObject<BasicSequenceHistory, BasicSequenceHistoryProps> {
  private readonly _boardHistory: ReadonlyArray<Board>;
  private readonly _moveHistory: ReadonlyArray<Move>;
  private readonly currentIndex: number;

  constructor(boardHistory: Board[], moveHistory: Move[], currentIndex: number);

  constructor(initialBoard: Board);

  constructor(arg1: Board[] | Board, arg2?: Move[], arg3?: number) {
    if (Array.isArray(arg1)) {
      // case: (boardHistory, moveHistory, currentIndex)
      this._boardHistory = [...arg1];
      this._moveHistory = arg2 ? [...arg2] : [];
      this.currentIndex = arg3 ?? 0;
    } else {
      // case: (initialBoard)
      this._boardHistory = [arg1];
      this._moveHistory = [];
      this.currentIndex = 0;
    }
  }

  get initialBoard(): Board {
    return this._boardHistory[0];
  }

  get currentBoard(): Board {
    return this._boardHistory[this.currentIndex];
  }

  get currentMove(): Move | null {
    return this._moveHistory[this.currentIndex - 1] ?? null;
  }

  get boardHistory(): Board[] {
    return [...this._boardHistory];
  }

  get moveHistory(): Move[] {
    return [...this._moveHistory];
  }

  record(board: Board, move: Move): SequenceHistory {
    // redo 기록이 있다면 삭제
    const newBoardHistory = [...this._boardHistory.slice(0, this.currentIndex + 1), board];
    const newMoveHistory = [...this._moveHistory.slice(0, this.currentIndex), move];

    return this.copy({
      boardHistory: newBoardHistory,
      moveHistory: newMoveHistory,
      currentIndex: this.currentIndex + 1,
    });
  }

  undo(steps: number): SequenceHistory {
    if (steps < 0) throw new Error('Steps must be non-negative');
    const actualSteps = Math.min(steps, this.currentIndex);
    return this.copy({ currentIndex: this.currentIndex - actualSteps });
  }

  redo(steps: number): SequenceHistory {
    if (steps < 0) throw new Error('Steps must be non-negative');
    const actualSteps = Math.min(steps, this._boardHistory.length - 1 - this.currentIndex);
    return this.copy({ currentIndex: this.currentIndex + actualSteps });
  }

  undoAll(): SequenceHistory {
    return this.copy({ currentIndex: 0 });
  }

  redoAll(): SequenceHistory {
    return this.copy({ currentIndex: this._boardHistory.length - 1 });
  }

  canUndo(steps: number): boolean {
    if (steps < 0) throw new Error('Steps must be non-negative');
    return this.currentIndex >= steps;
  }

  canRedo(steps: number): boolean {
    if (steps < 0) throw new Error('Steps must be non-negative');
    return this.currentIndex + steps <= this._boardHistory.length - 1;
  }

  reset(initialBoard?: Board): SequenceHistory {
    return new BasicSequenceHistory(initialBoard ?? this.initialBoard);
  }

  hashCode(): number {
    let hash = 17;
    for (const board of this._boardHistory) {
      hash = hash * 31 + board.hashCode();
    }
    for (const move of this._moveHistory) {
      hash = hash * 31 + move.hashCode();
    }
    hash = hash * 31 + this.currentIndex;
    return hash;
  }

  equals(other: unknown): boolean {
    if (!(other instanceof BasicSequenceHistory)) return false;
    return (
      this.currentIndex === other.currentIndex &&
      this._boardHistory.length === other._boardHistory.length &&
      this._moveHistory.length === other._moveHistory.length &&
      this._boardHistory.every((board, index) => board.equals(other._boardHistory[index])) &&
      this._moveHistory.every((move, index) => move.equals(other._moveHistory[index]))
    );
  }

  copy(props?: Partial<BasicSequenceHistoryProps> | undefined): BasicSequenceHistory {
    return new BasicSequenceHistory(
      props?.boardHistory ?? [...this._boardHistory],
      props?.moveHistory ?? [...this._moveHistory],
      props?.currentIndex ?? this.currentIndex,
    );
  }

  toString(): string {
    return `BasicSequenceHistory {
      currentIndex: ${this.currentIndex},
      boardHistory: [${this._boardHistory.map((board) => board.toString()).join(', ')}],
      moveHistory: [${this._moveHistory.map((move) => move.toString()).join(', ')}]
    }`;
  }
}
export default BasicSequenceHistory;
