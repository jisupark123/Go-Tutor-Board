class UniqueSet<T> {
  private map = new Map<string, T>();
  private getKey: (item: T) => string;

  constructor(getKey: (item: T) => string) {
    this.getKey = getKey;
  }

  add(item: T) {
    this.map.set(this.getKey(item), item);
  }

  has(item: T): boolean {
    return this.map.has(this.getKey(item));
  }

  values(): T[] {
    return Array.from(this.map.values());
  }

  toSet(): Set<T> {
    return new Set(this.map.values());
  }
}

export default UniqueSet;
