import type Coordinate from '@/lib/go-kit/core/model/coordinate';

export interface BoardEventObserver {
  onBoardClicked(coord: Coordinate): void;
}
