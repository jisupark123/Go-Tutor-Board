import { describe, it, expect } from 'vitest';

import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';
import StandardMoveUpdater from '@/lib/go-kit/core/rule/standardMoveUpdater';
import BoardUtils from '@/lib/go-kit/utils/boardUtils';

describe('StandardMoveUpdater', () => {
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

  const board1 = BoardUtils.asciiToBoard(b1);
  const board2 = BoardUtils.asciiToBoard(b2);

  const updater = new StandardMoveUpdater();

  it('placeMove throws IllegalArgumentException for out of bounds input', () => {
    expect(() => updater.placeMove(board1, new Move(-1, 0, Stone.BLACK))).toThrow();
    expect(() => updater.placeMove(board1, new Move(0, -1, Stone.BLACK))).toThrow();
    expect(() => updater.placeMove(board1, new Move(5, 0, Stone.BLACK))).toThrow();
    expect(() => updater.placeMove(board1, new Move(0, 5, Stone.BLACK))).toThrow();
  });

  it('placeMove throws IllegalArgumentException for EMPTY stone', () => {
    expect(() => updater.placeMove(board1, new Move(0, 0, Stone.EMPTY))).toThrow();
  });

  it('placeMove throws IllegalArgumentException for occupied position', () => {
    expect(() => updater.placeMove(board1, new Move(0, 0, Stone.BLACK))).toThrow();
    expect(() => updater.placeMove(board1, new Move(0, 0, Stone.WHITE))).toThrow();
  });

  it('placeMove does not throw exception for prohibited positions', () => {
    const updatedBoard1 = updater.placeMove(board1, new Move(0, 4, Stone.BLACK));
    expect(updatedBoard1).toEqual(board1.setMove(new Move(0, 4, Stone.BLACK)));

    const updatedBoard2 = updater.placeMove(board2, new Move(0, 0, Stone.WHITE));
    expect(updatedBoard2).toEqual(board2.setMove(new Move(0, 0, Stone.WHITE)));
  });

  it('placeMove removes captured stones', () => {
    const updatedBoard1 = updater.placeMove(board2, new Move(0, 0, Stone.BLACK));
    const expectedBoard1 = `
x+xxo
++xx+
++xxx
++xx+
++xxx
`.trim();
    expect(updatedBoard1).toEqual(BoardUtils.asciiToBoard(expectedBoard1));

    const updatedBoard2 = updater.placeMove(board2, new Move(1, 4, Stone.BLACK));
    const expectedBoard2 = `
+oxx+
ooxxx
ooxxx
ooxx+
ooxxx
`.trim();
    expect(updatedBoard2).toEqual(BoardUtils.asciiToBoard(expectedBoard2));
  });

  it('placeMove does not capture stones when none are available', () => {
    const updatedBoard1 = updater.placeMove(board1, new Move(0, 4, Stone.WHITE));
    expect(updatedBoard1).toEqual(board1.setMove(new Move(0, 4, Stone.WHITE)));
  });
});
