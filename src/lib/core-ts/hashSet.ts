import type { Hashable } from '@/lib/core-ts/hashable';

class HashSet<T extends Hashable> implements Hashable, Iterable<T> {
  private store = new Map<number, T>();

  constructor(items?: T[]) {
    if (items) {
      this.addAll(items);
    }
  }

  add(item: T) {
    this.store.set(item.hashCode(), item);
  }

  addAll(items: T[]) {
    for (const item of items) {
      this.add(item);
    }
  }

  has(item: T): boolean {
    return this.store.has(item.hashCode());
  }

  *values(): IterableIterator<T> {
    yield* this.store.values();
  }

  get size(): number {
    return this.store.size;
  }

  hashCode(): number {
    // 모든 원소의 hashCode를 합산
    let result = 0;
    for (const item of this.store.values()) {
      result += item.hashCode();
    }
    return result;
  }

  equals(other: unknown): boolean {
    if (!(other instanceof HashSet)) return false;
    if (this.size !== other.size) return false;
    for (const v of this.values()) {
      if (!other.has(v)) return false;
    }
    return true;
  }

  [Symbol.iterator](): Iterator<T> {
    return this.store.values()[Symbol.iterator]();
  }

  toString(): string {
    return `HashSet(${[...this.values()].join(', ')})`;
  }
}

export default HashSet;
