import { start } from "./server.ts";

const host: string = "localhost";
const port: number = 2312;

window.onload = async () => {
  console.log(`Starting server at ${host} on ${port}`);

  await start(`${host}:${port}`);
};
