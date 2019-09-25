export interface IQueue<T> {
  queueOne(entry: T): Promise<void>;

  countPending(): Promise<number>;

  dequeueOne(): Promise<T>;
  dequeue(qty: number): Promise<T[]>;
}

export class MemoryQueue<T> implements IQueue<T> {
  _queue: T[];

  public constructor() {
    this._queue = [];
  }

  public async queueOne(entry: T): Promise<void> {
    this._queue.unshift(entry);
  }

  public async countPending(): Promise<number> {
    return this._queue.length;
  }

  public async dequeueOne(): Promise<T> {
    return this.dequeue(1)[0];
  }

  public async dequeue(qty: number): Promise<T[]> {
    return this._queue.splice(0, qty);
  }
}
