// File: src/components/visualizers/modes/plasma/objectPool.ts | Version: v2.2.23

export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;

  constructor(createFn: () => T) {
    this.createFn = createFn;
  }

  get(): T {
    return this.pool.length > 0 ? this.pool.pop()! : this.createFn();
  }

  release(item: T): void {
    this.pool.push(item);
  }
}
