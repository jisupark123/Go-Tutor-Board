import type { DataObject } from '@/lib/core-ts/dataObject';

type CoordinateProps = {
  y: number;
  x: number;
};

class Coordinate implements DataObject<Coordinate, CoordinateProps> {
  readonly y: number;
  readonly x: number;

  constructor(y: number, x: number) {
    this.y = y;
    this.x = x;
  }

  hashCode(): number {
    const prime = 31;
    let result = 1;
    result = prime * result + this.y;
    result = prime * result + this.x;
    return result;
  }

  equals(other: unknown): boolean {
    if (other instanceof Coordinate) {
      return this.y === other.y && this.x === other.x;
    }
    return false;
  }

  copy(props?: Partial<CoordinateProps> | undefined): Coordinate {
    return new Coordinate(props?.y ?? this.y, props?.x ?? this.x);
  }

  toString(): string {
    return `(${this.y}, ${this.x})`;
  }
}

export default Coordinate;
