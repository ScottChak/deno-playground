import {
  listenAndServe,
  ServerRequest,
  Response
} from "https://deno.land/std/http/server.ts";

const host: string = "localhost";
const port: number = 2312;

const body: Uint8Array = new TextEncoder().encode("Hello World\n");

console.log(`Listening at ${host} on ${port}`);

window.onload = async () => {
  await listenAndServe(`${host}:${port}`, async (request: ServerRequest) => {
    let response: Response = {
      body: body
    };

    await request.respond(response);
  });
};
