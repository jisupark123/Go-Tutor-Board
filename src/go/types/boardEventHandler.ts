import type Coordinate from '@/lib/go-kit/core/model/coordinate';

export interface BoardEventHandler {
  onBoardTouch: (coordinate: Coordinate) => void;
}
