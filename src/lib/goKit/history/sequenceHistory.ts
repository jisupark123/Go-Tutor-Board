import type Board from '@/lib/goKit/core/model/board';
import type Move from '@/lib/goKit/core/model/move';

export interface SequenceHistory {
  readonly currentBoard: Board;

  readonly currentMove: Move | null;

  readonly boardHistory: Board[];

  readonly moveHistory: Move[];

  record(board: Board, move: Move): void;

  undo(steps: number): number;

  redo(steps: number): number;

  undoAll(): number;

  redoAll(): number;

  canUndo(steps: number): boolean;

  canRedo(steps: number): boolean;

  reset(initialBoard: Board): void;
}
