import { describe, expect, it } from 'vitest';

import HashSet from '@/lib/core-ts/hashSet';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import Stone from '@/lib/go-kit/core/model/stone';
import BoardRuleHelper from '@/lib/go-kit/core/rule/boardRuleHelper';
import BoardUtils from '@/lib/go-kit/utils/boardUtils';

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
    expect(helper.liberties(board1, new Coordinate(0, 0)).equals(new HashSet([new Coordinate(2, 0)]))).toBe(true);

    expect(helper.liberties(board1, new Coordinate(0, 1)).equals(new HashSet([new Coordinate(2, 2)]))).toBe(true);

    expect(
      helper.liberties(board1, new Coordinate(2, 1)).equals(new HashSet([new Coordinate(2, 2), new Coordinate(2, 0)])),
    ).toBe(true);
  });

  it('libertyCount and liberties throw exception for empty coordinates', () => {
    const emptyCoordinate = new Coordinate(2, 0);

    expect(() => BoardRuleHelper.libertyCount(board1, emptyCoordinate)).toThrowError();
    expect(() => BoardRuleHelper.liberties(board1, emptyCoordinate)).toThrowError();
  });

  it('stoneChain returns correct set of connected stones', () => {
    expect(
      BoardRuleHelper.stoneChain(board1, new Coordinate(0, 0)).equals(
        new HashSet([new Coordinate(0, 0), new Coordinate(1, 0)]),
      ),
    ).toBe(true);
    expect(
      BoardRuleHelper.stoneChain(board1, new Coordinate(1, 1)).equals(
        new HashSet([new Coordinate(0, 1), new Coordinate(1, 1), new Coordinate(1, 2)]),
      ),
    ).toBe(true);

    expect(
      BoardRuleHelper.stoneChain(board1, new Coordinate(4, 3)).equals(
        new HashSet([new Coordinate(4, 2), new Coordinate(4, 3), new Coordinate(3, 3), new Coordinate(3, 4)]),
      ),
    ).toBe(true);

    expect(
      helper
        .stoneChain(board2, new Coordinate(0, 1))
        .equals(
          new HashSet([
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
        ),
    ).toBe(true);
  });

  it('stoneChain throws exception for empty coordinates', () => {
    expect(() => BoardRuleHelper.stoneChain(board1, new Coordinate(2, 0))).toThrowError();
  });

  it('returns correct adjacent coordinates for matching stone', () => {
    expect(
      BoardRuleHelper.matchingAdjacentCoordinates(board1, new Coordinate(0, 0), Stone.BLACK).equals(
        new HashSet([new Coordinate(1, 0)]),
      ),
    ).toBe(true);

    expect(
      BoardRuleHelper.matchingAdjacentCoordinates(board1, new Coordinate(0, 0), Stone.WHITE).equals(
        new HashSet([new Coordinate(0, 1)]),
      ),
    ).toBe(true);

    expect(
      BoardRuleHelper.matchingAdjacentCoordinates(board1, new Coordinate(3, 1), Stone.WHITE).equals(
        new HashSet([new Coordinate(3, 2), new Coordinate(4, 1)]),
      ),
    ).toBe(true);

    // Stone.EMPTY가 주어지면 인접한 빈 좌표를 반환한다.
    expect(
      BoardRuleHelper.matchingAdjacentCoordinates(board1, new Coordinate(1, 0), Stone.EMPTY).equals(
        new HashSet([new Coordinate(2, 0)]),
      ),
    ).toBe(true);
  });

  it('adjacentCoordinates returns correct adjacent coordinates', () => {
    // 1의1은 인접한 좌표가 2곳이다.
    expect(
      BoardRuleHelper.adjacentCoordinates(board1, new Coordinate(0, 0)).equals(
        new HashSet([new Coordinate(0, 1), new Coordinate(1, 0)]),
      ),
    ).toBe(true);

    // 1의1이 아닌 1선은 인접한 좌표가 3곳이다.
    expect(
      BoardRuleHelper.adjacentCoordinates(board1, new Coordinate(0, 2)).equals(
        new HashSet([new Coordinate(0, 1), new Coordinate(1, 2), new Coordinate(0, 3)]),
      ),
    ).toBe(true);

    // 1선이 아니면 인접한 좌표가 4곳이다.
    expect(
      BoardRuleHelper.adjacentCoordinates(board1, new Coordinate(2, 2)).equals(
        new HashSet([new Coordinate(1, 2), new Coordinate(2, 1), new Coordinate(2, 3), new Coordinate(3, 2)]),
      ),
    ).toBe(true);
  });

  it('allLiberties returns correct map of stone chains to their liberties', () => {
    const result1 = helper.allLiberties(board1);

    expect(result1.size).toBe(8);

    expect(result1.get(new HashSet([new Coordinate(0, 0), new Coordinate(1, 0)]))).toEqual(
      new HashSet([new Coordinate(2, 0)]),
    );

    expect(result1.get(new HashSet([new Coordinate(0, 1), new Coordinate(1, 1), new Coordinate(1, 2)]))).toEqual(
      new HashSet([new Coordinate(2, 2)]),
    );

    expect(
      result1.get(
        new HashSet([new Coordinate(0, 2), new Coordinate(0, 3), new Coordinate(1, 3), new Coordinate(1, 4)]),
      ),
    ).toEqual(new HashSet([new Coordinate(0, 4)]));

    expect(result1.get(new HashSet([new Coordinate(2, 1)]))).toEqual(
      new HashSet([new Coordinate(2, 0), new Coordinate(2, 2)]),
    );

    expect(result1.get(new HashSet([new Coordinate(2, 3), new Coordinate(2, 4)]))).toEqual(
      new HashSet([new Coordinate(2, 2)]),
    );

    expect(result1.get(new HashSet([new Coordinate(3, 0), new Coordinate(4, 0)]))).toEqual(
      new HashSet([new Coordinate(2, 0)]),
    );

    expect(result1.get(new HashSet([new Coordinate(3, 1), new Coordinate(3, 2), new Coordinate(4, 1)]))).toEqual(
      new HashSet([new Coordinate(2, 2)]),
    );

    expect(
      result1.get(
        new HashSet([new Coordinate(3, 3), new Coordinate(3, 4), new Coordinate(4, 2), new Coordinate(4, 3)]),
      ),
    ).toEqual(new HashSet([new Coordinate(4, 4)]));
  });
});
