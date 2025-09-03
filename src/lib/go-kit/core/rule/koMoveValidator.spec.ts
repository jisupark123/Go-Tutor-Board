import { describe, it, expect } from 'vitest';

import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';
import KoMoveValidator from '@/lib/go-kit/core/rule/koMoveValidator';
import type { MoveValidator } from '@/lib/go-kit/core/rule/moveValidator';
import BoardUtils from '@/lib/go-kit/utils/boardUtils';

describe('KoMoveValidatorTest', () => {
  const b1 = `
+++++
++x++
+xox+
+o+o+
++o++
`.trim();

  const b2 = `
+++++
++x++
+x+x+
+oxo+
++o++
`.trim();

  const b3 = `
+++++
++x++
+xox+
+o+++
++o++
`.trim();

  const initialBoard = BoardUtils.asciiToBoard(b1);
  const prevBoard1 = BoardUtils.asciiToBoard(b2);
  const prevBoard2 = BoardUtils.asciiToBoard(b3);
  const boardHistory1 = [prevBoard1, initialBoard];
  const boardHistory2 = [prevBoard2, initialBoard];
  const validator: MoveValidator = new KoMoveValidator();

  it('isValidMove throws IllegalArgumentException for out of bounds input', () => {
    expect(() => validator.isValidMove(initialBoard, new Move(-1, 0, Stone.BLACK), boardHistory1)).toThrow();
    expect(() => validator.isValidMove(initialBoard, new Move(0, -1, Stone.BLACK), boardHistory1)).toThrow();
    expect(() => validator.isValidMove(initialBoard, new Move(5, 0, Stone.BLACK), boardHistory1)).toThrow();
    expect(() => validator.isValidMove(initialBoard, new Move(0, 5, Stone.BLACK), boardHistory1)).toThrow();
  });
  it('isValidMove throws IllegalArgumentException for EMPTY stone', () => {
    expect(() => validator.isValidMove(initialBoard, new Move(0, 0, Stone.EMPTY), boardHistory1)).toThrow();
  });

  it('move is valid when boardHistory is empty', () => {
    const move = new Move(3, 2, Stone.BLACK);
    expect(validator.isValidMove(initialBoard, move, [])).toBe(true);
  });

  it('move is invalid when next board is same as previous board', () => {
    const move = new Move(3, 2, Stone.BLACK);
    expect(validator.isValidMove(initialBoard, move, boardHistory1)).toBe(false);
  });

  it('move is valid when next board is different from previous board', () => {
    const validator = new KoMoveValidator();
    const move = new Move(3, 2, Stone.BLACK);
    expect(validator.isValidMove(initialBoard, move, boardHistory2)).toBe(true);
  });
});
