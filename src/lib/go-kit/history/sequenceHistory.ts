import type Board from '@/lib/go-kit/core/model/board';
import type Move from '@/lib/go-kit/core/model/move';

export interface SequenceHistory {
  readonly initialBoard: Board;

  readonly currentBoard: Board;

  readonly currentMove: Move | null;

  readonly boardHistory: Board[];

  readonly moveHistory: Move[];

  record(board: Board, move: Move): SequenceHistory;

  undo(steps: number): SequenceHistory;

  redo(steps: number): SequenceHistory;

  undoAll(): SequenceHistory;

  redoAll(): SequenceHistory;

  canUndo(steps: number): boolean;

  canRedo(steps: number): boolean;

  reset(initialBoard?: Board): SequenceHistory;
}
