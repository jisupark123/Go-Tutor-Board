import type { DataObject } from '@/lib/core-ts/dataObject';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import Stone, { hashStone } from '@/lib/go-kit/core/model/stone';

type MoveProps = {
  y: number;
  x: number;
  stone: Stone;
};

class Move extends Coordinate implements DataObject<Move, MoveProps> {
  readonly stone: Stone;

  constructor(y: number, x: number, stone: Stone) {
    super(y, x);
    this.stone = stone;
  }

  static PASS = new Move(-1, -1, Stone.EMPTY);

  hashCode(): number {
    const prime = 31;
    let result = super.hashCode();
    result = prime * result + hashStone(this.stone);
    return result;
  }

  equals(other: unknown): boolean {
    if (other instanceof Move) {
      return super.equals(other) && this.stone === other.stone;
    }
    return false;
  }

  copy(props?: Partial<{ y: number; x: number }> | undefined): Move {
    return new Move(props?.y ?? this.y, props?.x ?? this.x, this.stone);
  }

  toString(): string {
    return `(${this.y}, ${this.x}, ${this.stone})`;
  }
}

export default Move;
