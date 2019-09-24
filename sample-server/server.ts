import { listenAndServe, ServerRequest, Response } from "https://deno.land/std/http/server.ts";

const { permissions } = Deno;
const body: Uint8Array = new TextEncoder().encode("Hello World\n");

export async function startServer(addr: string): Promise<void> {
  if (!permissions().net) {
    throw new Error("Server requires network permission");
  }

  console.log(`Listening ${addr}`);

  await listenAndServe(addr, async (request: ServerRequest) => {
    let response: Response = {
      body: body
    };

    await request.respond(response);
  });
}
