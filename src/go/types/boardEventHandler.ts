import type Coordinate from '@/lib/goKit/core/model/coordinate';

export interface BoardEventHandler {
  onBoardTouch: (coordinate: Coordinate) => void;
}
