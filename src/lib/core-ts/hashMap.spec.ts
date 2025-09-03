import { describe, it, expect } from 'vitest';

import type { Hashable } from '@/lib/core-ts/hashable';
import HashMap from '@/lib/core-ts/hashMap';

class HashableClass implements Hashable {
  private id: number;

  constructor(id: number) {
    this.id = id;
  }
  hashCode(): number {
    return this.id;
  }

  equals(other: unknown): boolean {
    if (!(other instanceof HashableClass)) return false;
    return this.id === other.id;
  }
}

describe('HashMap', () => {
  it('should set and get values by Hashable key', () => {
    const map = new HashMap<Hashable, string>();

    const key1 = new HashableClass(1);
    const key2 = new HashableClass(2);

    map.set(key1, 'A');
    map.set(key2, 'B');

    expect(map.get(key1)).toBe('A');
    expect(map.get(key2)).toBe('B');
  });

  it('should return undefined for keys not present', () => {
    const map = new HashMap<Hashable, string>();
    const key = new HashableClass(3);
    expect(map.get(key)).toBeUndefined();
  });

  it('should correctly report has()', () => {
    const map = new HashMap<Hashable, string>();
    const key1 = new HashableClass(1);
    const key2 = new HashableClass(2);

    map.set(key1, 'A');
    expect(map.has(key1)).toBe(true);
    expect(map.has(key2)).toBe(false);
  });

  it('should handle different instances with same content as same key', () => {
    const map = new HashMap<Hashable, string>();
    const key1 = new HashableClass(1);
    const key2 = new HashableClass(1); // 다른 인스턴스지만 hash 같음

    map.set(key1, 'A');
    expect(map.get(key2)).toBe('A'); // hash 기반 키이므로 동일
    expect(map.has(key2)).toBe(true);
  });

  it('should overwrite value for same key', () => {
    const map = new HashMap<Hashable, string>();
    const key = new HashableClass(1);

    map.set(key, 'A');
    map.set(new HashableClass(1), 'B'); // hash 같음 → 덮어쓰기
    expect(map.get(key)).toBe('B');
  });

  it('should iterate over stored { key, value } pairs', () => {
    const map = new HashMap<Hashable, string>();
    const key1 = new HashableClass(1);
    const key2 = new HashableClass(2);

    map.set(key1, 'A');
    map.set(key2, 'B');

    const entries = [...map]; // iterator 동작 확인

    expect(entries).toHaveLength(2);
    expect(entries).toEqual(
      expect.arrayContaining([
        { key: key1, value: 'A' },
        { key: key2, value: 'B' },
      ]),
    );
  });

  it('should return empty iterator for empty map', () => {
    const map = new HashMap<Hashable, string>();
    const entries = [...map];
    expect(entries).toEqual([]);
  });
});
