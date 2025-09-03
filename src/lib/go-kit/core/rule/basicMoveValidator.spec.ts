import { describe, it, expect, beforeEach } from 'vitest';

import type Board from '@/lib/go-kit/core/model/board';
import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';
import BasicMoveValidator from '@/lib/go-kit/core/rule/basicMoveValidator';
import type { MoveValidator } from '@/lib/go-kit/core/rule/moveValidator';
import BoardUtils from '@/lib/go-kit/utils/boardUtils';

describe('BasicMoveValidator', () => {
  const b1 = `
oooo+
ooooo
+++++
xxxxx
xxxx+
`.trim();

  const b2 = `
+oxxo
ooxx+
ooxxx
ooxx+
ooxxx
`.trim();

  let board1: Board;
  let board2: Board;

  beforeEach(() => {
    board1 = BoardUtils.asciiToBoard(b1);
    board2 = BoardUtils.asciiToBoard(b2);
  });

  const validator: MoveValidator = new BasicMoveValidator();
  const emptyHistory: readonly Board[] = [];

  it('isValidMove throws error for out of bounds input', () => {
    expect(() => validator.isValidMove(board1, new Move(-1, 0, Stone.BLACK), emptyHistory)).toThrow();
    expect(() => validator.isValidMove(board1, new Move(0, -1, Stone.BLACK), emptyHistory)).toThrow();
    expect(() => validator.isValidMove(board1, new Move(5, 0, Stone.BLACK), emptyHistory)).toThrow();
    expect(() => validator.isValidMove(board1, new Move(0, 5, Stone.BLACK), emptyHistory)).toThrow();
  });

  it('isValidMove throws IllegalArgumentException for EMPTY stone', () => {
    expect(() => validator.isValidMove(board1, new Move(0, 0, Stone.EMPTY), emptyHistory)).toThrow();
  });

  it('isValidMove returns false for occupied positions', () => {
    expect(validator.isValidMove(board1, new Move(0, 0, Stone.BLACK), emptyHistory)).toEqual(false);
    expect(validator.isValidMove(board1, new Move(0, 0, Stone.WHITE), emptyHistory)).toEqual(false);
  });

  it('isValidMove returns false for prohibited positions', () => {
    expect(validator.isValidMove(board1, new Move(0, 4, Stone.BLACK), emptyHistory)).toEqual(false);
    expect(validator.isValidMove(board1, new Move(4, 4, Stone.WHITE), emptyHistory)).toEqual(false);
    expect(validator.isValidMove(board2, new Move(0, 0, Stone.WHITE), emptyHistory)).toEqual(false);
    expect(validator.isValidMove(board2, new Move(1, 4, Stone.WHITE), emptyHistory)).toEqual(false);
  });

  it("isValidMove returns true when capturing opponent's stones", () => {
    expect(validator.isValidMove(board2, new Move(0, 0, Stone.BLACK), emptyHistory)).toEqual(true);
  });

  it('isValidMove returns true for valid moves with liberties', () => {
    expect(validator.isValidMove(board1, new Move(0, 4, Stone.WHITE), emptyHistory)).toEqual(true);
    expect(validator.isValidMove(board1, new Move(4, 4, Stone.BLACK), emptyHistory)).toEqual(true);
    expect(validator.isValidMove(board2, new Move(3, 4, Stone.BLACK), emptyHistory)).toEqual(true);
  });
});
