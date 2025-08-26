import Coordinate from '@/lib/goKit/core/model/coordinate';
import Stone from '@/lib/goKit/core/model/stone';

class Move extends Coordinate {
  readonly stone: Stone;

  constructor(y: number, x: number, stone: Stone) {
    super(y, x);
    this.stone = stone;
  }
}

export default Move;
