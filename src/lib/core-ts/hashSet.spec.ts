import { describe, expect, it } from 'vitest';

import HashSet from '@/lib/core-ts/hashSet';
import Coordinate from '@/lib/go-kit/core/model/coordinate';

describe('HashSet', () => {
  it('should add and check items', () => {
    const set = new HashSet<Coordinate>();
    const a = new Coordinate(0, 0);
    const b = new Coordinate(1, 1);

    set.add(a);
    expect(set.has(a)).toBe(true);
    expect(set.has(b)).toBe(false);

    set.add(b);
    expect(set.has(b)).toBe(true);
    expect(set.size).toBe(2);
  });

  it('should addAll items', () => {
    const items = [new Coordinate(0, 0), new Coordinate(1, 1)];
    const set = new HashSet<Coordinate>();
    set.addAll(items);
    expect(set.size).toBe(2);
    expect(set.has(items[0])).toBe(true);
    expect(set.has(items[1])).toBe(true);
  });

  it('should compare sets with equals', () => {
    const set1 = new HashSet<Coordinate>([new Coordinate(0, 0), new Coordinate(1, 1)]);
    const set2 = new HashSet<Coordinate>([new Coordinate(1, 1), new Coordinate(0, 0)]);
    const set3 = new HashSet<Coordinate>([new Coordinate(0, 1)]);

    expect(set1.equals(set2)).toBe(true); // 순서 상관없이 같음
    expect(set1.equals(set3)).toBe(false);
  });

  it('should produce consistent hash', () => {
    const set1 = new HashSet<Coordinate>([new Coordinate(0, 0), new Coordinate(1, 1)]);
    const set2 = new HashSet<Coordinate>([new Coordinate(1, 1), new Coordinate(0, 0)]);

    expect(set1.hashCode()).toBe(set2.hashCode()); // 순서와 관계없이 같은 hash
  });

  it('should be iterable', () => {
    const coords = [new Coordinate(0, 0), new Coordinate(1, 1)];
    const set = new HashSet<Coordinate>(coords);

    const collected: Coordinate[] = [];
    for (const c of set) {
      collected.push(c);
    }

    expect(collected.length).toBe(coords.length);
    expect(collected.every((c) => set.has(c))).toBe(true);
  });
});
