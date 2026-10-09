// tools/serve.mjs — tiny static server for the test harnesses (no dependencies).
// Serves xtrata-2.0/public so /audionaut/daw.html and /audionaut/tools/* resolve as in production.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".webp": "image/webp", ".woff2": "font/woff2" };

export function serve(port = 0) {
  const srv = http.createServer((req, res) => {
    const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let f = path.join(ROOT, u);
    if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    fs.readFile(f, (err, data) => {
      if (err) { res.writeHead(404); return res.end("not found"); }
      res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream", "cache-control": "no-store" });
      res.end(data);
    });
  });
  return new Promise((ok) => srv.listen(port, "127.0.0.1", () => ok({ srv, url: `http://127.0.0.1:${srv.address().port}` })));
}

// Launch headless Chromium (Playwright from the environment or a local install).
export async function browser() {
  let pw;
  for (const p of ["playwright", "/opt/npm-tools/node_modules/playwright/index.mjs"]) {
    try { pw = await import(p); break; } catch { /* try next */ }
  }
  if (!pw) throw new Error("Playwright not found — npm i -g playwright");
  const chromium = pw.chromium || pw.default.chromium;
  return chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
}

// a page that never touches the network beyond our server (fonts etc. are aborted)
export async function page(b, url, { width = 1400, height = 900, logs = [] } = {}) {
  const p = await b.newPage({ viewport: { width, height } });
  await p.route("**/*", (r) => (r.request().url().startsWith(url) ? r.continue() : r.abort()));
  p.on("console", (m) => {
    const t = m.text();
    if (m.type() === "error" && /Failed to load resource/.test(t)) return; // externals are aborted; local 404s are caught below
    if (m.type() === "error" || m.type() === "warning") logs.push(`${m.type()}: ${t}`);
  });
  p.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));
  p.on("response", (r) => { if (r.url().startsWith(url) && r.status() >= 400) logs.push(`http ${r.status()}: ${r.url().slice(url.length)}`); });
  return p;
}
