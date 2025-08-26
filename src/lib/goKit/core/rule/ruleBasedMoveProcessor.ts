import type Board from '@/lib/goKit/core/model/board';
import type Move from '@/lib/goKit/core/model/move';
import type { MoveProcessor } from '@/lib/goKit/core/rule/moveProcessor';
import type { MoveUpdater } from '@/lib/goKit/core/rule/moveUpdater';
import type { MoveValidator } from '@/lib/goKit/core/rule/moveValidator';

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
