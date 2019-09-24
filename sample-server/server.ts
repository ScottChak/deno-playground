import { serve } from "https://deno.land/std/http/server.ts";

const host: string = "localhost";
const port: number = 2312;

const body = new TextEncoder().encode("Hello World\n");
const s = serve(`${host}:${port}`);

console.log(`Listening at ${host} on ${port}`);

window.onload = async () => {
  for await (const req of s) {
    req.respond({ body });
  }
};
