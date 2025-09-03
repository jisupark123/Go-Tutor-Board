import { describe, it, expect, beforeEach } from 'vitest';

import Board from '@/lib/go-kit/core/model/board';
import Stone from '@/lib/go-kit/core/model/stone';

describe('Board', () => {
  let originalState: Array<Array<Stone>>;
  let original: Board;

  beforeEach(() => {
    originalState = Array.from({ length: 19 }, () => Array.from({ length: 19 }, () => Stone.EMPTY));
    original = new Board(19, originalState);
  });

  it('copy() is a function that creates a copy of the board', () => {
    const copy = original.copy();
    expect(copy).not.toBe(original); // 서로 다른 객체
    expect(copy.state).toEqual(original.state);
    originalState[0][0] = Stone.BLACK;
    expect(copy.state).toEqual(original.state); // 원본 객체 변경해도 복사본은 영향 없음
  });

  it('should not be affected by external array modification after construction', () => {
    // 외부 배열 변경
    originalState[0][0] = Stone.BLACK;

    // board 내부 상태는 변하지 않아야 함
    expect(original.state[0][0]).toBe(Stone.EMPTY);
  });
});
