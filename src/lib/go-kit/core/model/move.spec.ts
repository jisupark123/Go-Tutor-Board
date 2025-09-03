import { describe, it, expect, beforeEach } from 'vitest';

import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';

describe('Move', () => {
  let original: Move;
  beforeEach(() => {
    original = new Move(2, 3, Stone.BLACK);
  });

  it('copy() is a function that creates a copy of the move', () => {
    const copy = original.copy();
    expect(copy).not.toBe(original); // 서로 다른 객체
    expect(copy.y).toBe(original.y);
    expect(copy.x).toBe(original.x);
    expect(copy.stone).toBe(original.stone);
    expect(copy).toEqual(original); // 값 동일
  });
});
