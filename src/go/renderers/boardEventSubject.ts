import type Coordinate from '@/lib/go-kit/core/model/coordinate';

import type { BoardEventObserver } from '@/go/renderers/boardEventObserver';

// 옵저버 관리용 Subject
export class BoardEventSubject {
  private observers: BoardEventObserver[] = [];

  addObserver(observer: BoardEventObserver) {
    this.observers.push(observer);
  }

  removeObserver(observer: BoardEventObserver) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notifyBoardClicked(coord: Coordinate) {
    this.observers.forEach((o) => o.onBoardClicked(coord));
  }
}
