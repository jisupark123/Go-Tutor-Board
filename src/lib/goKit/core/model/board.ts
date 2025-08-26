import Move from '@/lib/goKit/core/model/move';
import Stone from '@/lib/goKit/core/model/stone';

class Board {
  readonly dimension: number;
  private readonly state: Stone[][];

  constructor(dimension: number, state?: Stone[][]) {
    this.dimension = dimension;
    if (state) {
      // 기존 Board를 깊은 복사하여 저장
      this.state = state.map((row) => [...row]);
    } else {
      this.state = Array.from({ length: dimension }, () => Array.from({ length: dimension }, () => Stone.EMPTY));
    }
  }

  getState(): ReadonlyArray<ReadonlyArray<Stone>> {
    return this.state.map((row) => [...row]);
  }

  get(y: number, x: number): Stone {
    return this.state[y][x];
  }

  setMove(move: Move): Board {
    const { y, x, stone } = move;
    const newState = this.state.map((row) => [...row]);
    newState[y][x] = stone;
    return new Board(this.dimension, newState);
  }

  setMoves(moves: Iterable<Move>): Board {
    let board: Board = this.copy();
    for (const move of moves) {
      board = board.setMove(move);
    }
    return board;
  }

  countStones(stone: Stone): number {
    return this.state.reduce((acc, row) => acc + row.filter((s) => s === stone).length, 0);
  }

  equals(other: any): boolean {
    if (this === other) return true;
    if (!(other instanceof Board)) return false;
    if (this.dimension !== other.dimension) return false;

    for (let y = 0; y < this.dimension; y++) {
      for (let x = 0; x < this.dimension; x++) {
        if (this.state[y][x] !== other.state[y][x]) {
          return false;
        }
      }
    }
    return true;
  }

  hashCode(): number {
    // 단순 해시 구현 (Kotlin의 contentDeepHashCode 비슷하게)
    let result = 31 * this.dimension;
    for (let y = 0; y < this.dimension; y++) {
      for (let x = 0; x < this.dimension; x++) {
        result = (result * 31 + this.state[y][x].charCodeAt(0)) | 0;
      }
    }
    return result;
  }

  copy(): Board {
    return new Board(
      this.dimension,
      this.state.map((row) => [...row]),
    );
  }
}

export default Board;
