# Narrate.AI V13 — Smoke Test Suite

A **dependency-free** test suite for fast, confident iteration. It uses only Node's
built-in test runner (`node --test`, Node 18+) plus a self-contained browser page.
There is no `npm install`, no `package.json`, and no build step.

## What is covered

| Layer | File | Run with | Covers |
|-------|------|----------|--------|
| Pure logic | `tests/core.test.js` | `node --test` | chunk splitting, chunk-size clamping, slugify, hashing, **unique project IDs**, token normalization |
| Backend API | `tests/backend.test.js` | `node --test` | static serving (incl. `core.js` + vendored mammoth), path-traversal guard, projects CRUD, ghost recovery, cache check, generate validation + cache-hit, **FFmpeg merge** (chapter + book) |
| Frontend UI | `tests/browser/smoke.html` | open in a browser | loads the **real app** in a hidden frame and asserts: analyze→chapters, unique/stable IDs, timeline render, **incremental playback highlight**, inline rename, `.txt` import, parallel pool concurrency |

The FFmpeg merge test auto-skips if `ffmpeg` is not on `PATH`.

## Running

### Backend + core logic (command line)

```bash
cd V13.0
node --test            # runs every tests/*.test.js
```

Expected tail:

```
# tests 23
# pass 23
# fail 0
```

Or use the helper:

```bash
sh tests/run.sh
```

### Frontend (browser)

1. Start the server: `node src/backend/server.js`
2. Open <http://localhost:3000/tests/browser/smoke.html>
3. The page runs ~14 assertions against the live app and shows a green
   **"All tests passed"** banner (or red with the failing assertions listed).
   Results are also on `window.__SMOKE_RESULTS__` for automation.

## Notes for future development

- Add new pure helpers to `src/frontend/js/core.js` and a case to `core.test.js`.
- New API endpoints: add a case to `backend.test.js` (the `H.startServer()` helper boots
  an isolated server in a temp dir on a free port — nothing touches your real `output/`).
- New UI behaviour: add an assertion to `tests/browser/smoke.html`.
