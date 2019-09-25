import { IQueue } from "./queue.ts";

export interface BatchedIteratorOptions {
  maxBatchSize?: number;
  maxWaitTime?: number;
  interval?: number;
}

export class BatchedIterator<T> implements AsyncIterator<T[]> {
  private _queue: IQueue<T>;

  private _maxBatchSize: number;
  private _maxWaitTime: number;
  private _interval: number;

  public constructor(queue: IQueue<T>, options: BatchedIteratorOptions) {
    this._queue = queue;

    this._maxBatchSize = options.maxBatchSize;
    this._maxWaitTime = options.maxWaitTime;
    this._interval = options.interval;
  }

  private async waitInterval(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this._interval));
  }

  public async next(): Promise<IteratorResult<T[]>> {
    let i: number = 0;

    while (i++ * this._interval < this._maxWaitTime && (await this._queue.countPending()) < this._maxBatchSize) {
      await this.waitInterval();
    }

    return <IteratorResult<T[]>>{ done: false, value: await this._queue.dequeue(this._maxBatchSize) };
  }

  public async return?(value?: any): Promise<IteratorResult<T[]>> {
    return <IteratorResult<T[]>>{ value };
  }

  public throw?(e?: any): Promise<IteratorResult<T[]>> {
    throw new Error("Method not implemented.");
  }
}

export class BatchedIterable<T> implements AsyncIterable<T[]> {
  private _iterator: BatchedIterator<T>;

  public constructor(iterator: BatchedIterator<T>) {
    this._iterator = iterator;
  }

  [Symbol.asyncIterator](): AsyncIterator<T[]> {
    return this._iterator;
  }
}
