import type Board from '@/lib/goKit/core/model/board';
import Coordinate from '@/lib/goKit/core/model/coordinate';
import Stone from '@/lib/goKit/core/model/stone';
import UniqueSet from '@/lib/goKit/utils/uniqueSet';

class BoardRuleHelper {
  // 생성자를 private으로 막아서 인스턴스 생성 불가
  private constructor() {}

  // 주어진 좌표에 놓인 돌의 활로의 개수를 반환하는 함수
  static libertyCount(board: Board, coordinate: Coordinate): number {
    return this.liberties(board, coordinate).size;
  }

  // 주어진 좌표에 놓인 돌의 모든 활로를 반환하는 함수
  static liberties(board: Board, coordinate: Coordinate): Set<Coordinate> {
    const stone = board.get(coordinate.y, coordinate.x);
    if (stone === Stone.EMPTY) {
      throw new Error(`Cannot check liberties for an empty coordinate: ${JSON.stringify(coordinate)}`);
    }
    const chain = this.stoneChain(board, coordinate);
    const result = new UniqueSet<Coordinate>((coord) => coord.hashString());
    for (const coord of chain) {
      const emptyAdjacents = this.matchingAdjacentCoordinates(board, coord, Stone.EMPTY);
      for (const empty of emptyAdjacents) {
        result.add(empty);
      }
    }
    return result.toSet();
  }

  // 주어진 좌표에 놓인 돌과 연결된 모든 돌의 좌표를 반환하는 함수
  static stoneChain(board: Board, coordinate: Coordinate): Set<Coordinate> {
    const stone = board.get(coordinate.y, coordinate.x);
    if (stone === Stone.EMPTY) {
      throw new Error(`Cannot check stone chain for an empty coordinate: ${JSON.stringify(coordinate)}`);
    }
    const result = new UniqueSet<Coordinate>((coord) => coord.hashString());
    const queue: Coordinate[] = [];
    const visited = new UniqueSet<Coordinate>((coord) => coord.hashString());
    const start = new Coordinate(coordinate.y, coordinate.x);
    queue.push(start);
    visited.add(start);
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.add(current);
      const moreMatching = this.matchingAdjacentCoordinates(board, current, stone);
      for (const coord of moreMatching) {
        if (!visited.has(coord)) {
          visited.add(coord);
          queue.push(coord);
        }
      }
    }
    return result.toSet();
  }

  // 인접한 좌표 중에서 같은 돌을 가진 좌표를 모두 반환하는 함수
  static matchingAdjacentCoordinates(board: Board, coordinate: Coordinate, stone: Stone): Set<Coordinate> {
    return new Set(
      Array.from(this.adjacentCoordinates(board, coordinate)).filter((c) => board.get(c.y, c.x) === stone),
    );
  }

  // 인접한 4곳의 좌표를 모두 반환하는 함수
  static adjacentCoordinates(board: Board, coordinate: Coordinate): Set<Coordinate> {
    const { y, x } = coordinate;
    const validRange = (coord: Coordinate) =>
      coord.y >= 0 && coord.y < board.dimension && coord.x >= 0 && coord.x < board.dimension;

    return new Set(
      [new Coordinate(y - 1, x), new Coordinate(y + 1, x), new Coordinate(y, x - 1), new Coordinate(y, x + 1)].filter(
        validRange,
      ),
    );
  }
}

export default BoardRuleHelper;
