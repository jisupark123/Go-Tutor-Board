import type Board from '@/lib/go-kit/core/model/board';
import type Move from '@/lib/go-kit/core/model/move';
import type { MoveProcessor } from '@/lib/go-kit/core/rule/moveProcessor';
import type { MoveUpdater } from '@/lib/go-kit/core/rule/moveUpdater';
import type { MoveValidator } from '@/lib/go-kit/core/rule/moveValidator';

export default class RuleBasedMoveProcessor implements MoveProcessor {
  private validators: MoveValidator[];
  private updater: MoveUpdater;

  constructor(validators: MoveValidator[], updater: MoveUpdater) {
    this.validators = validators;
    this.updater = updater;
  }

  validateMove(board: Board, move: Move, boardHistory: readonly Board[]): boolean {
    return this.validators.every((validator) => validator.isValidMove(board, move, boardHistory));
  }

  validateMoveAndUpdate(board: Board, move: Move, boardHistory: readonly Board[]): Board | null {
    if (!this.validateMove(board, move, boardHistory)) {
      return null;
    }
    return this.updater.placeMove(board, move);
  }
}
