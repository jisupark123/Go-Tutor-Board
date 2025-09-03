import type { Hashable } from '@/lib/core-ts/hashable';

class HashMap<K extends Hashable, V> {
  // 내부 Map: hash number → { key, value } 쌍 저장
  private store = new Map<number, { key: K; value: V }>();

  get size(): number {
    return this.store.size;
  }

  set(key: K, value: V) {
    this.store.set(key.hashCode(), { key, value });
  }

  get(key: K): V | undefined {
    return this.store.get(key.hashCode())?.value;
  }

  has(key: K): boolean {
    return this.store.has(key.hashCode());
  }

  // keys() → K 객체 순회 가능
  *keys(): IterableIterator<K> {
    for (const { key } of this.store.values()) {
      yield key;
    }
  }

  // values() → V 객체 순회 가능
  *values(): IterableIterator<V> {
    for (const { value } of this.store.values()) {
      yield value;
    }
  }

  // [Symbol.iterator]를 구현하면 for..of 순회 가능
  [Symbol.iterator](): IterableIterator<{ key: K; value: V }> {
    return this.store.values();
  }
}

export default HashMap;
