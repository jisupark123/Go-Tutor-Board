import HashMap from '@/lib/core-ts/hashMap';
import HashSet from '@/lib/core-ts/hashSet';
import type Board from '@/lib/go-kit/core/model/board';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import Stone from '@/lib/go-kit/core/model/stone';

class BoardRuleHelper {
  // 생성자를 private으로 막아서 인스턴스 생성 불가
  private constructor() {}

  // 주어진 좌표에 놓인 돌의 활로의 개수를 반환하는 함수
  static libertyCount(board: Board, coordinate: Coordinate): number {
    return this.liberties(board, coordinate).size;
  }

  // 주어진 좌표에 놓인 돌의 모든 활로를 반환하는 함수
  static liberties(board: Board, coordinate: Coordinate): HashSet<Coordinate> {
    const stone = board.get(coordinate.y, coordinate.x);
    if (stone === Stone.EMPTY) {
      throw new Error(`Cannot check liberties for an empty coordinate: ${JSON.stringify(coordinate)}`);
    }
    const chain = this.stoneChain(board, coordinate);
    const result = new HashSet<Coordinate>();
    for (const coord of chain) {
      const emptyAdjacents = this.matchingAdjacentCoordinates(board, coord, Stone.EMPTY);
      for (const empty of emptyAdjacents) {
        result.add(empty);
      }
    }
    return result;
  }

  // 주어진 좌표에 놓인 돌과 연결된 모든 돌의 좌표를 반환하는 함수
  static stoneChain(board: Board, coordinate: Coordinate): HashSet<Coordinate> {
    const stone = board.get(coordinate.y, coordinate.x);
    if (stone === Stone.EMPTY) {
      throw new Error(`Cannot check stone chain for an empty coordinate: ${JSON.stringify(coordinate)}`);
    }
    const result = new HashSet<Coordinate>();
    const queue: Coordinate[] = [];
    const visited = new HashSet<Coordinate>();
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
    return result;
  }

  // 인접한 좌표 중에서 같은 돌을 가진 좌표를 모두 반환하는 함수
  static matchingAdjacentCoordinates(board: Board, coordinate: Coordinate, stone: Stone): HashSet<Coordinate> {
    return new HashSet(
      Array.from(this.adjacentCoordinates(board, coordinate)).filter((c) => board.get(c.y, c.x) === stone),
    );
  }

  // 인접한 4곳의 좌표를 모두 반환하는 함수
  static adjacentCoordinates(board: Board, coordinate: Coordinate): HashSet<Coordinate> {
    const { y, x } = coordinate;
    const validRange = (coord: Coordinate) =>
      coord.y >= 0 && coord.y < board.dimension && coord.x >= 0 && coord.x < board.dimension;

    return new HashSet(
      [new Coordinate(y - 1, x), new Coordinate(y + 1, x), new Coordinate(y, x - 1), new Coordinate(y, x + 1)].filter(
        validRange,
      ),
    );
  }

  static allLiberties(board: Board): HashMap<HashSet<Coordinate>, HashSet<Coordinate>> {
    const visited = new HashSet<Coordinate>();
    const result = new HashMap<HashSet<Coordinate>, HashSet<Coordinate>>();

    for (let y = 0; y < board.dimension; y++) {
      for (let x = 0; x < board.dimension; x++) {
        const coord = new Coordinate(y, x);
        const stone = board.get(y, x); // board[y, x] 대신 get 메서드 사용

        if (visited.has(coord) || stone === Stone.EMPTY) continue;

        const chain = this.stoneChain(board, coord); // Chain은 HashSet<Coordinate> 반환
        visited.addAll([...chain.values()]);

        const liberties = new HashSet<Coordinate>();
        for (const c of chain) {
          liberties.addAll([...this.matchingAdjacentCoordinates(board, c, Stone.EMPTY).values()]);
        }

        result.set(chain, liberties);
      }
    }

    return result;
  }
}

export default BoardRuleHelper;
