import { describe, it, expect, beforeEach } from 'vitest';

import Coordinate from '@/lib/go-kit/core/model/coordinate';

describe('Coordinate', () => {
  let original: Coordinate;
  beforeEach(() => {
    original = new Coordinate(2, 3);
  });

  it('copy() is a function that creates a copy of the coordinate', () => {
    const copy = original.copy();
    expect(copy).not.toBe(original); // 서로 다른 객체
    expect(copy.y).toBe(original.y);
    expect(copy.x).toBe(original.x);
    expect(copy).toEqual(original); // 값 동일
  });
});
