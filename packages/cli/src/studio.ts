import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import { createServer } from "node:http";
import { exec } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkThemeContrast, validateConfig } from "@super-system/tokens";
import { readConfig, writeConfig } from "./files.js";

const studioDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "studio");

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".map": "application/json"
};

function openBrowser(url: string): void {
  const command =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${command} ${JSON.stringify(url)}`);
}

async function body(request: import("node:http").IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function serveStatic(urlPath: string, response: import("node:http").ServerResponse): Promise<boolean> {
  const relativePath = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.join(studioDir, relativePath);
  if (!filePath.startsWith(studioDir)) {
    response.statusCode = 403;
    response.end("Forbidden");
    return true;
  }

  try {
    await access(filePath);
  } catch {
    return false;
  }

  const extension = path.extname(filePath);
  response.setHeader("content-type", contentTypes[extension] ?? "application/octet-stream");
  createReadStream(filePath).pipe(response);
  return true;
}

export async function startStudio(cwd: string, port = 4173, launch = true): Promise<void> {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");

      if (url.pathname === "/api/config" && request.method === "GET") {
        response.setHeader("content-type", "application/json");
        response.end(JSON.stringify(await readConfig(cwd)));
        return;
      }

      if (url.pathname === "/api/config" && request.method === "POST") {
        const config = validateConfig(await body(request));
        await writeConfig(cwd, config);
        response.end("ok");
        return;
      }

      if (url.pathname === "/api/contrast" && request.method === "POST") {
        response.setHeader("content-type", "application/json");
        response.end(JSON.stringify(checkThemeContrast(validateConfig(await body(request)))));
        return;
      }

      if (request.method === "GET" && (await serveStatic(url.pathname, response))) {
        return;
      }

      response.statusCode = 404;
      response.end("Not found");
    } catch (error) {
      response.statusCode = 400;
      response.end(error instanceof Error ? error.message : "Unknown error");
    }
  });

  await new Promise<void>((resolve) => server.listen(port, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${port}`;
  console.log(`Super System Studio: ${url}`);
  console.log("Press Ctrl+C to stop.");
  if (launch) openBrowser(url);
}
