import { startServer } from "./server.ts";

const host: string = "localhost";
const port: number = 2312;

console.log(`Starting server at ${host} on ${port}`);

window.onload = async () => {
  await startServer(`${host}:${port}`);
};
