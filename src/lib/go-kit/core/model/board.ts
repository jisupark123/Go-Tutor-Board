import type { DataObject } from '@/lib/core-ts/dataObject';
import HashSet from '@/lib/core-ts/hashSet';
import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';

type BoardProps = {
  dimension: number;
  state: Stone[][];
};

class Board implements DataObject<Board, BoardProps> {
  readonly dimension: number;
  private readonly _state: ReadonlyArray<ReadonlyArray<Stone>>;

  constructor(dimension: number, state?: Stone[][]) {
    this.dimension = dimension;
    this._state = state
      ? state.map((row) => [...row])
      : Array.from({ length: dimension }, () => Array.from({ length: dimension }, () => Stone.EMPTY));
  }

  get state(): ReadonlyArray<ReadonlyArray<Stone>> {
    return this.deepcopyState();
  }

  get(y: number, x: number): Stone {
    return this._state[y][x];
  }

  private deepcopyState(): Stone[][] {
    return this._state.map((row) => [...row]);
  }

  setMove(move: Move): Board {
    const { y, x, stone } = move;
    const newState = this.deepcopyState();
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
    return this._state.reduce((acc, row) => acc + row.filter((s) => s === stone).length, 0);
  }

  toMoves(): HashSet<Move> {
    const moves = new HashSet<Move>();
    for (let y = 0; y < this.dimension; y++) {
      for (let x = 0; x < this.dimension; x++) {
        if (this._state[y][x] !== Stone.EMPTY) {
          moves.add(new Move(y, x, this._state[y][x]));
        }
      }
    }
    return moves;
  }

  equals(other: any): boolean {
    if (this === other) return true;
    if (!(other instanceof Board)) return false;
    if (this.dimension !== other.dimension) return false;

    for (let y = 0; y < this.dimension; y++) {
      for (let x = 0; x < this.dimension; x++) {
        if (this._state[y][x] !== other._state[y][x]) {
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
        result = (result * 31 + this._state[y][x].charCodeAt(0)) | 0;
      }
    }
    return result;
  }

  copy(props?: Partial<BoardProps> | undefined): Board {
    return new Board(props?.dimension ?? this.dimension, props?.state ?? this.deepcopyState());
  }
}

export default Board;
