class Coordinate {
  readonly y: number;
  readonly x: number;

  constructor(y: number, x: number) {
    this.y = y;
    this.x = x;
  }

  equals(other: Coordinate): boolean {
    return this.x === other.x && this.y === other.y;
  }

  hashString(): string {
    return `${this.x},${this.y}`;
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

export default Coordinate;
