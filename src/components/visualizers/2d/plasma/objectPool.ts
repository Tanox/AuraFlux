// File: src/components/visualizers/2d/plasma/objectPool.ts | Version: v2.3.4

export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;

  constructor(factory: () => T) {
    this.factory = factory;
  }

  get(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.factory();
  }

  release(item: T): void {
    this.pool.push(item);
  }

  clear(): void {
    this.pool = [];
  }

  getSize(): number {
    return this.pool.length;
  }
}
