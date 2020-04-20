//  Queue Interface

export interface IQueue<T> {
  countPending(): Promise<number>;

  queueOne(entry: T): Promise<void>;
  queue(entries: T[]): Promise<void>;

  dequeueOne(): Promise<T>;
  dequeue(qty: number): Promise<T[]>;
}

//  Memory Queue Enums

export enum MemoryQueueOverflowBehavior {
  //  Do not queue if queue is full
  SuppressLast = 0,
  //  Remove oldest if queue is full
  SuppressFirst
}

//  Memory Queue Interfaces

export interface MemoryQueueOptions {
  maxSize?: number;
  overflowBehavior?: MemoryQueueOverflowBehavior;
}

//  Memory Queue Implementation

export class MemoryQueue<T> implements IQueue<T> {
  _queue: T[];

  _maxSize?: number;
  _overflowBehavior: MemoryQueueOverflowBehavior;

  public constructor(options: MemoryQueueOptions) {
    this._queue = [];

    //  Max Size can be undefined (no restrictions)
    if (options !== undefined && options.maxSize !== undefined) {
      //  Max size must be positif value
      this._maxSize = Math.max(0, options.maxSize);
    }

    // Overflow Behavior only applies if there is a max size
    if (this._maxSize !== undefined) {
      //  Default behavior is SuppressLast
      if (options !== undefined && options.overflowBehavior !== undefined) {
        this._overflowBehavior = options.overflowBehavior;
      } else {
        this._overflowBehavior = MemoryQueueOverflowBehavior.SuppressLast;
      }
    }
  }

  public async countPending(): Promise<number> {
    return this._queue.length;
  }

  public async queueOne(entry: T): Promise<void> {
    if (this._maxSize === undefined || (await this.countPending()) < this._maxSize) {
      this._queue.unshift(entry);
    }
  }

  public async queue(entries: T[]): Promise<void> {
    let pending: number = await this.countPending();

    if (this._maxSize === undefined || pending < this._maxSize) {
      this._queue.unshift(...entries);
    } else {
      let entriesToQueue: T[];

      if (this._overflowBehavior === MemoryQueueOverflowBehavior.SuppressLast) {
        entriesToQueue = entries.splice(0, this._maxSize - pending);
      } else {
        entriesToQueue = entries;
      }

      if (this._overflowBehavior === MemoryQueueOverflowBehavior.SuppressFirst) {
        
      }

      this._queue.unshift(...entriesToQueue);
    }
  }

  public async dequeueOne(): Promise<T> {
    return this.dequeue(1)[0];
  }

  public async dequeue(qty: number): Promise<T[]> {
    return this._queue.splice(0, qty);
  }
}
