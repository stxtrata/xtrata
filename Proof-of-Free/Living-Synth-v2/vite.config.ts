import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const root = dirname(fileURLToPath(import.meta.url));
const SIMULATED_ENGINE_ID = 1;

function simulatedMintRoutes(): Plugin {
  return {
    name: "proof-of-free-simulated-mints",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const path = new URL(request.url ?? "/", "http://localhost").pathname;
        let file: string | null = null;
        let contentType = "";

        if (path === `/i/${SIMULATED_ENGINE_ID}`) {
          file = resolve(root, "artifacts/proof-of-free-engine.js");
          contentType = "text/javascript; charset=utf-8";
        } else {
          const match = path.match(/^\/simulated-mints\/(\d{4})\.html$/);
          if (match) {
            file = resolve(root, "release/seeds", `proof-of-free-${match[1]}.html`);
            contentType = "text/html; charset=utf-8";
          }
        }

        if (!file) {
          next();
          return;
        }

        try {
          response.statusCode = 200;
          response.setHeader("Content-Type", contentType);
          response.setHeader("Cache-Control", "no-store");
          response.end(await readFile(file));
        } catch {
          response.statusCode = 404;
          response.setHeader("Content-Type", "text/plain; charset=utf-8");
          response.end("Run npm run preview:mints to generate the simulated mint release.");
        }
      });
    }
  };
}

export default defineConfig({
  base: "./",
  server: { port: 4173 },
  plugins: [simulatedMintRoutes()],
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        app: resolve(root, "index.html"),
        mintPreview: resolve(root, "mint-preview.html")
      }
    }
  }
});
