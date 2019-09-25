import { listenAndServe, ServerRequest, Response } from "https://deno.land/std/http/server.ts";

import { IQueue, MemoryQueue } from "./queue.ts";
import { BatchedIteratorOptions, BatchedIterator, BatchedIterable } from "./batch.ts";

const { permissions } = Deno;
const body: Uint8Array = new TextEncoder().encode("Hello World\n");

async function startLogger(logIterator: BatchedIterator<string>): Promise<void> {
  let logIterable = new BatchedIterable<string>(logIterator);

  for await (let logBatch of logIterable) {
    console.log(`Received batch of ${logBatch.length} logs`);

    logBatch.forEach(log => {
      console.log(log);
    });
  }
}

async function startServer(addr: string, logQueue: IQueue<string>): Promise<void> {
  await listenAndServe(addr, async (request: ServerRequest) => {
    logQueue.queueOne(`Received one call at ${Date.now()}`);

    let response: Response = {
      body: body
    };

    await request.respond(response);
  });
}

export async function start(addr: string): Promise<void> {
  if (!permissions().net) {
    throw new Error("Server requires network permission");
  }

  let logQueue: IQueue<string> = new MemoryQueue<string>();

  let logIteratorOptions: BatchedIteratorOptions = {
    maxBatchSize: 100,
    maxWaitTime: 5000,
    interval: 100
  };
  let logIterator: BatchedIterator<string> = new BatchedIterator<string>(logQueue, logIteratorOptions);

  let logger = startLogger(logIterator);
  let serverPromise = startServer(addr, logQueue);

  Promise.all([logger, serverPromise]);
}
