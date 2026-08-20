import { cp } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(__dirname, "../../studio-ui/dist/server");
const target = path.resolve(__dirname, "../dist/studio");

await cp(source, target, { recursive: true });
console.log("Copied studio-ui server bundle into CLI dist.");
