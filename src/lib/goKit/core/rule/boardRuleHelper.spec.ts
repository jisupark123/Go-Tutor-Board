import { describe, expect, it } from 'vitest';

import Coordinate from '@/lib/goKit/core/model/coordinate';
import Stone from '@/lib/goKit/core/model/stone';
import BoardRuleHelper from '@/lib/goKit/core/rule/boardRuleHelper';
import BoardUtils from '@/lib/goKit/utils/boardUtils';

describe('BoardRuleHelper', () => {
  const b1 = `
xoxx+
xooxx
+x+oo
xooxx
xoxx+
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
  const helper = BoardRuleHelper;

  it('libertyCount returns correct number of liberties', () => {
    expect(helper.libertyCount(board1, new Coordinate(0, 0))).toEqual(1);
    expect(helper.libertyCount(board1, new Coordinate(0, 1))).toEqual(1);
    expect(helper.libertyCount(board1, new Coordinate(4, 0))).toEqual(1);

    expect(helper.libertyCount(board2, new Coordinate(0, 1))).toEqual(1);
  });

  it('liberties returns correct set of liberties', () => {
    expect(helper.liberties(board1, new Coordinate(0, 0))).toEqual(new Set([new Coordinate(2, 0)]));

    expect(helper.liberties(board1, new Coordinate(0, 1))).toEqual(new Set([new Coordinate(2, 2)]));

    expect(helper.liberties(board1, new Coordinate(2, 1))).toEqual(
      new Set([new Coordinate(2, 0), new Coordinate(2, 2)]),
    );
  });

  it('libertyCount and liberties throw exception for empty coordinates', () => {
    const emptyCoordinate = new Coordinate(2, 0);

    expect(() => BoardRuleHelper.libertyCount(board1, emptyCoordinate)).toThrowError();
    expect(() => BoardRuleHelper.liberties(board1, emptyCoordinate)).toThrowError();
  });

  it('stoneChain returns correct set of connected stones', () => {
    expect(BoardRuleHelper.stoneChain(board1, new Coordinate(0, 0))).toEqual(
      new Set([new Coordinate(0, 0), new Coordinate(1, 0)]),
    );
    expect(BoardRuleHelper.stoneChain(board1, new Coordinate(1, 1))).toEqual(
      new Set([new Coordinate(0, 1), new Coordinate(1, 1), new Coordinate(1, 2)]),
    );

    expect(BoardRuleHelper.stoneChain(board1, new Coordinate(4, 3))).toEqual(
      new Set([new Coordinate(4, 2), new Coordinate(4, 3), new Coordinate(3, 3), new Coordinate(3, 4)]),
    );

    expect(helper.stoneChain(board2, new Coordinate(0, 1))).toEqual(
      new Set([
        new Coordinate(0, 1),
        new Coordinate(1, 0),
        new Coordinate(1, 1),
        new Coordinate(2, 0),
        new Coordinate(2, 1),
        new Coordinate(3, 0),
        new Coordinate(3, 1),
        new Coordinate(4, 0),
        new Coordinate(4, 1),
      ]),
    );
  });

  it('stoneChain throws exception for empty coordinates', () => {
    expect(() => BoardRuleHelper.stoneChain(board1, new Coordinate(2, 0))).toThrowError();
  });

  it('returns correct adjacent coordinates for matching stone', () => {
    expect(BoardRuleHelper.matchingAdjacentCoordinates(board1, new Coordinate(0, 0), Stone.BLACK)).toEqual(
      new Set([new Coordinate(1, 0)]),
    );

    expect(BoardRuleHelper.matchingAdjacentCoordinates(board1, new Coordinate(0, 0), Stone.WHITE)).toEqual(
      new Set([new Coordinate(0, 1)]),
    );

    expect(BoardRuleHelper.matchingAdjacentCoordinates(board1, new Coordinate(3, 1), Stone.WHITE)).toEqual(
      new Set([new Coordinate(3, 2), new Coordinate(4, 1)]),
    );

    // Stone.EMPTY가 주어지면 인접한 빈 좌표를 반환한다.
    expect(BoardRuleHelper.matchingAdjacentCoordinates(board1, new Coordinate(1, 0), Stone.EMPTY)).toEqual(
      new Set([new Coordinate(2, 0)]),
    );
  });

  it('adjacentCoordinates returns correct adjacent coordinates', () => {
    // 1의1은 인접한 좌표가 2곳이다.
    expect(BoardRuleHelper.adjacentCoordinates(board1, new Coordinate(0, 0))).toEqual(
      new Set([new Coordinate(0, 1), new Coordinate(1, 0)]),
    );

    // 1의1이 아닌 1선은 인접한 좌표가 3곳이다.
    expect(BoardRuleHelper.adjacentCoordinates(board1, new Coordinate(0, 2))).toEqual(
      new Set([new Coordinate(0, 1), new Coordinate(1, 2), new Coordinate(0, 3)]),
    );

    // 1선이 아니면 인접한 좌표가 4곳이다.
    expect(BoardRuleHelper.adjacentCoordinates(board1, new Coordinate(2, 2))).toEqual(
      new Set([new Coordinate(1, 2), new Coordinate(2, 1), new Coordinate(2, 3), new Coordinate(3, 2)]),
    );
  });
});
